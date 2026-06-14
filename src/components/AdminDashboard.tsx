import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Mail,
  Globe,
  Sliders,
  BarChart2,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  Clock,
  Printer,
  ChevronDown
} from "lucide-react";
import { Product, Order, SiteSettings, EmailLog } from "../types";

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  emails: EmailLog[];
  settings: SiteSettings;
  onRefreshData: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  emails,
  settings,
  onRefreshData,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"inventory" | "orders" | "reports" | "website" | "emails" | "accounts">("inventory");
  
  // Product Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Baju");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formImage, setFormImage] = useState("");
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // User Accounts management states
  const [users, setUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userFormName, setUserFormName] = useState("");
  const [userFormEmail, setUserFormEmail] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("");
  const [userFormRole, setUserFormRole] = useState<"admin" | "user">("user");

  // Site settings forms
  const [siteName, setSiteName] = useState("");
  const [sitePhone, setSitePhone] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [siteAnnouncement, setSiteAnnouncement] = useState("");
  const [siteHeroTitle, setSiteHeroTitle] = useState("");
  const [siteHeroSubtitle, setSiteHeroSubtitle] = useState("");
  const [siteHeroBanner, setSiteHeroBanner] = useState("");
  const [siteAboutTitle, setSiteAboutTitle] = useState("");
  const [siteAboutDescription, setSiteAboutDescription] = useState("");
  const [siteAboutImageUrl, setSiteAboutImageUrl] = useState("");
  const [siteAboutConsultationText, setSiteAboutConsultationText] = useState("");
  const [siteInstagramUrl, setSiteInstagramUrl] = useState("");
  const [siteFooterQuote, setSiteFooterQuote] = useState("");
  const [siteGoogleSpreadsheetId, setSiteGoogleSpreadsheetId] = useState("");
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Initialize site forms
  useEffect(() => {
    if (settings) {
      setSiteName(settings.boutiqueName);
      setSitePhone(settings.boutiquePhone);
      setSiteAddress(settings.address);
      setSiteAnnouncement(settings.announcement);
      setSiteHeroTitle(settings.heroTitle);
      setSiteHeroSubtitle(settings.heroSubtitle);
      setSiteHeroBanner(settings.heroBannerUrl);
      setSiteAboutTitle(settings.aboutTitle || "");
      setSiteAboutDescription(settings.aboutDescription || "");
      setSiteAboutImageUrl(settings.aboutImageUrl || "");
      setSiteAboutConsultationText(settings.aboutConsultationText || "");
      setSiteInstagramUrl(settings.instagramUrl || "");
      setSiteFooterQuote(settings.footerQuote || "");
      setSiteGoogleSpreadsheetId(settings.googleSpreadsheetId || "");
    }
  }, [settings]);

  // Product helper actions
  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("Baju");
    setFormDescription("");
    setFormPrice(0);
    setFormStock(0);
    setFormImage("");
    setFormSizes(["S", "M", "L"]);
    setFormIsFeatured(false);
    setShowProductModal(true);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Gagal menjemput data user", err);
    }
  };

  useEffect(() => {
    if (activeSubTab === "accounts") {
      fetchUsers();
    }
  }, [activeSubTab]);

  const openNewUserModal = () => {
    setEditingUser(null);
    setUserFormName("");
    setUserFormEmail("");
    setUserFormPassword("");
    setUserFormRole("user");
    setShowUserModal(true);
  };

  const openEditUserModal = (u: any) => {
    setEditingUser(u);
    setUserFormName(u.name);
    setUserFormEmail(u.email);
    setUserFormPassword(u.password || "");
    setUserFormRole(u.role);
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: userFormName,
      email: userFormEmail,
      password: userFormPassword,
      role: userFormRole,
    };

    const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
    const method = editingUser ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowUserModal(false);
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.message || "Gagal menyimpan akun.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun pengguna ini?")) {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menghapus akun.");
      }
    }
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormDescription(prod.description);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormImage(prod.image);
    setFormSizes(prod.sizes);
    setFormIsFeatured(prod.isFeatured);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formName,
      category: formCategory,
      description: formDescription,
      price: Number(formPrice),
      stock: Number(formStock),
      image: formImage || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      sizes: formSizes,
      isFeatured: formIsFeatured,
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowProductModal(false);
      onRefreshData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk eksklusif ini dari katalog?")) {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshData();
      }
    }
  };

  // Order helper actions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) onRefreshData();
  };

  const handleUpdateOrderPayment = async (orderId: string, paymentStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    if (res.ok) onRefreshData();
  };

  // Settings Actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        boutiqueName: siteName,
        boutiquePhone: sitePhone,
        address: siteAddress,
        announcement: siteAnnouncement,
        heroTitle: siteHeroTitle,
        heroSubtitle: siteHeroSubtitle,
        heroBannerUrl: siteHeroBanner,
        aboutTitle: siteAboutTitle,
        aboutDescription: siteAboutDescription,
        aboutImageUrl: siteAboutImageUrl,
        aboutConsultationText: siteAboutConsultationText,
        instagramUrl: siteInstagramUrl,
        footerQuote: siteFooterQuote,
        googleSpreadsheetId: siteGoogleSpreadsheetId,
      }),
    });

    if (res.ok) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2500);
      onRefreshData();
    }
  };

  const handleSyncGoogleSheets = async () => {
    setIsSyncingSheets(true);
    setSyncResult(null);
    try {
      const savedToken = localStorage.getItem("yun_token");
      const res = await fetch("/api/google-sheets/sync", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${savedToken}`
        }
      });
      const data = await res.json();
      setSyncResult({
        success: res.ok,
        message: data.message || (res.ok ? "Sinkronisasi berhasil!" : "Gagal sinkronisasi.")
      });
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || "Terjadi kesalahan saat menyambungkan ke server."
      });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // REPORT EXCEL GENERATOR (CSV Download)
  const handleDownloadExcel = () => {
    // Columns headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Pesanan,Tanggal,Nama Pemesan,E-mail,Item Pakaian,Jumlah,Total Pembayaran,Metode Bayar,Status Bayar,Status Kirim\n";

    orders.forEach((order) => {
      const itemsString = order.items.map((it) => `${it.name} (${it.size})`).join("; ");
      const quantityTotal = order.items.reduce((sum, it) => sum + it.quantity, 0);
      const row = [
        order.id,
        new Date(order.createdAt).toLocaleDateString("id-ID"),
        order.userName,
        order.userEmail,
        `"${itemsString}"`,
        quantityTotal,
        order.totalAmount,
        order.paymentMethod.toUpperCase(),
        order.paymentStatus.toUpperCase(),
        order.status.toUpperCase(),
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Bulanan_Yuniverse_Boutique_${new Date().getMonth() + 1}_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // REPORT PDF GENERATOR (Launches print-view formatting)
  const handleDownloadPDF = () => {
    window.print();
  };

  // Financial Stats math
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingRevenue = orders
    .filter((o) => o.paymentStatus === "pending")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalSoldApparel = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div id="admin-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-5 mb-8">
        <div className="text-left">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
            ⚙️ Panel Pusat Administrasi
          </h2>
          <p className="text-xs text-stone-500 font-sans tracking-wide mt-1 uppercase">
            YUNIVERSE BOUTIQUE STOCKS & WEBCONFIG CONTROL DECK
          </p>
        </div>
        
        {/* Quick Seeding Refresh buttons */}
        <button
          onClick={onRefreshData}
          className="mt-3 md:mt-0 text-xs font-semibold px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-md transition-colors shadow-2xs"
        >
          🔄 Refresh Sesi Data
        </button>
      </div>

      {/* Admin tabs */}
      <div id="admin-subtabs" className="flex border border-pink-100 bg-[#FFF5F6] p-1.5 rounded-2xl mb-8 max-w-full overflow-x-auto gap-2 shadow-3xs">
        <button
          id="btn-subtab-inventory"
          onClick={() => setActiveSubTab("inventory")}
          className={`flex-1 min-w-[120px] py-3 text-xs tracking-wider uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "inventory" ? "bg-pink-brand text-white shadow-xs" : "text-stone-500 hover:text-pink-brand"
          }`}
        >
          🛍️ Stok & Katalog
        </button>
        <button
          id="btn-subtab-orders"
          onClick={() => setActiveSubTab("orders")}
          className={`flex-1 min-w-[120px] py-3 text-xs tracking-wider uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "orders" ? "bg-pink-brand text-white shadow-xs" : "text-stone-500 hover:text-pink-brand"
          }`}
        >
          📦 Riwayat Pesanan
        </button>
        <button
          id="btn-subtab-reports"
          onClick={() => setActiveSubTab("reports")}
          className={`flex-1 min-w-[120px] py-3 text-xs tracking-wider uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "reports" ? "bg-pink-brand text-white shadow-xs" : "text-stone-500 hover:text-pink-brand"
          }`}
        >
          📊 Laporan Bulanan
        </button>
        <button
          id="btn-subtab-website"
          onClick={() => setActiveSubTab("website")}
          className={`flex-1 min-w-[120px] py-3 text-xs tracking-wider uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "website" ? "bg-pink-brand text-white shadow-xs" : "text-stone-500 hover:text-pink-brand"
          }`}
        >
          🌐 Edit Website
        </button>
        <button
          id="btn-subtab-emails"
          onClick={() => setActiveSubTab("emails")}
          className={`flex-1 min-w-[120px] py-3 text-xs tracking-wider uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "emails" ? "bg-pink-brand text-white shadow-xs" : "text-stone-500 hover:text-pink-brand"
          }`}
        >
          🔔 Outbox E-mail
        </button>
        <button
          id="btn-subtab-accounts"
          onClick={() => setActiveSubTab("accounts")}
          className={`flex-1 min-w-[120px] py-3 text-xs tracking-widest uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "accounts" ? "bg-pink-brand text-white shadow-xs" : "text-stone-500 hover:text-pink-brand"
          }`}
        >
          👥 Manajemen Akun
        </button>
      </div>

      {/* SUB-PANEL 1: Stock & Catalog Management */}
      {activeSubTab === "inventory" && (
        <div id="subpanel-inventory" className="space-y-6 text-left">
          <div className="flex justify-between items-center bg-white p-4 border border-stone-200/60 rounded-lg">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Penyunting Katalog Pakaian
              </h3>
              <p className="text-xs text-stone-500">Edit foto, sisa stok baju, nama, ukuran, dan harga real-time.</p>
            </div>
            <button
              id="btn-add-product"
              onClick={openNewProductModal}
              className="px-4 py-2 bg-stone-950 hover:bg-stone-855 text-white font-bold text-xs tracking-wider uppercase rounded-md flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200/65 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-xs tracking-wider uppercase">
                  <tr>
                    <th className="p-4 font-bold">Produk</th>
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Harga</th>
                    <th className="p-4 font-bold">Sisa Stok</th>
                    <th className="p-4 font-bold">Ukuran</th>
                    <th className="p-4 font-semibold text-center">Aksi Kerja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-12 object-cover rounded bg-stone-50 border border-stone-250/20"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{prod.name}</p>
                          {prod.isFeatured && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-amber-150 text-amber-800 rounded font-semibold tracking-wide uppercase">
                              Utama / Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-stone-600 font-medium">{prod.category}</td>
                      <td className="p-4 text-stone-900 font-mono font-semibold">Rp {prod.price.toLocaleString("id-ID")}</td>
                      <td className="p-4 font-semibold">
                        <span className={`px-2.5 py-1 rounded text-xs ${
                          prod.stock <= 0
                            ? "bg-red-50 text-red-700"
                            : prod.stock <= 5
                            ? "bg-amber-50 text-amber-800 animate-pulse"
                            : "bg-emerald-50 text-emerald-800"
                        }`}>
                          {prod.stock} Pcs
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {prod.sizes.map((sz) => (
                            <span key={sz} className="px-1.5 py-0.5 text-[10px] bg-stone-100 text-stone-600 rounded font-bold">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            id={`btn-edit-prod-${prod.id}`}
                            onClick={() => openEditProductModal(prod)}
                            className="bg-stone-50 hover:bg-stone-100 text-stone-700 p-1.5 rounded border border-stone-200 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            id={`btn-delete-prod-${prod.id}`}
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-650 p-1.5 rounded border border-red-200 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: Order Management History */}
      {activeSubTab === "orders" && (
        <div id="subpanel-orders" className="space-y-6 text-left">
          <div className="bg-white p-4 border border-stone-200/60 rounded-lg">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Arsip Rincian Transaksi Masuk
            </h3>
            <p className="text-xs text-stone-500">Kendalikan status pengiriman pakaian & validasi bukti scanner QRIS.</p>
          </div>

          <div className="bg-white border border-stone-200/65 rounded-lg overflow-hidden">
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-bold">ID / Tgl</th>
                    <th className="p-4 font-bold">Membayar Pas</th>
                    <th className="p-4 font-bold">Penerima</th>
                    <th className="p-4 font-bold">Item Pakaian</th>
                    <th className="p-4 font-bold">Metode / Status Bayar</th>
                    <th className="p-4 font-bold">Kirim Paket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/30">
                      <td className="p-4">
                        <strong className="block text-stone-900">#{ord.id}</strong>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString("id-ID") + " " + new Date(ord.createdAt).toLocaleTimeString("id-ID")}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-stone-950">Rp {ord.totalAmount.toLocaleString("id-ID")}</td>
                      <td className="p-4">
                        <strong className="block text-stone-850">{ord.userName}</strong>
                        <span className="text-[10px] text-stone-500 max-w-[150px] block truncate">{ord.userEmail}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 max-w-[170px]">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="bg-stone-50 p-1 border border-stone-150 rounded leading-none text-[10px] text-stone-700">
                              {it.quantity}x {it.name} (Size {it.size})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-stone-100 rounded text-stone-700 capitalize mb-2">
                          {ord.paymentMethod}
                        </span>
                        
                        {/* Status update selector */}
                        <div className="relative">
                          <select
                            id={`select-pay-status-${ord.id}`}
                            value={ord.paymentStatus}
                            onChange={(e) => handleUpdateOrderPayment(ord.id, e.target.value)}
                            className={`block w-full text-[10px] py-1 px-2 border rounded font-semibold ${
                              ord.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            <option value="pending">🕒 Pending Belum Scan</option>
                            <option value="paid">✅ Lunas / PAID</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-4">
                        {/* Status update selector */}
                        <div className="relative">
                          <select
                            id={`select-ship-status-${ord.id}`}
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="block w-full text-xs py-1.5 px-2 border border-stone-200 rounded font-semibold bg-white"
                          >
                            <option value="pending">⏳ Pending Menunggu</option>
                            <option value="processing">⚙️ Pengemasan Paket</option>
                            <option value="shipped">🚀 Kurir Mengirim</option>
                            <option value="completed">🎉 Selesai Diterima</option>
                            <option value="cancelled">❌ Cancelled / Batal</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 3: Monthly Sales Reports Area */}
      {activeSubTab === "reports" && (
        <div id="subpanel-reports" className="space-y-6 text-left">
          
          <div className="bg-white p-5 border border-stone-200/60 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Pusat Pembukuan Laporan Penjualan Bulanan
              </h3>
              <p className="text-xs text-stone-500">Menganalisis pendapatan butik dan mengekspor ke MS Excel atau browser PDF.</p>
            </div>
            
            <div className="flex gap-2.5 mt-4 sm:mt-0">
              <button
                id="btn-download-excel"
                onClick={handleDownloadExcel}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-650 text-white font-bold text-xs tracking-wider uppercase rounded-md flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Format Excel (.csv)</span>
              </button>
              
              <button
                id="btn-download-pdf"
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs tracking-wider uppercase rounded-md flex items-center gap-1.5 transition-all shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>Ekspor PDF (Cetak)</span>
              </button>
            </div>
          </div>

          {/* Aggregate Dash grids */}
          <div id="print-section" className="space-y-6">
            
            {/* ONLY VISIBLE ON PRINT: Invoice header decoration */}
            <div className="hidden print:block border-b-2 border-stone-950 pb-4 mb-4">
              <h1 className="font-serif text-3xl font-bold uppercase tracking-widest text-center text-stone-950">
                {settings.boutiqueName || "Yuniverse Boutique"}
              </h1>
              <p className="text-center font-sans text-xs tracking-wide text-stone-500 mt-1 uppercase">
                LAPORAN KINERJA PENJUALAN BULANAN (BULAN JUNI / SEPANJANG WAKTU)
              </p>
              <p className="text-center font-mono text-[10px] text-stone-400 mt-0.5">
                Dicetak otomatis oleh Administrasi butik pada: {new Date().toLocaleString("id-ID")}
              </p>
            </div>

            <div id="stats-summary-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Stat 1 */}
              <div className="bg-white p-5 rounded-lg border border-stone-200/60 shadow-2xs">
                <div className="flex justify-between items-center text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pendapatan Bersih (Paid)</span>
                  <DollarSign className="w-5 h-5 text-emerald-600 bg-emerald-50 rounded p-1" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-950">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-stone-400">Total transaksi yang tervalidasi</span>
              </div>

              {/* Stat 2 */}
              <div className="bg-white p-5 rounded-lg border border-stone-200/60 shadow-2xs">
                <div className="flex justify-between items-center text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pendapatan Tertunda (COD/Scan)</span>
                  <Clock className="w-5 h-5 text-amber-600 bg-amber-50 rounded p-1" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-950">
                  Rp {pendingRevenue.toLocaleString("id-ID")}
                </p>
                <span className="text-[10px] text-stone-400">Menunggu serah terima kasir</span>
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-5 rounded-lg border border-stone-200/60 shadow-2xs">
                <div className="flex justify-between items-center text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pakaian Eksklusif Terjual</span>
                  <ShoppingBag className="w-5 h-5 text-stone-900 bg-stone-100 rounded p-1" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-950">
                  {totalSoldApparel} Pcs
                </p>
                <span className="text-[10px] text-stone-400">Fisik produk terkirim keluar</span>
              </div>

              {/* Stat 4 */}
              <div className="bg-white p-5 rounded-lg border border-stone-200/60 shadow-2xs">
                <div className="flex justify-between items-center text-stone-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Rasio Pembayaran QRIS</span>
                  <BarChart2 className="w-5 h-5 text-indigo-600 bg-indigo-50 rounded p-1" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-stone-950">
                  {orders.length > 0
                    ? Math.round((orders.filter((o) => o.paymentMethod === "qris").length / orders.length) * 100)
                    : 0}%
                </p>
                <span className="text-[10px] text-indigo-500 font-semibold uppercase">Dominasi Scan Digital</span>
              </div>
            </div>

            {/* Static analytics bar chart for printer */}
            <div className="bg-white p-5 rounded-lg border border-stone-200/60">
              <h4 className="font-serif text-sm font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">
                Rangkuman Distribusi Penjualan per Kategori Pakaian
              </h4>
              <div className="space-y-3.5">
                {[
                  { name: "Dress & Kebaya Set", percent: 45, val: "Rp 12.450.000", color: "bg-stone-900" },
                  { name: "Outerwear & Blazer Casual", percent: 30, val: "Rp 8.300.000", color: "bg-amber-600" },
                  { name: "Tunik & Blouse Silk", percent: 25, val: "Rp 6.900.000", color: "bg-indigo-700" }
                ].map((item, id) => (
                  <div key={id} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>{item.name}</span>
                      <span className="font-mono">{item.val} ({item.percent}%)</span>
                    </div>
                    <div className="w-full bg-stone-150 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table of performance list (specifically printable for reports) */}
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="border-b border-stone-100 p-4 font-bold text-sm text-stone-900">
                Visual Detail Saldo Kasir Dan Invoice Pelanggan
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700 uppercase">
                  <tr>
                    <th className="p-3">ID Invoice</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Nama Pembeli</th>
                    <th className="p-3">Metode</th>
                    <th className="p-3">Items Belanja</th>
                    <th className="p-3 text-right">Potongan</th>
                    <th className="p-3 text-right">Total Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 leading-normal">
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="p-3 font-semibold font-mono text-stone-900">#{ord.id}</td>
                      <td className="p-3 text-stone-500">{new Date(ord.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="p-3 text-stone-850 font-medium">{ord.userName}</td>
                      <td className="p-3 uppercase font-semibold text-stone-600">{ord.paymentMethod}</td>
                      <td className="p-3 text-stone-500 max-w-[150px] truncate">
                        {ord.items.map((it) => `${it.quantity}x ${it.name} (${it.size})`).join(", ")}
                      </td>
                      <td className="p-3 text-right text-emerald-650 font-medium">- Rp 0</td>
                      <td className="p-3 text-right font-mono font-bold text-stone-950">Rp {ord.totalAmount.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                  <tr className="bg-stone-50 font-bold text-stone-900 border-t border-stone-300">
                    <td colSpan={6} className="p-3 text-right">JUMLAH REVENUE VALID</td>
                    <td className="p-3 text-right font-mono text-base">Rp {totalRevenue.toLocaleString("id-ID")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* SUB-PANEL 4: Settings & Website Configuration */}
      {activeSubTab === "website" && (
        <div id="subpanel-website" className="space-y-6 text-left">
          
          <div className="bg-white p-4 border border-stone-200/60 rounded-lg">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Pusat Penyunting Website (CMS)
            </h3>
            <p className="text-xs text-stone-500">Edit isi judul, promo teks announcement bar, alamat fisik, nomor wa terhubung.</p>
          </div>

          <form id="settings-cms-form" onSubmit={handleSaveSettings} className="bg-white border border-stone-200/65 rounded-lg p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box Left */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-amber-50 pb-1.5 flex items-center gap-1">
                  Sliders Alamat & Telepon WA
                </h4>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Nama Toko Butik
                  </label>
                  <input
                    id="settings-input-name"
                    type="text"
                    required
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Nomor WhatsApp Penerima Order <span className="text-stone-400 font-light font-mono">(Format 62xxx)</span>
                  </label>
                  <input
                    id="settings-input-phone"
                    type="text"
                    required
                    value={sitePhone}
                    onChange={(e) => setSitePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Isi Promo Flash-Sale Announcement Bar
                  </label>
                  <input
                    id="settings-input-announcement"
                    type="text"
                    value={siteAnnouncement}
                    onChange={(e) => setSiteAnnouncement(e.target.value)}
                    placeholder="Contoh: ✨ Gratis Ongkir untuk bulan Ramadan! ✨"
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Alamat Fisik Butik
                  </label>
                  <textarea
                    id="settings-input-address"
                    rows={3}
                    required
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans resize-none"
                  />
                </div>
              </div>

              {/* Box Right */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-amber-50 pb-1.5 flex items-center gap-1">
                  Konten Banner Media Utama / Hero
                </h4>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Judul Utama Hero (Hero Title)
                  </label>
                  <input
                    id="settings-input-hero-title"
                    type="text"
                    required
                    value={siteHeroTitle}
                    onChange={(e) => setSiteHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Sub-Judul Deskripsi Hero (Hero Subtitle)
                  </label>
                  <textarea
                    id="settings-input-hero-subtitle"
                    rows={3}
                    required
                    value={siteHeroSubtitle}
                    onChange={(e) => setSiteHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Link URL Cover Image Banner Hero
                  </label>
                  <input
                    id="settings-input-hero-banner"
                    type="text"
                    required
                    value={siteHeroBanner}
                    onChange={(e) => setSiteHeroBanner(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-mono"
                  />
                  <span className="text-[10px] text-stone-400 block mt-1">Recomendasi: Unsplash high-resolution URLs</span>
                </div>
              </div>

            </div>

            {/* Divider */}
            <div className="border-t border-stone-200/50 my-6"></div>

            {/* Section 2: Halaman Tentang Kami (About Page) & Media Sosial / Footer */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-brand border-b border-pink-50 pb-1.5 flex items-center gap-1 mb-4">
              Konfigurasi Halaman Tentang Kami (About Us) & Footer
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box Left (Tentang Kami) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Judul Utama Halaman Tentang Kami
                  </label>
                  <input
                    id="settings-input-about-title"
                    type="text"
                    required
                    value={siteAboutTitle}
                    onChange={(e) => setSiteAboutTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Deskripsi Detail Tentang Kami
                  </label>
                  <textarea
                    id="settings-input-about-description"
                    rows={4}
                    required
                    value={siteAboutDescription}
                    onChange={(e) => setSiteAboutDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Link URL Gambar Workshop / Butik Tentang Kami
                  </label>
                  <input
                    id="settings-input-about-image"
                    type="text"
                    required
                    value={siteAboutImageUrl}
                    onChange={(e) => setSiteAboutImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-mono"
                  />
                </div>
              </div>

              {/* Box Right (Konsultasi & Footer) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Teks Deskripsi Konsultasi Desainer WA
                  </label>
                  <textarea
                    id="settings-input-about-consultation"
                    rows={4}
                    required
                    value={siteAboutConsultationText}
                    onChange={(e) => setSiteAboutConsultationText(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    URL Akun / Link Instagram Butik
                  </label>
                  <input
                    id="settings-input-instagram-url"
                    type="text"
                    required
                    value={siteInstagramUrl}
                    onChange={(e) => setSiteInstagramUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Tagline Promosi di Bagian Footer Website
                  </label>
                  <input
                    id="settings-input-footer-quote"
                    type="text"
                    required
                    value={siteFooterQuote}
                    onChange={(e) => setSiteFooterQuote(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200/50 my-6"></div>

            {/* Section 3: Integrasi Google Sheets */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b border-teal-50 pb-1.5 flex items-center gap-1 mb-4">
              🟢 Integrasi Otomatis Google Sheets
            </h4>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                  Sistem ini mendukung pencatatan otomatis seluruh transaksi & pesanan baru langsung ke baris Google Spreadsheet pilihan Anda secara real-time.
                </p>
                <div className="bg-yellow-50 border border-yellow-250 text-yellow-800 rounded p-3 text-xs leading-relaxed mt-2">
                  <strong className="block mb-1">⚠️ Langkah Penting Sebelum Memulai:</strong>
                  Sebelum menggunakan, Anda harus membagikan akses edit spreadsheet Anda ke alamat e-mail Service Account butik:
                  <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-stone-900 bg-white/75 px-2 py-1.5 rounded border border-yellow-100 select-all justify-between">
                    <span>sheets-modifier@yuniverse-boutique-api.iam.gserviceaccount.com</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("sheets-modifier@yuniverse-boutique-api.iam.gserviceaccount.com");
                        alert("E-mail Service Account disalin!");
                      }}
                      className="text-[10px] uppercase bg-stone-900 hover:bg-stone-800 text-white font-sans px-2 py-0.5 rounded ml-2 cursor-pointer transition-colors"
                    >
                      Salin
                    </button>
                  </div>
                  <span className="block mt-1">
                    Atur akses sebagai <strong className="font-bold underline">Editor</strong> agar sistem kami dapat mencatat entri pesanan secara otomatis.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase">
                    ID atau URL Lengkap Google Spreadsheet
                  </label>
                  <input
                    id="settings-input-google-spreadsheet-id"
                    type="text"
                    placeholder="Contoh: https://docs.google.com/spreadsheets/d/SpreadsheetId/edit"
                    value={siteGoogleSpreadsheetId}
                    onChange={(e) => setSiteGoogleSpreadsheetId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 rounded focus:outline-none focus:ring-1 focus:ring-stone-500 text-sm font-sans font-mono"
                  />
                  {siteGoogleSpreadsheetId && (
                    <p className="text-[10px] text-stone-550 font-mono">
                      Parsed Spreadsheet ID: <span className="font-bold text-stone-700 select-all">{(() => {
                        if (!siteGoogleSpreadsheetId) return "-";
                        const match = siteGoogleSpreadsheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
                        return match ? match[1] : siteGoogleSpreadsheetId.trim();
                      })()}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-end">
                  <label className="block text-xs font-mono font-bold text-stone-500 mb-1">
                    Aksi Sinkronisasi Manual
                  </label>
                  <button
                    id="btn-sync-all-sheets"
                    type="button"
                    disabled={isSyncingSheets || !siteGoogleSpreadsheetId}
                    onClick={handleSyncGoogleSheets}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded shadow transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSyncingSheets ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></span>
                        Menyinkronkan...
                      </>
                    ) : (
                      <>
                        <span>🔄</span> Sinkronkan Semua Riwayat ke Sheet
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    *Gunakan tombol ini untuk memindahkan seluruh riwayat transaksi butik dari database lokal ke Google Sheet yang tersambung saat ini.
                  </p>
                </div>
              </div>

              {syncResult && (
                <div className={`text-xs p-3 rounded border font-semibold flex items-start gap-1.5 ${
                  syncResult.success 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}>
                  <span className="text-base leading-none">{syncResult.success ? "✅" : "❌"}</span>
                  <p>{syncResult.message}</p>
                </div>
              )}
            </div>

            {settingsSuccess && (
              <p id="cms-settings-success-alert" className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded font-semibold flex items-center gap-1">
                🎉 Sukses! Kustomisasi website CMS berhasil disimpan & diperbarui real-time.
              </p>
            )}

            <div className="flex border-t border-stone-100 pt-5 justify-end">
              <button
                id="btn-settings-cms-save"
                type="submit"
                className="px-6 py-3 bg-stone-950 hover:bg-stone-850 text-white font-bold text-xs tracking-wider uppercase rounded-md transition-all shadow-md active:scale-97"
              >
                Simpan & Update Website
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-PANEL 5: simulated E-mail Outbox System */}
      {activeSubTab === "emails" && (
        <div id="subpanel-emails" className="space-y-6 text-left">
          
          <div className="bg-white p-4 border border-stone-200/60 rounded-lg">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-1.5 text-indigo-900">
              <Mail className="h-5 w-5" />
              Sistem Log Outbox E-mail Otomatis
            </h3>
            <p className="text-xs text-stone-500">Transparansi log simulasi notifikasi keluar saat pembeli melayangkan order di Yuniverse.</p>
          </div>

          <div className="space-y-4">
            {emails.length === 0 ? (
              <div className="bg-white p-8 text-center text-stone-400 border border-stone-200 rounded-lg">
                Tidak ada log pengiriman surel aktif.
              </div>
            ) : (
              emails.map((eml) => (
                <div key={eml.id} className="bg-white border border-stone-200 rounded-lg shadow-2xs overflow-hidden">
                  <div className="bg-stone-50 border-b border-stone-150 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs">
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-800">
                        Dari: <span className="font-normal text-stone-500">{eml.from}</span>
                      </p>
                      <p className="font-semibold text-stone-850">
                        Untuk: <span className="font-normal text-emerald-800 font-bold">{eml.to} (Admin Butik)</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-2 sm:mt-0 font-mono">
                      Sent at: {new Date(eml.sentAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  <div className="p-4 sm:p-6 text-xs sm:text-sm text-left font-sans">
                    <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-2 mb-3">
                      Subjek: {eml.subject}
                    </h4>
                    
                    {/* Render raw body inside a clean box */}
                    <div
                      className="bg-stone-50/50 p-4 border border-stone-100 rounded leading-relaxed text-stone-700 max-w-full overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: eml.body }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-PANEL 6: Accounts/Users Management */}
      {activeSubTab === "accounts" && (
        <div id="subpanel-accounts" className="space-y-6 text-left animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 border border-pink-100 rounded-2xl">
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900">
                Manajemen Akun Yuniverse Boutique
              </h3>
              <p className="text-xs text-stone-500 font-medium">Buat, modifikasi, atau hapus pendaftaran akun admin & pembeli secara real-time.</p>
            </div>
            <button
              id="btn-add-new-user"
              onClick={openNewUserModal}
              className="px-5 py-2.5 bg-pink-brand text-white hover:bg-pink-brand-dark rounded-full text-xs font-bold uppercase transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              ➕ Registrasi Akun Baru
            </button>
          </div>

          <div className="bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-3xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs sm:text-sm">
                <thead className="bg-pink-soft border-b border-pink-100 text-pink-900 uppercase text-[10px] font-extrabold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nama Lengkap</th>
                    <th className="px-6 py-4">Alamat E-mail</th>
                    <th className="px-6 py-4">Sandi (Password)</th>
                    <th className="px-6 py-4 font-bold">Hak Akses</th>
                    <th className="px-6 py-4 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-400 font-medium">
                        Memuat daftar pengguna Yuniverse Boutique...
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-pink-soft/10 transition-colors">
                        <td className="px-6 py-4 font-bold text-stone-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-brand flex items-center justify-center font-extrabold text-xs uppercase shadow-3xs">
                            {u.name.charAt(0)}
                          </span>
                          <div>
                            <p className="font-bold text-zinc-900">{u.name}</p>
                            <span className="text-[9px] font-mono text-stone-400 capitalize bg-stone-50 px-1 py-0.5 rounded border border-stone-200/50 sm:hidden">{u.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-600 font-mono text-xs font-medium">{u.email}</td>
                        <td className="px-6 py-4 text-stone-500 font-mono text-xs">{u.password}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                            u.role === "admin"
                              ? "bg-pink-100 text-pink-brand border border-pink-200"
                              : "bg-stone-50 text-stone-600 border border-stone-200"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => openEditUserModal(u)}
                            className="px-3 py-1.5 border border-pink-200 hover:bg-pink-soft text-pink-brand rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="px-3 py-1.5 border border-red-100 hover:bg-rose-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USER CRUD MODAL POPUP */}
      {showUserModal && (
        <div id="user-form-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs flex-grow animate-scale-in">
          <div className="bg-white rounded-2xl max-w-md w-full mx-auto overflow-hidden shadow-2xl border border-pink-100 text-left">
            <div className="bg-pink-soft border-b border-pink-100 p-5 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-wide text-pink-brand-dark">
                {editingUser ? "Sunting Akun Pengguna" : "Registrasi Akun Baru"}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  placeholder="Contoh: Administrator Utama"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-lg text-sm font-sans bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  E-mail Login Akun <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  placeholder="nama@domain.com"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-lg text-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userFormPassword}
                  onChange={(e) => setUserFormPassword(e.target.value)}
                  placeholder="Password rahasia akun"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-lg text-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tipe Akun (Hak Akses)
                </label>
                <select
                  value={userFormRole}
                  onChange={(e) => setUserFormRole(e.target.value as "admin" | "user")}
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-lg text-sm bg-white font-semibold"
                >
                  <option value="user">User (Hanya Lihat Katalog & Pesan/Bayar)</option>
                  <option value="admin">Admin (Manajemen Stok, Akun, Katalog & Website)</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-pink-50">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-full text-xs font-bold uppercase transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-brand text-white rounded-full text-xs font-bold uppercase hover:bg-pink-brand-dark transition shadow-xs"
                >
                  Selesai & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP SYSTEM: Product Customizer dialog (Editing / Creating details) */}
      {showProductModal && (
        <div id="product-form-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs flex-grow animate-fade-in">
          <div className="bg-white rounded-lg max-w-lg w-full mx-auto overflow-hidden shadow-2xl border border-stone-200 text-left">
            <div className="bg-stone-50 border-b border-stone-100 p-5 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-stone-950">
                {editingProduct ? "Penyunting Detail Pakaian" : "Tambahkan Baru Busana Masuk"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>

            <form id="product-crud-form" onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nama Model Pakaian <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-product-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Prameswari Kebaya Set"
                  className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Kategori Busana
                  </label>
                  <select
                    id="form-product-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm bg-white"
                  >
                    <option value="Baju">Baju</option>
                    <option value="Kemeja">Kemeja</option>
                    <option value="Dress">Dress</option>
                    <option value="Vest">Vest</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Celana">Celana</option>
                    <option value="Rok">Rok</option>
                    <option value="Jaket">Jaket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Penjualan Unggulan (Featured)
                  </label>
                  <select
                    id="form-product-featured"
                    value={formIsFeatured ? "true" : "false"}
                    onChange={(e) => setFormIsFeatured(e.target.value === "true")}
                    className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm bg-white"
                  >
                    <option value="false">Tidak (Biasa)</option>
                    <option value="true">Ya (Eksklusif / Utama)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Harga Jual <span className="text-stone-400">(IDR)</span>
                  </label>
                  <input
                    id="form-product-price"
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm font-sans font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Jumlah Stok Masuk
                  </label>
                  <input
                    id="form-product-stock"
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm font-sans font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Ketersediaan Ukuran <span className="text-stone-400 text-[10px]">(Pisahkan dengan koma)</span>
                </label>
                <input
                  id="form-product-sizes"
                  type="text"
                  required
                  value={formSizes.join(", ")}
                  onChange={(e) => setFormSizes(e.target.value.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean))}
                  placeholder="S, M, L, XL"
                  className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm font-sans font-mono"
                />
              </div>

              <div className="space-y-2.5 border border-pink-100 bg-pink-soft/30 p-4 rounded-2xl text-left">
                <label className="block text-xs font-bold text-stone-700 uppercase">
                  Input / Upload Gambar Busana <span className="text-red-500">*</span>
                </label>
                
                {/* 1. File Uploader selector */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-pink-brand hover:bg-pink-brand-dark text-white text-xs font-bold uppercase rounded-full shadow-xs transition-colors">
                    <span>📁 Upload File Gambar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setFormImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  
                  {formImage && (
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-full border border-pink-100">
                      <img src={formImage} className="w-7 h-7 object-cover rounded-md border border-pink-200" alt="Preview Image" />
                      <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Terkonfirmasi</span>
                    </div>
                  )}
                </div>

                {/* 2. Text input link fallback */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Salin Link / URL Foto:</p>
                  <input
                    id="form-product-image"
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="Contoh: https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-lg text-xs font-mono bg-white"
                  />
                </div>

                {/* 3. Catalog theme presets */}
                <div className="space-y-1.5 pt-1.5 border-t border-pink-100/50">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Atau pilih Presets Katalog Butik:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { l: "👗 Dress", u: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80" },
                      { l: "🧥 Outerwear", u: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80" },
                      { l: "👚 Baju Model", u: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&auto=format&fit=crop&q=80" },
                      { l: "👖 Celana", u: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80" },
                      { l: "👔 Kemeja", u: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&auto=format&fit=crop&q=80" },
                    ].map((pst, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(pst.u)}
                        className={`px-2.5 py-1 text-[10px] font-bold border rounded-full transition-all flex items-center gap-1 ${
                          formImage === pst.u 
                            ? "bg-pink-brand text-white border-pink-brand shadow-xs" 
                            : "bg-white text-stone-600 hover:bg-pink-soft border-pink-150"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: formImage === pst.u ? "#FFF" : "#E85D75" }}></span>
                        {pst.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Deskripsi Bahan & Desain Pakaian
                </label>
                <textarea
                  id="form-product-description"
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ceritakan detail bahan katun, kelembutan jahitan kain..."
                  className="w-full px-3 py-2 border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded text-sm font-sans resize-none"
                />
              </div>

              {/* Action box */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded text-xs font-bold uppercase"
                >
                  Batal
                </button>
                <button
                  id="btn-form-product-submit"
                  type="submit"
                  className="px-6 py-2 bg-stone-950 text-[#faf9f6] rounded text-xs font-bold uppercase hover:bg-stone-850"
                >
                  Selesai & Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
