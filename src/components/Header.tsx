import React, { useState } from "react";
import { 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Bell, 
  Heart, 
  MapPin, 
  HelpCircle,
  Sparkles,
  Tag
} from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  boutiqueName: string;
  cartCount: number;
  currentUser: UserType | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function Header({
  boutiqueName,
  cartCount,
  currentUser,
  onOpenCart,
  onOpenAuth,
  onLogout,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const popularSearches = ["Kebaya", "Kaftan", "Dress Silk", "Outerwear", "Celana"];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white border-b border-pink-100 shadow-sm">
      
      {/* ROW 2: Primary Tokopedia Branding + Search Bar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-pink-900 hover:text-pink-brand p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <button
              id="btn-nav-home"
              onClick={() => {
                setActiveTab("shop");
                setMobileMenuOpen(false);
              }}
              className="group flex flex-col items-start focus:outline-none"
            >
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-pink-brand-dark uppercase font-black transition-all duration-300 group-hover:opacity-80">
                {boutiqueName.split(" ")[0]}
              </span>
              <span className="text-[9px] tracking-widest font-sans uppercase text-pink-400 font-extrabold -mt-1">
                {boutiqueName.split(" ")[1] || "Boutique"}
              </span>
            </button>
          </div>

          {/* Kategori Dropdown Trigger (Hidden on Mobile) */}
          <div className="hidden lg:block relative">
            <button
              id="header-category-trigger"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-stone-700 hover:text-pink-brand hover:bg-pink-50 rounded-lg transition-all"
            >
              <span>Kategori</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-185" : ""}`} />
            </button>

            {/* Dropdown Box */}
            {categoryDropdownOpen && (
              <div className="absolute top-11 left-0 w-48 bg-white border border-pink-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in text-left">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTab("shop");
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-pink-soft/50 hover:text-pink-brand transition-colors flex items-center justify-between ${
                      selectedCategory === cat ? "text-pink-brand bg-pink-soft" : "text-stone-600"
                    }`}
                  >
                    <span>{cat}</span>
                    <Tag className="h-3 w-3 opacity-30" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prominent Tokopedia-style Central Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "shop") {
                    setActiveTab("shop");
                  }
                }}
                placeholder="Cari kebaya sutera mewah, dress pesta, atau outerwear..."
                className="w-full pl-3.5 pr-12 py-2 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-brand/25 focus:border-pink-brand rounded-lg text-xs bg-white shadow-3xs transition-all placeholder-stone-400"
              />
              <button 
                className="absolute right-1 top-1 bottom-1 px-3 bg-pink-brand hover:bg-pink-brand-dark text-white rounded-md transition-colors flex items-center justify-center"
                title="Search"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Micro suggestions tag row under search input (Hidden on Mobile) */}
            <div className="hidden md:flex gap-3 text-[10px] text-stone-400 mt-1 font-semibold pl-1">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search);
                    setActiveTab("shop");
                  }}
                  className="hover:text-pink-brand transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Tokopedia Actions Cluster (Icons & Badge count) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Wishlist Icon */}
            <button 
              className="relative p-1.5 text-stone-400 hover:text-pink-brand rounded-full hover:bg-pink-50 transition-all hidden sm:inline-block"
              title="Favorit Saya"
              onClick={() => {
                setActiveTab("shop");
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
            >
              <Heart className="h-5 w-5" />
            </button>

            {/* Notifications Ball Trigger */}
            <div className="relative">
              <button 
                className="p-1.5 text-stone-400 hover:text-pink-brand rounded-full hover:bg-pink-50 transition-all cursor-pointer relative"
                title="Notifikasi"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#C13E53] ring-1 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-10 w-64 bg-white border border-pink-100 rounded-xl shadow-xl py-3 z-50 text-left px-3 animate-fade-in">
                  <p className="text-[11px] font-extrabold text-pink-brand uppercase tracking-wider mb-2">Pemberitahuan</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    <div className="p-2 bg-pink-soft/30 rounded-lg text-stone-600 text-[10px] border border-pink-100/50">
                      <strong>🎁 Promo Voucher Spesial:</strong> Cashback 3% dan Gratis Pengiriman tanpa minimal belanja hari ini!
                    </div>
                    <div className="p-2 bg-pink-soft/30 rounded-lg text-stone-600 text-[10px] border border-pink-100/50">
                      <strong>✨ Restock Baru:</strong> Koleksi Gaun Premium Mulberry Silk telah diunggah di katalog.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <button
              id="header-cart-trigger"
              onClick={onOpenCart}
              className="relative p-2 text-stone-600 hover:text-pink-brand hover:bg-pink-50 rounded-lg transition-all group focus:outline-none"
            >
              <ShoppingBag className="h-5.5 w-5.5 transition-transform group-hover:-translate-y-0.5 text-stone-700 group-hover:text-pink-brand" />
              {cartCount > 0 && (
                <span id="header-cart-badge" className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-pink-brand text-[9px] font-black text-white shadow-xs ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Vertical Split Line (Desktop only) */}
            <span className="hidden sm:inline-block h-5 w-[1px] bg-pink-100"></span>

            {/* Auth / Admin buttons */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 text-stone-800 p-1 pl-2.5 rounded-full bg-[#FFF5F6] border border-pink-100">
                <div id="user-avatar-initial" className="w-6.5 h-6.5 rounded-full bg-pink-brand text-stone-100 flex items-center justify-center text-[10px] font-bold uppercase shadow-2xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-[10px] text-left max-w-[90px]">
                  <p className="font-extrabold truncate leading-tight text-stone-850">{currentUser.name}</p>
                  <p className="text-[9px] text-pink-brand font-mono capitalize font-bold leading-none">{currentUser.role}</p>
                </div>
                
                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => setActiveTab("admin")}
                    title="Admin Dashboard"
                    className="p-1 text-pink-400 hover:text-pink-brand rounded-full hover:bg-white"
                  >
                    <Settings className="h-3.5 w-3.5 text-pink-brand" />
                  </button>
                )}

                <button
                  id="btn-header-logout"
                  onClick={onLogout}
                  title="Logout"
                  className="p-1 px-1.5 text-stone-400 hover:text-red-500 rounded-full"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  id="btn-header-login-outline"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 text-xs font-bold text-pink-brand bg-white border border-pink-200 hover:border-pink-brand rounded-lg transition-all"
                >
                  Masuk
                </button>
                <button
                  id="btn-header-register"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-pink-brand hover:bg-pink-brand-dark rounded-lg shadow-sm transition-all shadow-pink-100"
                >
                  Daftar
                </button>
              </div>
            )}

            {/* Mobile-only session actions */}
            {currentUser && (
              <button
                id="btn-header-logout-mobile"
                onClick={onLogout}
                title="Logout"
                className="inline-block sm:hidden text-stone-500 hover:text-red-500 transition-colors p-2"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Secondary Links Row (Desktop Tab Switching) */}
      <div className="hidden lg:block bg-white border-t border-pink-50 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-8 items-center text-xs font-bold">
          <button
            onClick={() => setActiveTab("shop")}
            className={`transition-colors uppercase tracking-wider pb-1 ${
              activeTab === "shop" ? "text-pink-brand border-b-2 border-pink-brand" : "text-stone-500 hover:text-pink-brand"
            }`}
          >
            📋 Katalog Belanja Belanja
          </button>
          
          <button
            onClick={() => setActiveTab("about")}
            className={`transition-colors uppercase tracking-wider pb-1 ${
              activeTab === "about" ? "text-pink-brand border-b-2 border-pink-brand" : "text-stone-500 hover:text-pink-brand"
            }`}
          >
            🌸 Hubungi & Ulasan Desainer
          </button>

          {currentUser?.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-1.5 text-pink-brand uppercase tracking-wider pb-1 border-b-2 border-transparent hover:border-pink-brand`}
            >
              🔑 Manage Admin Dashboard
            </button>
          )}

          {/* Quick Info text on right */}
          <span className="ml-auto text-[10px] text-pink-brand font-black animate-pulse uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
            ✨ Cashback 3% Aktif Tanpa Minimal Belanja!
          </span>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden bg-white border-t border-pink-100 py-4 px-6 animate-fade-in divide-y divide-pink-100 shadow-md">
          {/* Quick Categories filter on mobile */}
          <div className="py-2 flex flex-col space-y-2">
            <p className="text-[10px] font-black uppercase text-pink-brand tracking-widest mb-1 pl-1">🏷️ Cari Berdasarkan Kategori</p>
            <div className="grid grid-cols-2 gap-2 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActiveTab("shop");
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition-all ${
                    selectedCategory === cat 
                      ? "bg-[#FFF5F6] border-pink-brand text-pink-brand font-black" 
                      : "bg-white border-pink-100 text-stone-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] font-black uppercase text-pink-brand tracking-widest pt-2 pl-1">🧭 Navigasi Halaman</p>
            <button
              onClick={() => {
                setActiveTab("shop");
                setMobileMenuOpen(false);
              }}
              className={`text-left text-xs tracking-wider uppercase font-extrabold py-2 px-2.5 rounded-lg ${
                activeTab === "shop" ? "bg-pink-brand text-white font-black" : "text-stone-600 hover:bg-pink-50"
              }`}
            >
              📋 Katalog Belanja
            </button>
            <button
              onClick={() => {
                setActiveTab("about");
                setMobileMenuOpen(false);
              }}
              className={`text-left text-xs tracking-wider uppercase font-extrabold py-2 px-2.5 rounded-lg ${
                activeTab === "about" ? "bg-pink-brand text-white font-black" : "text-stone-600 hover:bg-pink-50"
              }`}
            >
              🌸 Ulasan & Kontak Desainer
            </button>
            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  setActiveTab("admin");
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-xs tracking-wider uppercase font-black text-pink-brand py-2 px-2.5 bg-[#FFF5F6] rounded-lg border border-pink-200`}
              >
                🛠️ Admin Panel
              </button>
            )}
          </div>
          
          <div className="pt-4 pb-2">
            {currentUser ? (
              <div>
                <p className="text-[10px] text-stone-400 font-sans tracking-wide uppercase">Sesi Berjalan</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-8 h-8 rounded-full bg-pink-brand text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-850 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-pink-brand font-mono leading-none capitalize mt-0.5">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-bold text-pink-brand border border-pink-200 rounded-lg bg-white"
                >
                  Masuk Akun
                </button>
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-pink-brand rounded-lg shadow-sm"
                >
                  Daftar Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
