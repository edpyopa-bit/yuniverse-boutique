import crypto from "crypto";
import fs from "fs";
import path from "path";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // Epoch in seconds

// Extractor of Sheet ID from complete URLs or raw entries
export function extractSpreadsheetId(input: string): string {
  if (!input) return "";
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : input.trim();
}

// Helper to check if Google Service Account is available
export function isGoogleServiceAccountAvailable(): boolean {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)) {
    return true;
  }
  const saPath = path.join(process.cwd(), "google-service-account.json");
  return fs.existsSync(saPath);
}

// Helper to get access token using Service Account with RS256 signing
async function getAccessToken(): Promise<string> {
  // Check if token in memory is still valid (with 5-minute buffer)
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 300) {
    return cachedToken;
  }

  let sa: ServiceAccount | null = null;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      sa = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
    } catch (e: any) {
      throw new Error("Format variable GOOGLE_SERVICE_ACCOUNT_JSON bukan JSON valid: " + e.message);
    }
  } else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    sa = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  } else {
    const saPath = path.join(process.cwd(), "google-service-account.json");
    if (!fs.existsSync(saPath)) {
      throw new Error("Kunci Google Service Account tidak ditemukan. Sediakan file google-service-account.json atau isi variable environment GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.");
    }
    const saContent = fs.readFileSync(saPath, "utf8");
    sa = JSON.parse(saContent) as ServiceAccount;
  }

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const claimSet = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64UrlClaimSet = Buffer.from(JSON.stringify(claimSet)).toString("base64url");
  const signatureInput = `${base64UrlHeader}.${base64UrlClaimSet}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signatureInput);
  const signature = sign.sign(sa.private_key, "base64url");

  const jwt = `${signatureInput}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gagal mendapatkan access token Google: ${errText}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in;
  return cachedToken;
}

// Map order object to cell row values
function orderToRow(order: any): any[] {
  const itemsStr = order.items
    .map((it: any) => `${it.quantity}x ${it.name} (${it.size}) - Rp${(it.price * it.quantity).toLocaleString("id-ID")}`)
    .join("\n");
    
  return [
    order.id,
    new Date(order.createdAt).toLocaleString("id-ID"),
    order.userName,
    order.userEmail,
    order.paymentMethod === "qris" ? "QRIS" : "Cash / Tunai",
    order.paymentStatus === "paid" ? "Lunas" : "Belum Lunas",
    order.status === "pending"
      ? "Menunggu"
      : order.status === "processing"
      ? "Diproses"
      : order.status === "shipped"
      ? "Dikirim"
      : order.status === "completed"
      ? "Selesai"
      : "Dibatalkan",
    order.totalAmount,
    itemsStr,
    order.notes || ""
  ];
}

// Sync all boutique orders to a specific Google Sheet
export async function syncAllOrdersToSheet(
  spreadsheetId: string,
  orders: any[]
): Promise<{ success: boolean; message: string; rowsSynced: number }> {
  try {
    const rawId = extractSpreadsheetId(spreadsheetId);
    if (!rawId) {
      return { success: false, message: "ID Google Spreadsheet tidak valid", rowsSynced: 0 };
    }

    const token = await getAccessToken();

    const headers = [
      "ID Pesanan",
      "Tanggal Pemesanan",
      "Nama Pelanggan",
      "Email Pelanggan",
      "Metode Pembayaran",
      "Status Pembayaran",
      "Status Pesanan",
      "Total Belanja (IDR)",
      "Daftar Item",
      "Catatan Pembeli"
    ];

    const rows = [headers, ...orders.map(orderToRow)];

    // Fetch spreadsheet tabs metadata to get the first tab name
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${rawId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!metaRes.ok) {
      const errText = await metaRes.text();
      return { success: false, message: `Gagal membaca spreadsheet: ${errText}`, rowsSynced: 0 };
    }

    const metaData = (await metaRes.json()) as any;
    const firstSheetName = metaData.sheets?.[0]?.properties?.title || "Sheet1";

    // Clear range first to prevent stale rows
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${rawId}/values/${encodeURIComponent(firstSheetName)}!A1:Z5000:clear`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    // Write all rows from A1
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${rawId}/values/${encodeURIComponent(firstSheetName)}!A1?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          range: `${firstSheetName}!A1`,
          majorDimension: "ROWS",
          values: rows
        })
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return { success: false, message: `Gagal memperbarui spreadsheet: ${errText}`, rowsSynced: 0 };
    }

    return {
      success: true,
      message: "Seluruh riwayat pesanan butik berhasil disinkronisasi ke Google Sheet Anda!",
      rowsSynced: orders.length
    };
  } catch (error: any) {
    console.error("Error in syncAllOrdersToSheet:", error);
    return { success: false, message: error.message || "Gagal melakukan sinkronisasi", rowsSynced: 0 };
  }
}

// Append a single new order row to the Google Sheet
export async function appendOrderToSheet(spreadsheetId: string, order: any): Promise<{ success: boolean; message: string }> {
  try {
    const rawId = extractSpreadsheetId(spreadsheetId);
    if (!rawId) {
      return { success: false, message: "ID Google Spreadsheet tidak valid" };
    }

    const token = await getAccessToken();

    // Fetch sheets metadata
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${rawId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!metaRes.ok) {
      return { success: false, message: "Gagal menyambungkan ke Google Spreadsheet untuk pencatatan otomatis." };
    }

    const metaData = (await metaRes.json()) as any;
    const firstSheetName = metaData.sheets?.[0]?.properties?.title || "Sheet1";

    const row = orderToRow(order);

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${rawId}/values/${encodeURIComponent(firstSheetName)}!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          range: `${firstSheetName}!A1`,
          majorDimension: "ROWS",
          values: [row]
        })
      }
    );

    if (!appendRes.ok) {
      const errText = await appendRes.text();
      return { success: false, message: `Gagal auto-pend order ke spreadsheet: ${errText}` };
    }

    return { success: true, message: "Pesanan baru berhasil dicatat otomatis di Google Sheet!" };
  } catch (error: any) {
    console.error("Error in appendOrderToSheet:", error);
    return { success: false, message: error.message || "Gagal auto-pencatatan Google Sheet" };
  }
}
