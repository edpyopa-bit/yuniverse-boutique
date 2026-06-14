import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { syncAllOrdersToSheet, appendOrderToSheet, isGoogleServiceAccountAvailable } from "./googleSheets";

const app = express();
const PORT = 3000;

// Path to JSON Database
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data folder and db file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seeding Data
const initialDB = {
  users: [
    {
      id: "usr_admin",
      name: "Admin Yuniverse",
      email: "admin@yuniverse.com",
      password: "adminpassword", // Plain for local testing, safe in sandbox
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
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
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

// Helper to read DB
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
      return initialDB;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file, returning default seeding", error);
    return initialDB;
  }
}

// Helper to write DB
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

app.use(express.json());

// API: Settings Endpoints
app.get("/api/settings", (req, res) => {
  const db = readDatabase();
  const defaultSettings = {
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
  };
  db.settings = { ...defaultSettings, ...db.settings };
  res.json(db.settings);
});

app.put("/api/settings", (req, res) => {
  const db = readDatabase();
  db.settings = { ...db.settings, ...req.body };
  writeDatabase(db);
  res.json({ message: "Settings updated successfully", settings: db.settings });
});

// API: Auth Endpoints
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  const db = readDatabase();
  const exists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ message: "Email sudah terdaftar" });
  }

  const newUser = {
    id: "usr_" + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDatabase(db);

  // Return user details without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ message: "Registrasi berhasil!", user: userWithoutPassword, token: "token_" + newUser.id });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  const db = readDatabase();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ message: "Login berhasil!", user: userWithoutPassword, token: "token_" + user.id });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Tidak diotorisasi" });
  }

  const token = authHeader.split(" ")[1];
  const userId = token.replace("token_", "");

  const db = readDatabase();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "Sesi tidak valid" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// API: Products Endpoints
app.get("/api/products", (req, res) => {
  const db = readDatabase();
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const db = readDatabase();
  const newProduct = {
    id: "prod_" + Math.random().toString(36).substr(2, 9),
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
  };

  db.products.push(newProduct);
  writeDatabase(db);
  res.json({ message: "Product created successful", product: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.products.findIndex((p: any) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
  };

  writeDatabase(db);
  res.json({ message: "Product updated successful", product: db.products[index] });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.products.findIndex((p: any) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  const removed = db.products.splice(index, 1);
  writeDatabase(db);
  res.json({ message: "Product deleted successful", product: removed[0] });
});

// API: Orders Endpoints (Places order, decreases stocks, triggers automated email log)
app.get("/api/orders", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Tidak diotorisasi" });
  }

  const token = authHeader.split(" ")[1];
  const userId = token.replace("token_", "");

  const db = readDatabase();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "Sesi tidak valid" });
  }

  // Admin sees all, normal user sees only theirs
  if (user.role === "admin") {
    res.json(db.orders);
  } else {
    const userOrders = db.orders.filter((o: any) => o.userId === user.id);
    res.json(userOrders);
  }
});

app.post("/api/orders", (req, res) => {
  const { items, paymentMethod, notes, userDetails } = req.body;
  if (!items || items.length === 0 || !paymentMethod) {
    return res.status(400).json({ message: "Keranjang belanja kosong atau metode pembayaran tidak valid" });
  }

  const db = readDatabase();

  // Validate and decrease stock
  for (const item of items) {
    const product = db.products.find((p: any) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ message: `Produk ${item.name} tidak ditemukan` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Stok produk ${item.name} tidak mencukupi. Tersisa: ${product.stock}` });
    }
  }

  // Deduct stocks
  for (const item of items) {
    const product = db.products.find((p: any) => p.id === item.productId);
    if (product) {
      product.stock -= item.quantity;
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
    paymentStatus: paymentMethod === "qris" ? "pending" : "pending", // Qris is pending scanner, cash is pending hand over
    status: "pending",
    notes: notes || "",
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);

  // Trigger Automatic Email simulation
  const itemsText = items.map((it: any) => `<li>${it.quantity}x ${it.name} (Size: ${it.size}) - Rp ${it.price.toLocaleString("id-ID")} (Subtotal: Rp ${(it.price * it.quantity).toLocaleString("id-ID")})</li>`).join("");

  const emailSubject = `🔔 PESANAN BARU MASUK: #${orderId} - ${newOrder.userName}`;
  const emailBody = `
    <h3>Detail Pesanan Baru di Yuniverse Boutique</h3>
    <p><strong>ID Pesanan:</strong> #${orderId}</p>
    <p><strong>Nama Pelanggan:</strong> ${newOrder.userName} (${newOrder.userEmail})</p>
    <p><strong>Daftar Pembelian:</strong></p>
    <ul>
      ${itemsText}
    </ul>
    <p><strong>Total Transaksi:</strong> Rp ${totalAmount.toLocaleString("id-ID")}</p>
    <p><strong>Metode Pembayaran:</strong> ${paymentMethod === "qris" ? "QRIS (Digital)" : "Cash / Tunai (Bayar Ditempat)"}</p>
    <p><strong>Catatan Tambahan:</strong> ${newOrder.notes || "-"}</p>
    <p><strong>Tanggal Transaksi:</strong> ${new Date(newOrder.createdAt).toLocaleString("id-ID")}</p>
    <hr />
    <p>Notifikasi sistem ini dikirim otomatis ke e-mail admin. Mohon segera diproses dan lakukan pengiriman!</p>
  `;

  const newEmail = {
    id: "eml_" + Math.random().toString(36).substr(2, 9),
    from: "notifikasi@yuniverseboutique.com",
    to: db.settings.boutiquePhone || "admin@yuniverseboutique.com",
    subject: emailSubject,
    body: emailBody,
    sentAt: new Date().toISOString()
  };

  db.emails.push(newEmail);
  writeDatabase(db);

  // Auto-record to Google Sheets if spreadsheet ID is configured and service account is available
  if (db.settings.googleSpreadsheetId && isGoogleServiceAccountAvailable()) {
    appendOrderToSheet(db.settings.googleSpreadsheetId, newOrder).catch(err => {
      console.error("Gagal auto-pencatatan Google Sheet:", err);
    });
  }

  res.json({
    message: "Pemesanan berhasil diproses!",
    order: newOrder,
    emailSent: {
      to: "admin@yuniverse.com",
      subject: emailSubject
    }
  });
});

app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  const db = readDatabase();
  const index = db.orders.findIndex((o: any) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Pesanan tidak ditemukan" });
  }

  if (status) db.orders[index].status = status;
  if (paymentStatus) db.orders[index].paymentStatus = paymentStatus;

  writeDatabase(db);
  res.json({ message: "Status pesanan berhasil diperbarui", order: db.orders[index] });
});

// API: Emails System Log
app.get("/api/emails", (req, res) => {
  const db = readDatabase();
  res.json(db.emails);
});

// API: Users Accounts Management System
app.get("/api/users", (req, res) => {
  const db = readDatabase();
  // Return list of users
  res.json(db.users);
});

app.post("/api/users", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  const db = readDatabase();
  const exists = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ message: "E-mail tersebut sudah terdaftar" });
  }

  const newUser = {
    id: "usr_" + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    role: role || "user",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDatabase(db);
  res.json({ message: "Akun pengguna berhasil ditambahkan!", user: newUser });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const db = readDatabase();
  const index = db.users.findIndex((u: any) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Pengguna tidak ditemukan" });
  }

  // Update details
  if (name) db.users[index].name = name;
  if (email) db.users[index].email = email;
  if (password) db.users[index].password = password;
  if (role) db.users[index].role = role;

  writeDatabase(db);
  res.json({ message: "Data akun berhasil diperbarui!", user: db.users[index] });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.users.findIndex((u: any) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Pengguna tidak ditemukan" });
  }

  const targetUser = db.users[index];
  if (targetUser.role === "admin") {
    const adminCount = db.users.filter((u: any) => u.role === "admin").length;
    if (adminCount <= 1) {
      return res.status(400).json({ message: "Gagal: Harus tersisa minimal satu akun Administrator!" });
    }
  }

  db.users.splice(index, 1);
  writeDatabase(db);
  res.json({ message: "Akun pengguna berhasil dihapus" });
});

// API: Manual Google Sheets Synchronization Endpoint
app.post("/api/google-sheets/sync", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Tidak diotorisasi" });
  }

  const token = authHeader.split(" ")[1];
  const userId = token.replace("token_", "");

  const db = readDatabase();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Hanya untuk Admin." });
  }

  const spreadsheetId = db.settings.googleSpreadsheetId;
  if (!spreadsheetId) {
    return res.status(400).json({ message: "ID Google Spreadsheet belum dikonfigurasi dalam kustomisasi website." });
  }

  if (!isGoogleServiceAccountAvailable()) {
    return res.status(500).json({ message: "File Google Service Account tidak terpasang di server." });
  }

  syncAllOrdersToSheet(spreadsheetId, db.orders)
    .then(result => {
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    })
    .catch(err => {
      console.error("Error in Google Sheets manual sync:", err);
      res.status(500).json({ success: false, message: err.message || "Gagal sinkronisasi data" });
    });
});

// Serve frontend with Vite in dev, static dist in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Yuniverse Boutique] Full-stack Server Running on http://localhost:${PORT}`);
  });
}

startServer();
