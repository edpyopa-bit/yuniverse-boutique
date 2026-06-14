import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  MessageSquare,
  Compass,
  Heart,
  Instagram,
  Facebook,
  Sparkles,
  Award
} from "lucide-react";

// Modular Component Imports
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import ProductDetailsModal from "./components/ProductDetailsModal";
import CartSidebar, { CartItem } from "./components/CartSidebar";
import PaymentModal from "./components/PaymentModal";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./components/AdminDashboard";

import { Product, Order, SiteSettings, User, EmailLog } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("shop");
  
  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    boutiqueName: "Yuniverse Boutique",
    boutiquePhone: "+6282344679356",
    address: "Ruko Emerald blok F No. 12, Jl. Raden Patah, Jakarta Pusat",
    announcement: "✨ Koleksi Eksklusif Musim Panas Terbatas Kini Tersedia! Dapatkan Gratis Ongkir Jabodetabek! ✨",
    heroTitle: "Eksklusivitas yang Memancarkan Pesona Menawan Anda",
    heroSubtitle: "Koleksi busana berkualitas tinggi hasil rancangan desainer butik Yuniverse untuk menyempurnakan penampilan anggun dan fungsional di setiap momen berharga Anda.",
    heroBannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
  });

  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cart & checkout states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<string>("default");

  // Interactive Modals Toggles
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // User Reviews Section states
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Dian Sastrowardoyo",
      rating: 5,
      comment: "Kamila Floral Wrap Dress yang saya beli sangat mewah dan nyaman digunakan. Jahitannya rapi sekali, sesuai standar butik kelas atas. Sukses terus Yuniverse!",
      date: "3 hari yang lalu",
    },
    {
      id: 2,
      name: "Alya Rohali",
      rating: 5,
      comment: "Alana Executive Blazer-nya cocok banget buat kerja maupun hangout. Bahannya premium dan adem. Pengiriman cepat dan admin WA responsif sekali menjawab ukuran.",
      date: "1 minggu yang lalu",
    },
    {
      id: 3,
      name: "Rania Amanda",
      rating: 4,
      comment: "Setelan kebayanya cantik luar biasa, hiasan manik-manik payetnya dijahit tangan sangat teliti. Packaging-nya wangi dan mewah. Recomended!",
      date: "2 minggu yang lalu",
    },
  ]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load and refresh core DB on mount and token changes
  useEffect(() => {
    // Check existing stored token
    const savedToken = localStorage.getItem("yun_token");
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    }
    
    fetchCatalog();
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchAdminStatsLogs();
    }
  }, [currentUser]);

  // Network procedures
  const fetchCatalog = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  const fetchCurrentUser = async (tok: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        // Clear broken token
        localStorage.removeItem("yun_token");
        setToken(null);
      }
    } catch (e) {
      console.error("Failed to query auth session", e);
    }
  };

  const fetchAdminStatsLogs = async () => {
    try {
      const authHeader = { Authorization: `Bearer ${token || localStorage.getItem("yun_token")}` };
      
      const [ordRes, emlRes] = await Promise.all([
        fetch("/api/orders", { headers: authHeader }),
        fetch("/api/emails"),
      ]);

      if (ordRes.ok) {
        const ords = await ordRes.json();
        setOrders(ords);
      }
      if (emlRes.ok) {
        const emls = await emlRes.json();
        setEmails(emls);
      }
    } catch (e) {
      console.error("Failed to fetch admin operations", e);
    }
  };

  const handleRefreshAdminData = async () => {
    fetchCatalog();
    fetchSiteSettings();
    fetchAdminStatsLogs();
  };

  // Auth handlers
  const handleLoginSuccess = (user: User, tok: string) => {
    setCurrentUser(user);
    setToken(tok);
    localStorage.setItem("yun_token", tok);
    
    // Auto sync stats if admin
    if (user.role === "admin") {
      fetchAdminStatsLogs();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("yun_token");
    setCart([]);
    if (activeTab === "admin") {
      setActiveTab("shop");
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, qty: number) => {
    const cartItemId = `${product.id}_${size}`;
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + qty;
        updated[existingIdx].quantity = Math.min(newQty, product.stock);
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size,
            quantity: qty,
            maxStock: product.stock,
          },
        ];
      }
    });
    
    // Auto toggle drawer showing cart state
    setShowCart(true);
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.min(Math.max(1, qty), item.maxStock) };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Checkout posting
  const handleCheckoutSubmit = async (
    shippingInfo: { name: string; email: string; address: string; notes: string },
    paymentMethod: "qris" | "cash"
  ) => {
    const payload = {
      items: cart.map((it) => ({
        productId: it.productId,
        name: it.name,
        size: it.size,
        quantity: it.quantity,
        price: it.price,
      })),
      paymentMethod,
      notes: `${shippingInfo.notes ? `${shippingInfo.notes} | ` : ""}Alamat: ${shippingInfo.address}`,
      userDetails: currentUser
        ? {
            id: currentUser.id,
            name: shippingInfo.name,
            email: shippingInfo.email,
          }
        : {
            id: "guest",
            name: shippingInfo.name,
            email: shippingInfo.email,
          },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memproses pemesanan Anda");
      }

      // Record active order to show Payment Gateway
      setActivePaymentOrder(data.order);
      
      // Close sidecart & clear selections
      setShowCart(false);
      setCart([]);
      
      // Refresh database to reflect stock deduction immediately
      fetchCatalog();
      if (currentUser?.role === "admin") {
        fetchAdminStatsLogs();
      }
    } catch (e: any) {
      alert(`⚠️ Maaf, gagal checkout: ${e.message}`);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    fetchCatalog();
    if (currentUser?.role === "admin") {
      fetchAdminStatsLogs();
    }
  };

  // Review Form handlers
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newRev = {
      id: reviews.length + 1,
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: "Baru saja",
    };

    setReviews([newRev, ...reviews]);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 2500);
  };

  // Filters calculation
  const filteredProducts = products
    .filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "Semua" ? true : prod.category === selectedCategory;

      const matchesMinPrice = minPrice === "" ? true : prod.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" ? true : prod.price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock-low") return a.stock - b.stock;
      return 0; // default order
    });

  const categories = ["Semua", "Baju", "Kemeja", "Dress", "Vest", "Outerwear", "Celana", "Rok", "Jaket"];

  return (
    <div id="app-root" className="min-h-screen bg-pink-soft/30 flex flex-col font-sans selection:bg-pink-brand selection:text-white text-stone-800">
      
      {/* 2. App Header */}
      <Header
        boutiqueName={settings.boutiqueName}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        currentUser={currentUser}
        onOpenCart={() => setShowCart(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 3. Main Route Container */}
      <main className="flex-grow">
        
        {/* VIEW: SHOP CATALOG */}
        {activeTab === "shop" && (
          <div id="view-shop-catalog" className="space-y-12 pb-16">
            
            {/* Elegant Hero Slider */}
            <HeroSection
              title={settings.heroTitle}
              subtitle={settings.heroSubtitle}
              bannerUrl={settings.heroBannerUrl}
            />

            {/* Catalog content layout */}
            <div id="katalog-produk" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              
              {/* Secondary Tokopedia-style Header containing count info + quick sorting selection */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pink-100 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-black text-stone-850 uppercase tracking-widest flex items-center gap-1.5">
                    🛍️ HASIL PENCARIAN BUSANA MEWAH
                  </h3>
                  <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                    {searchQuery ? `Ditemukan ${filteredProducts.length} pakaian mewah untuk "${searchQuery}"` : `Menampilkan semua ${filteredProducts.length} pakaian eksklusif`} di kategori <span className="text-pink-brand font-black bg-[#FFF5F6] px-2 py-0.5 rounded border border-pink-200/40">{selectedCategory}</span>
                  </p>
                </div>

                {/* Quick Sorting Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-bold">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-pink-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-brand text-stone-700 bg-white"
                  >
                    <option value="default">Pilihan Terbaik (Default)</option>
                    <option value="price-asc">Harga Terendah</option>
                    <option value="price-desc">Harga Tertinggi</option>
                    <option value="stock-low">Stok Hampir Habis</option>
                  </select>
                </div>
              </div>

              {/* Grid 2-Column system: Left (Filters), Right (Products grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Responsive Filter Accordion Header for Mobile/Tablet */}
                <div className="lg:hidden w-full bg-white border border-pink-100 rounded-2xl p-4 flex items-center justify-between shadow-3xs text-left col-span-1 lg:col-span-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black uppercase text-stone-800 tracking-wider flex items-center gap-1">
                      ⚙️ Filter & Urutkan Pakaian
                    </span>
                    <p className="text-[10px] text-stone-500 font-medium">
                      Atur range harga minimal/maksimal, kategori baju, & spesifikasi
                    </p>
                  </div>
                  <button
                    id="btn-toggle-mobile-filters"
                    type="button"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="px-4 py-2 bg-pink-brand hover:bg-pink-brand-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>{showMobileFilters ? "Sembunyikan ❌" : "Saring Busana 🔍"}</span>
                  </button>
                </div>

                {/* Tokopedia-style Left Side Filter Column (Sticky, modern) */}
                <div className={`lg:col-span-1 space-y-5 lg:sticky lg:top-24 h-fit ${showMobileFilters ? "block animate-fade-in" : "hidden lg:block"}`}>
                  
                  {/* Filter Container */}
                  <div className="bg-white border border-pink-100 rounded-2xl p-4.5 text-left space-y-4 shadow-3xs">
                    
                    {/* Filter Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-pink-50">
                      <span className="text-xs font-black uppercase text-stone-800 tracking-wider">Filter Pakaian</span>
                      {(selectedCategory !== "Semua" || searchQuery !== "" || minPrice !== "" || maxPrice !== "" || sortBy !== "default") && (
                        <button
                          onClick={() => {
                            setSelectedCategory("Semua");
                            setSearchQuery("");
                            setMinPrice("");
                            setMaxPrice("");
                            setSortBy("default");
                          }}
                          className="text-[10px] text-pink-brand hover:text-pink-brand-dark font-extrabold"
                        >
                          Hapus Semua
                        </button>
                      )}
                    </div>

                    {/* Filter Kategori */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-black uppercase text-stone-700 tracking-wide block mb-1">Kategori</span>
                      <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {categories.map((cat) => (
                          <label
                            key={cat}
                            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-pink-brand cursor-pointer select-none"
                          >
                            <input
                              type="radio"
                              name="categoryFilter"
                              checked={selectedCategory === cat}
                              onChange={() => setSelectedCategory(cat)}
                              className="accent-pink-brand h-3.5 w-3.5"
                            />
                            <span>{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-pink-50/50 pt-3"></div>

                    {/* Rentang Harga Filter */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-black uppercase text-stone-700 tracking-wide block mb-1">Rentang Harga</span>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">Rp</span>
                          <input
                            type="number"
                            placeholder="Harga Minimum"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full pl-7 pr-2.5 py-1.5 border border-pink-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-brand bg-[#FFF5F6]/30 text-stone-700"
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">Rp</span>
                          <input
                            type="number"
                            placeholder="Harga Maksimum"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full pl-7 pr-2.5 py-1.5 border border-pink-100 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-brand bg-[#FFF5F6]/30 text-stone-700"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setMinPrice("");
                            setMaxPrice("");
                          }}
                          className="flex-1 py-1.5 border border-pink-100 rounded-lg text-[10px] font-bold text-stone-500 hover:bg-stone-50"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-1.5 bg-pink-brand hover:bg-pink-brand-dark rounded-lg text-[10px] font-bold text-white transition-all"
                        >
                          Terapkan
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-pink-50/50 pt-3"></div>

                    {/* Lokasi / Vendor (Tokopedia Specialty) */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-black uppercase text-stone-700 tracking-wide block mb-1">Lokasi Toko</span>
                      <label className="flex items-center gap-2 text-xs font-semibold text-stone-605">
                        <input type="checkbox" defaultChecked disabled className="accent-pink-brand h-3.5 w-3.5" />
                        <span>📍 Yuniverse Sentra (Pusat)</span>
                      </label>
                    </div>

                  </div>



                </div>

                {/* Right Products grid Column (3/4 width) */}
                <div className="lg:col-span-3">
                  {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center text-stone-400 bg-white border border-pink-100 rounded-2xl max-w-lg mx-auto">
                      <Compass className="mx-auto h-12 w-12 text-pink-400 stroke-1 mb-3 animate-spin" />
                      <p className="font-serif text-lg font-bold text-stone-900">Produk Tidak Ditemukan</p>
                      <p className="text-xs text-stone-500 mt-1">Ganti filter kategori, kosongkan input harga, atau ubah kata kunci sandi pencarian busana Anda.</p>
                    </div>
                  ) : (
                    <div id="products-catalog-grid" className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onSelect={(p) => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Exclusive brand visual banners */}
            <div id="brand-values-banner" className="bg-[#FFF5F6] border-y border-pink-100 py-16 sm:py-20 mt-16 scroll-mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                
                {/* Block 1 */}
                <div className="space-y-3 md:border-r md:border-pink-200/50 md:pr-8 last:border-0">
                  <div className="inline-flex items-center justify-center p-3 bg-white text-pink-brand rounded-full border border-pink-100 shadow-3xs mb-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-lg font-extrabold uppercase tracking-widest text-pink-brand-dark">Sutera Mewah Pilihan</h4>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium leading-relaxed">
                    Setiap potong baju diuji teliti memakai premium mulberry silk, linen organik, dan serat kain ramah kulit demi kenyamanan istimewa Anda sepanjang hari.
                  </p>
                </div>

                {/* Block 2 */}
                <div className="space-y-3 md:border-r md:border-pink-200/50 md:pr-8 last:border-0">
                  <div className="inline-flex items-center justify-center p-3 bg-white text-pink-brand rounded-full border border-pink-100 shadow-3xs mb-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-lg font-extrabold uppercase tracking-widest text-pink-brand-dark">Rancangan Orisinil</h4>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium leading-relaxed">
                    Diproduksi berkolaborasi dengan desainer lokal Indonesia, menghadirkan estetika kebaya klasik dibalut sentuhan kasual-formal kontemporer modern yang unik.
                  </p>
                </div>

                {/* Block 3 */}
                <div className="space-y-3 md:border-r md:border-pink-200/50 md:pr-8 last:border-0">
                  <div className="inline-flex items-center justify-center p-3 bg-white text-pink-brand rounded-full border border-pink-100 shadow-3xs mb-3">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-lg font-extrabold uppercase tracking-widest text-pink-brand-dark">Gratis Kirim & Retur</h4>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium leading-relaxed">
                    Garansi pengiriman gratis wilayah Jabodetabek. Layanan bantuan personal asisten WhatsApp real-time siaga mendampingi garansi retur tukar size Anda.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW: DEEP REVIEWS & CONTACT PAGE */}
        {activeTab === "about" && (
          <div id="view-about-contact" className="max-w-4xl mx-auto px-4 py-12 text-left space-y-12 animate-fade-in pb-16">
            
            {/* Visual Header card */}
            <div className="bg-gradient-to-r from-pink-soft to-white rounded-3xl overflow-hidden shadow-sm border border-pink-100/60 relative min-h-[220px] flex items-center p-8">
              <div className="absolute inset-0 z-0">
                <img
                  src={settings.aboutImageUrl || "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=1000&auto=format&fit=crop&q=80"}
                  alt="Yuniverse Boutique Workshop"
                  className="w-full h-full object-cover object-center opacity-15 mix-blend-multiply"
                />
              </div>
              <div className="relative z-10 max-w-xl space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-pink-brand-dark">
                  {settings.aboutTitle || "Eksklusivitas Tak Lekang Oleh Waktu 🌸"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-650 font-medium leading-relaxed">
                  {settings.aboutDescription || "Didirikan dengan impian untuk membawa warisan kerajinan tekstil Indonesia ke dalam jajaran busana modern yang anggun dan dinamis. Yuniverse Boutique berkomitmen menjaga mutu dan kepuasan setiap pelanggan berharga kami."}
                </p>
              </div>
            </div>

            {/* Direct Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Location Card */}
              <div className="bg-white p-6 border border-pink-100 rounded-2xl space-y-4 shadow-3xs">
                <h4 className="font-serif text-base font-extrabold text-pink-brand-dark border-b border-pink-50 pb-2">
                  📍 Lokasi Showroom Fisik
                </h4>
                <div className="flex gap-2.5 text-sm text-stone-605 font-sans font-medium">
                  <MapPin className="h-5 w-5 text-pink-brand shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-bold">Butik {settings.boutiqueName.split(" ")[0]} Sentra</strong>
                    <p>{settings.address}</p>
                    <p className="text-xs text-pink-brand mt-1 font-mono font-bold">Buka setiap hari: 09:00 - 21:00 WIB</p>
                  </div>
                </div>
                
                {/* Simulated Map visual */}
                <div className="aspect-video w-full rounded-2xl border border-pink-100 overflow-hidden relative shadow-3xs">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"
                    alt="Map mockup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-pink-900/10 flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-white text-pink-brand-dark font-extrabold text-xs rounded-full border border-pink-150 shadow-md">
                      📍 {settings.boutiqueName} Sentra
                    </span>
                  </div>
                </div>
              </div>

              {/* Designer Consultations */}
              <div className="bg-white p-6 border border-pink-100 rounded-2xl space-y-4 flex flex-col justify-between shadow-3xs">
                <div>
                  <h4 className="font-serif text-base font-extrabold text-pink-brand-dark border-b border-pink-50 pb-2">
                    💬 Hubungi Admin WhatsApp & Order
                  </h4>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2.5">
                    {settings.aboutConsultationText || "Memiliki pertanyaan khusus mengenai furing gaun, kesesuaian lekuk pinggang size tertentu, atau ingin mengajukan custom design brokat pernikahan? Jangan ragu menghubungi penasehat desainer profesional kami via chat WhatsApp."}
                  </p>
                </div>

                <div className="p-4 bg-pink-soft/60 rounded-xl border border-pink-100/50 space-y-1 text-xs">
                  <p className="font-mono text-pink-900 font-bold">Nomor Ponsel: <strong className="text-pink-brand">{settings.boutiquePhone}</strong></p>
                  <p className="text-stone-500 font-medium leading-normal mt-0.5">Kami senantiasa siaga melayani konsultasi jam 08:00 - 22:00 WIB.</p>
                </div>

                <a
                  id="btn-consultation-wa-about"
                  href={`https://api.whatsapp.com/send?phone=${settings.boutiquePhone.replace("+", "")}&text=Halo%20Yuniverse%20Boutique!%20Saya%20tertarik%20bertanya%20mengenai%25katalog%25pakaian%25eksklusif.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-pink-brand hover:bg-pink-brand-dark text-white rounded-full text-xs font-bold uppercase tracking-widest text-center transition-all duration-300 shadow-md shadow-pink-200"
                >
                  Hubungi Admin WA Sekarang 🌸
                </a>
              </div>

            </div>

            {/* Interactive User Reviews Module */}
            <div className="bg-white p-6 sm:p-8 border border-pink-100 rounded-3xl space-y-6 shadow-3xs">
              
              <div className="border-b border-pink-50 pb-4">
                <h4 className="font-serif text-lg font-extrabold text-pink-brand-dark mb-1 flex items-center gap-2">
                  🌸 Ulasan & Penilaian Pelanggan Kami
                </h4>
                <p className="text-xs text-stone-500 font-semibold">Bantu kami terus berinovasi dengan menuangkan pengalaman berharga Anda.</p>
              </div>

              {/* Feed lists */}
              <div id="reviews-feed" className="space-y-6 divide-y divide-pink-100/40">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-5 first:pt-0 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-stone-900 text-sm font-bold">{rev.name}</strong>
                      <span className="text-[10px] text-pink-brand font-mono font-bold bg-pink-soft px-2 py-0.5 rounded-full border border-pink-100">{rev.date}</span>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-0.5 text-pink-brand mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-pink-brand" : "text-stone-200"}`} />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-stone-605 leading-relaxed font-sans">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Form to submit review */}
              <form id="add-review-form" onSubmit={handleAddReview} className="bg-pink-soft/40 border border-pink-100/70 rounded-2xl p-5 mt-8 space-y-4">
                <h5 className="font-bold text-xs uppercase tracking-widest text-[#C13E53]">
                  Tulis Ulasan Baru Anda ✨
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Nama Lengkap Anda
                    </label>
                    <input
                      id="input-review-name"
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="Contoh: Dian Sastro"
                      className="w-full px-3 py-2.5 border border-pink-200 bg-white placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-xs font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Penilaian Rating Anda
                    </label>
                    <select
                      id="select-review-rating"
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-xs uppercase font-extrabold text-pink-brand-dark"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Sangat Puas (5)</option>
                      <option value="4">⭐⭐⭐⭐ Puas (4)</option>
                      <option value="3">⭐⭐⭐ Cukup (3)</option>
                      <option value="2">⭐⭐ Kurang (2)</option>
                      <option value="1">⭐ Buruk (1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Isi Detail Pengalaman / Komentar
                  </label>
                  <textarea
                    id="input-review-comment"
                    required
                    rows={2}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Tulis kenyamanan kain, kerapihan packaging..."
                    className="w-full px-3 py-2.5 border border-pink-200 bg-white placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-xs font-medium resize-none"
                  />
                </div>

                {reviewSuccess && (
                  <p id="review-success-feedback" className="text-xs text-emerald-700 font-bold">
                    🎉 Terima kasih! Ulasan Anda berhasil diterbitkan.
                  </p>
                )}

                <div className="flex justify-end p-1">
                  <button
                    id="btn-review-submit"
                    type="submit"
                    className="px-6 py-2.5 bg-pink-brand hover:bg-pink-brand-dark text-white font-bold text-xs tracking-widest uppercase rounded-full transition-all duration-300 shadow-md shadow-pink-200"
                  >
                    Kirim Ulasan Kami 🌸
                  </button>
                </div>
              </form>

            </div>

          </div>
        )}

        {/* VIEW: CONTROL CENTRAL OPERATIONAL dashboard (ADMIN EXCLUSIVE) */}
        {activeTab === "admin" && currentUser?.role === "admin" && (
          <AdminDashboard
            products={products}
            orders={orders}
            emails={emails}
            settings={settings}
            onRefreshData={handleRefreshAdminData}
          />
        )}

      </main>

      {/* 4. Footer Brand banner */}
      <footer id="app-footer-brand" className="bg-[#FFF5F6] text-stone-500 py-12 border-t border-pink-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h5 className="font-serif text-lg tracking-widest text-pink-brand-dark uppercase font-extrabold">
              {settings.boutiqueName}
            </h5>
            <p className="text-xs font-bold text-stone-600 mt-1">
              {settings.footerQuote || "🌸 Koleksi Busana Seni Desain Eksklusif Terdaftar Resmi."}
            </p>
          </div>
          
          {/* Static design links */}
          <div className="flex gap-6 text-xs text-stone-600">
            <button onClick={() => setActiveTab("shop")} className="hover:text-pink-brand font-bold transition-colors">Katalog Belanja</button>
            <button onClick={() => setActiveTab("about")} className="hover:text-pink-brand font-bold transition-colors">Hubungi Desainer WA</button>
            {settings.instagramUrl && (
              <>
                <span className="text-pink-200">|</span>
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-pink-brand font-bold transition-colors">
                  Instagram 📸
                </a>
              </>
            )}
            <span className="text-pink-200">|</span>
            <p className="font-mono text-[10px] font-semibold text-stone-500">© 2026 {settings.boutiqueName.split(" ")[0]}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* 5. USER AUTH GATEWAY FORM POPUP */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 6. APPAREL DETAILS VISUAL CUSTOMIZER POPUP */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 7. CART SIDE DRAWER BAR */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        currentUser={currentUser}
        onOpenAuth={() => {
          setShowCart(false);
          setShowAuthModal(true);
        }}
        onCheckout={handleCheckoutSubmit}
      />

      {/* 8. QRIS DIGITAL SECURE PAYMENT PORTAL */}
      {activePaymentOrder && (
        <PaymentModal
          order={activePaymentOrder}
          boutiquePhone={settings.boutiquePhone}
          onClose={() => setActivePaymentOrder(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
