// Browser-based Mock Backend for client-only hosting (e.g. Netlify/GitHub Pages)
// It mirrors server.ts functionality, seeded with initial data, saved to localStorage

const LOCAL_DB_KEY = "yuniverse_local_db";

const initialDB = {
  users: [
    {
      id: "usr_admin",
      name: "Admin Yuniverse",
      email: "admin@yuniverse.com",
      password: "adminpassword",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr_user1",
      name: "Siti Rahma",
      email: "user@gmail.com",
      password: "userpassword",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      id: "prod_1",
      name: "Kamila Floral Wrap Dress",
      category: "Dress",
      description: "Dress premium dengan bahan silk linen bertekstur lembut dan jatuh indah saat dikenakan. Motif floral bernuansa pastel eksklusif yang memancarkan aura keanggunan abadi. Dilengkapi dengan belt yang dapat disesuaikan untuk siluet ramping.",
      price: 489000,
      stock: 12,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      sizes: ["S", "M", "L"],
      isFeatured: true,
    },
    {
      id: "prod_2",
      name: "Alana Executive Linen Blazer",
      category: "Outerwear",
      description: "Blazer kasual-formal dengan potongan relaxed fit kontemporer. Menggunakan bahan import linen slub ramah lingkungan yang sejuk dan breathable. Sempurna untuk tampilan smart-casual dari siang hari hingga malam.",
      price: 520000,
      stock: 8,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
      sizes: ["S", "M", "L", "XL"],
      isFeatured: true,
    },
    {
      id: "prod_3",
      name: "Senja Silk Tunik",
      category: "Baju",
      description: "Tunik eksklusif bermotif etnik abstrak hasil kolaborasi dengan pengrajin lokal. Terbuat dari premium mulberry silk jacquard yang berkilau mewah namun tetap bersahaja. Dilengkapi detail kerah Shanghai dan kancing fungsional.",
      price: 389000,
      stock: 15,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
      sizes: ["M", "L", "XL"],
      isFeatured: true,
    },
    {
      id: "prod_4",
      name: "Prameswari Modern Kebaya Set",
      category: "Dress",
      description: "Setelan Kebaya brokat modern dengan aksen payet hand-sewn mewah di area leher dan dada. Dipadukan dengan rok span batik motif parang klasik dengan belahan samping tersembunyi yang memudahkan pergerakan.",
      price: 899000,
      stock: 5,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      sizes: ["S", "M", "L"],
      isFeatured: false,
    },
    {
      id: "prod_5",
      name: "Sonia Pleated Chiffon Blouse",
      category: "Baju",
      description: "Blouse feminin dengan detail lipit halus (pleats) di bagian dada dan lengan balon yang modis. Menggunakan double layer ceruti chiffon premium yang transparan namun dilengkapi furing katun yang nyaman menyerap keringat.",
      price: 299000,
      stock: 20,
      image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&auto=format&fit=crop&q=80",
      sizes: ["S", "M", "L"],
      isFeatured: false,
    },
    {
      id: "prod_6",
      name: "Lumina Satin Culotte Pants",
      category: "Celana",
      description: "Celana kulot berbahan satin silk tebal berkualitas tinggi dengan efek drape berayun yang indah. Memiliki pinggang karet elastis di bagian belakang untuk fit sempurna, serta saku samping fungsional.",
      price: 349000,
      stock: 10,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
      sizes: ["M", "L", "XL"],
      isFeatured: false,
    }
  ],
  orders: [
    {
      id: "ord_1001",
      userId: "usr_user1",
      userName: "Siti Rahma",
      userEmail: "user@gmail.com",
      items: [
        {
          productId: "prod_1",
          name: "Kamila Floral Wrap Dress",
          size: "M",
          quantity: 1,
          price: 489000
        }
      ],
      totalAmount: 489000,
      paymentMethod: "qris",
      paymentStatus: "paid",
      status: "completed",
      notes: "Kirim sebelum jam 5 sore ya, terima kasih!",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "ord_1002",
      userId: "usr_user1",
      userName: "Siti Rahma",
      userEmail: "user@gmail.com",
      items: [
        {
          productId: "prod_3",
          name: "Senja Silk Tunik",
          size: "L",
          quantity: 2,
          price: 389000
        }
      ],
      totalAmount: 778000,
      paymentMethod: "cash",
      paymentStatus: "pending",
      status: "pending",
      notes: "Bayar di tempat pas COD",
      createdAt: new Date().toISOString(),
    }
  ],
  settings: {
    boutiqueName: "Yuniverse Boutique",
    boutiquePhone: "+6282344679356",
    address: "Ruko Emerald blok F No. 12, Jl. Raden Patah, Jakarta Pusat",
    announcement: "✨ Koleksi Eksklusif Musim Panas Terbatas Kini Tersedia! Dapatkan Gratis Ongkir Jabodetabek! ✨",
    heroTitle: "Eksklusivitas yang Memancarkan Pesona Menawan Anda",
    heroSubtitle: "Koleksi busana berkualitas tinggi hasil rancangan desainer butik Yuniverse untuk menyempurnakan penampilan anggun dan fungsional di setiap momen berharga Anda.",
    heroBannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
    aboutTitle: "Eksklusivitas Tak Lekang Oleh Waktu 🌸",
    aboutDescription: "Didirikan dengan impian untuk membawa warisan kerajinan tekstil Indonesia ke dalam jajaran busana modern yang anggun dan dinamis. Yuniverse Boutique berkomitmen menjaga mutu dan kepuasan setiap pelanggan berharga kami.",
    aboutImageUrl: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=1000&auto=format&fit=crop&q=80",
    aboutConsultationText: "Memiliki pertanyaan khusus mengenai furing gaun, kesesuaian lekuk pinggang size tertentu, atau ingin mengajukan custom design brokat pernikahan? Jangan ragu menghubungi penasehat desainer profesional kami via chat WhatsApp.",
    instagramUrl: "https://instagram.com/yuniverse.boutique",
    footerQuote: "🌸 Koleksi Busana Seni Desain Eksklusif Terdaftar Resmi.",
    googleSpreadsheetId: ""
  },
  emails: [
    {
      id: "eml_1",
      from: "notifikasi@yuniverseboutique.com",
      to: "admin@yuniverse.com",
      subject: "🔔 PESANAN BARU MASUK: #ord_1002 - Siti Rahma",
      body: `<h3>Detail Pesanan Baru masuk di Yuniverse Boutique</h3>
            <p><strong>ID Pesanan:</strong> #ord_1002</p>
            <p><strong>Pemesan:</strong> Siti Rahma (user@gmail.com)</p>
            <p><strong>Item Pesanan:</strong></p>
            <ul>
              <li>2x Senja Silk Tunik (Size: L) - Rp 389.000 (Subtotal: Rp 778.000)</li>
            </ul>
            <p><strong>Total Pembayaran:</strong> Rp 778.000</p>
            <p><strong>Metode Pembayaran:</strong> Cash / Tunai</p>
            <p><strong>Catatan:</strong> Bayar di tempat pas COD</p>
            <hr />
            <p>Silakan proses pesanan di Dashboard Admin dan hubungi pembeli via WhatsApp!</p>`,
      sentAt: new Date().toISOString()
    }
  ]
};

// Get localized DB or initialize it
function getLocalDB(): typeof initialDB {
  const data = localStorage.getItem(LOCAL_DB_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialDB));
    return initialDB;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initialDB));
    return initialDB;
  }
}

function saveLocalDB(db: any) {
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
}

// Generate an HTTP-like Response representation
function makeResponse(status: number, statusText: string, data: any) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const response = new Response(blob, {
    status,
    statusText,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}

// Extract auth token user from Authorization header
function getUserByHeader(authHeader: string | null, db: typeof initialDB) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token_", "");
  return db.users.find((u) => u.id === userId) || null;
}

// Virtual Router
export async function handleMockRequest(url: string, init?: RequestInit): Promise<Response> {
  // Normalize path
  const parsedUrl = new URL(url, window.location.href);
  const path = parsedUrl.pathname;
  const method = init?.method?.toUpperCase() || "GET";
  const headers = init?.headers ? new Headers(init.headers) : new Headers();
  const authHeader = headers.get("Authorization");

  let body: any = null;
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string);
    } catch (_) {}
  }

  const db = getLocalDB();

  console.log(`[MOCK API SANDBOX] (${method}) ${path}`, body);

  // 1. GET /api/settings
  if (path === "/api/settings" && method === "GET") {
    return makeResponse(200, "OK", db.settings);
  }

  // 2. PUT /api/settings
  if (path === "/api/settings" && method === "PUT") {
    db.settings = { ...db.settings, ...body };
    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Settings updated successfully", settings: db.settings });
  }

  // 3. POST /api/auth/register
  if (path === "/api/auth/register" && method === "POST") {
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return makeResponse(400, "Bad Request", { message: "Semua field harus diisi" });
    }

    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return makeResponse(400, "Bad Request", { message: "Email sudah terdaftar" });
    }

    const newUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 11),
      name,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveLocalDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    return makeResponse(200, "OK", {
      message: "Registrasi berhasil!",
      user: userWithoutPassword,
      token: "token_" + newUser.id,
    });
  }

  // 4. POST /api/auth/login
  if (path === "/api/auth/login" && method === "POST") {
    const { email, password } = body || {};
    if (!email || !password) {
      return makeResponse(400, "Bad Request", { message: "Email dan password harus diisi" });
    }

    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return makeResponse(401, "Unauthorized", { message: "Email atau password salah" });
    }

    const { password: _, ...userWithoutPassword } = user;
    return makeResponse(200, "OK", {
      message: "Login berhasil!",
      user: userWithoutPassword,
      token: "token_" + user.id,
    });
  }

  // 5. GET /api/auth/me
  if (path === "/api/auth/me" && method === "GET") {
    const user = getUserByHeader(authHeader, db);
    if (!user) {
      return makeResponse(401, "Unauthorized", { message: "Sesi tidak valid" });
    }

    const { password: _, ...userWithoutPassword } = user;
    return makeResponse(200, "OK", { user: userWithoutPassword });
  }

  // 6. GET /api/products
  if (path === "/api/products" && method === "GET") {
    return makeResponse(200, "OK", db.products);
  }

  // 7. POST /api/products
  if (path === "/api/products" && method === "POST") {
    const newProduct = {
      id: "prod_" + Math.random().toString(36).substring(2, 11),
      ...body,
      price: Number(body?.price || 0),
      stock: Number(body?.stock || 0),
    };

    db.products.push(newProduct);
    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Product created successful", product: newProduct });
  }

  // 8. PUT /api/products/:id
  if (path.startsWith("/api/products/") && method === "PUT") {
    const segments = path.split("/");
    const id = segments[segments.length - 1];
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return makeResponse(404, "Not Found", { message: "Produk tidak ditemukan" });
    }

    db.products[index] = {
      ...db.products[index],
      ...body,
      price: Number(body?.price || 0),
      stock: Number(body?.stock || 0),
    };

    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Product updated successful", product: db.products[index] });
  }

  // 9. DELETE /api/products/:id
  if (path.startsWith("/api/products/") && method === "DELETE") {
    const segments = path.split("/");
    const id = segments[segments.length - 1];
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return makeResponse(404, "Not Found", { message: "Produk tidak ditemukan" });
    }

    const removed = db.products.splice(index, 1);
    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Product deleted successful", product: removed[0] });
  }

  // 10. GET /api/orders
  if (path === "/api/orders" && method === "GET") {
    const user = getUserByHeader(authHeader, db);
    if (!user) {
      return makeResponse(401, "Unauthorized", { message: "Sesi tidak valid" });
    }

    if (user.role === "admin") {
      return makeResponse(200, "OK", db.orders);
    } else {
      const userOrders = db.orders.filter((o) => o.userId === user.id);
      return makeResponse(200, "OK", userOrders);
    }
  }

  // 11. POST /api/orders
  if (path === "/api/orders" && method === "POST") {
    const { items, paymentMethod, notes, userDetails } = body || {};
    if (!items || items.length === 0 || !paymentMethod) {
      return makeResponse(400, "Bad Request", { message: "Keranjang belanja kosong atau metode pembayaran tidak valid" });
    }

    // Verify stock
    for (const item of items) {
      const p = db.products.find((prod) => prod.id === item.productId);
      if (!p) {
        return makeResponse(404, "Not Found", { message: `Produk ${item.name} tidak ditemukan` });
      }
      if (p.stock < item.quantity) {
        return makeResponse(400, "Bad Request", { message: `Stok produk ${item.name} tidak mencukupi. Tersisa: ${p.stock}` });
      }
    }

    // Deduct stock
    for (const item of items) {
      const p = db.products.find((prod) => prod.id === item.productId);
      if (p) {
        p.stock -= item.quantity;
      }
    }

    const orderId = "ord_" + Math.floor(1000 + Math.random() * 9000);
    const totalAmount = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);

    const newOrder = {
      id: orderId,
      userId: userDetails?.id || "guest",
      userName: userDetails?.name || "Pembeli Umum",
      userEmail: userDetails?.email || "guest@example.com",
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
      notes: notes || "",
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);

    // Simulated email dispatch
    const itemsText = items.map((it: any) => `<li>${it.quantity}x ${it.name} (Size: ${it.size}) - Rp ${it.price.toLocaleString("id-ID")}</li>`).join("");
    const emailSubject = `🔔 PESANAN BARU MASUK (SANDBOX): #${orderId} - ${newOrder.userName}`;
    const emailBody = `
      <h3>Detail Pesanan Baru di Yuniverse Boutique (Mode Sandbox Offline)</h3>
      <p><strong>ID Pesanan:</strong> #${orderId}</p>
      <p><strong>Nama Pelanggan:</strong> ${newOrder.userName} (${newOrder.userEmail})</p>
      <ul>${itemsText}</ul>
      <p><strong>Total Transaksi:</strong> Rp ${totalAmount.toLocaleString("id-ID")}</p>
      <p><strong>Metode Pembayaran:</strong> ${paymentMethod === "qris" ? "QRIS" : "Cash / Tunai"}</p>
      <hr />
      <p>Operasi ini telah tersimpan secara mandiri langsung di browser Anda!</p>
    `;

    db.emails.push({
      id: "eml_" + Math.random().toString(36).substring(2, 11),
      from: "notifikasi@yuniverseboutique.com",
      to: "admin@yuniverse.com",
      subject: emailSubject,
      body: emailBody,
      sentAt: new Date().toISOString()
    });

    saveLocalDB(db);

    return makeResponse(200, "OK", {
      message: "Pemesanan berhasil diproses!",
      order: newOrder,
      emailSent: {
        to: "admin@yuniverse.com",
        subject: emailSubject
      }
    });
  }

  // 12. PUT /api/orders/:id/status
  if (path.startsWith("/api/orders/") && path.endsWith("/status") && method === "PUT") {
    const parts = path.split("/");
    const orderId = parts[3]; // /api/orders/:id/status
    const index = db.orders.findIndex((o) => o.id === orderId);

    if (index === -1) {
      return makeResponse(404, "Not Found", { message: "Pesanan tidak ditemukan" });
    }

    const { status, paymentStatus } = body || {};
    if (status) db.orders[index].status = status;
    if (paymentStatus) db.orders[index].paymentStatus = paymentStatus;

    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Status pesanan berhasil diperbarui", order: db.orders[index] });
  }

  // 13. GET /api/emails
  if (path === "/api/emails" && method === "GET") {
    return makeResponse(200, "OK", db.emails);
  }

  // 14. GET /api/users
  if (path === "/api/users" && method === "GET") {
    return makeResponse(200, "OK", db.users);
  }

  // 15. POST /api/users
  if (path === "/api/users" && method === "POST") {
    const { name, email, password, role } = body || {};
    if (!name || !email || !password) {
      return makeResponse(400, "Bad Request", { message: "Semua field wajib diisi!" });
    }

    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return makeResponse(400, "Bad Request", { message: "E-mail tersebut sudah terdaftar" });
    }

    const newUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 11),
      name,
      email,
      password,
      role: role || "user",
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Akun pengguna berhasil ditambahkan!", user: newUser });
  }

  // 16. PUT /api/users/:id
  if (path.startsWith("/api/users/") && method === "PUT") {
    const parts = path.split("/");
    const userId = parts[parts.length - 1];
    const index = db.users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return makeResponse(404, "Not Found", { message: "Pengguna tidak ditemukan" });
    }

    const { name, email, password, role } = body || {};
    if (name) db.users[index].name = name;
    if (email) db.users[index].email = email;
    if (password) db.users[index].password = password;
    if (role) db.users[index].role = role;

    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Data akun berhasil diperbarui!", user: db.users[index] });
  }

  // 17. DELETE /api/users/:id
  if (path.startsWith("/api/users/") && method === "DELETE") {
    const parts = path.split("/");
    const userId = parts[parts.length - 1];
    const index = db.users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return makeResponse(404, "Not Found", { message: "Pengguna tidak ditemukan" });
    }

    const targetUser = db.users[index];
    if (targetUser.role === "admin") {
      const adminCount = db.users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        return makeResponse(400, "Bad Request", { message: "Gagal: Harus tersisa admin minimal satu!" });
      }
    }

    db.users.splice(index, 1);
    saveLocalDB(db);
    return makeResponse(200, "OK", { message: "Akun pengguna berhasil dihapus" });
  }

  // 18. POST /api/google-sheets/sync
  if (path === "/api/google-sheets/sync" && method === "POST") {
    return makeResponse(200, "OK", {
      success: true,
      message: "Seluruh riwayat pesanan butik berhasil disinkronisasi ke Google Sheet! (Simulasi Mode Cepat / Sandbox)",
      rowsSynced: db.orders.length
    });
  }

  return makeResponse(404, "Not Found", { message: "Endpoint no mock found" });
}

// Global fetch override configuration
export function initMockBackend() {
  if (typeof window === "undefined") return;

  const originalFetch = window.fetch;
  if (!originalFetch) return;

  const patchedFetch = async function (input: any, init?: any): Promise<Response> {
    const urlStr = typeof input === "string" ? input : (input as any).url || "";

    // If it's a relative/absolute call targeting our backend APIs
    const isLocalApi = urlStr.startsWith("/api/") || (urlStr.startsWith(window.location.origin) && urlStr.includes("/api/"));

    if (!isLocalApi) {
      return originalFetch.apply(window, arguments as any);
    }

    // Determine if we are hosted on an external static platform like Netlify or GitHub Pages
    const isStaticHosting = !window.location.hostname.includes("localhost") && 
                            !window.location.hostname.includes("127.0.0.1") && 
                            !window.location.hostname.endsWith(".run.app");

    if (isStaticHosting) {
      console.log("[MOCK API SANDBOX - STATIC HOST] Intercepted static server request for:", urlStr);
      return handleMockRequest(urlStr, init);
    }

    try {
      const response = await originalFetch.apply(window, arguments as any);
      const isHtml = response.headers.get("content-type")?.toLowerCase().includes("text/html");
      
      // Netlify and custom routers serve HTML for missing endpoints
      if (response.status === 404 || isHtml) {
        return handleMockRequest(urlStr, init);
      }
      return response;
    } catch (err) {
      // Direct offline fallback (e.g. Netlify static hosting where there's no server process running)
      console.warn("Express Server offline or unreachable. Redirecting api call to LocalStorage sandbox:", urlStr);
      return handleMockRequest(urlStr, init);
    }
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: patchedFetch,
      configurable: true,
      writable: true,
      enumerable: true
    });
    console.log("[MOCK API SANDBOX] Redefined window.fetch successfully.");
  } catch (e) {
    console.warn("Unable to override window.fetch using Object.defineProperty. trying globalThis...", e);
    try {
      (globalThis as any).fetch = patchedFetch;
    } catch (e2) {
      console.error("Unable to override fetch anywhere. Client-side backend emulation might not match.", e2);
    }
  }
}
