import React, { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Product, User } from "../types";

export interface CartItem {
  id: string; // Unique cart item ID (productId + size)
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  maxStock: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onCheckout: (
    shippingInfo: { name: string; email: string; address: string; notes: string },
    paymentMethod: "qris" | "cash"
  ) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currentUser,
  onOpenAuth,
  onCheckout,
}: CartSidebarProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");
  const [validationError, setValidationError] = useState("");

  // Sync user info from session if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setValidationError("Keranjang belanja Anda masih kosong.");
      return;
    }
    if (!name || !email || !address) {
      setValidationError("Mohon lengkapi Nama, Email, dan Alamat Pengiriman Anda.");
      return;
    }
    
    setValidationError("");
    onCheckout({ name, email, address, notes }, paymentMethod);
  };

  return (
    <div
      id="cart-overlay-shadow"
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex justify-end animate-fade-in"
    >
      {/* Click outside target */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      {/* Sidebar Panel */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-pink-100 animate-slide-left overflow-y-auto">
        
        {/* Header Block */}
        <div className="sticky top-0 bg-[#FFF5F6] z-10 px-5 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-pink-brand" />
            <h3 className="font-serif text-lg font-bold text-pink-brand-dark uppercase tracking-wide">
              Keranjang Belanja
            </h3>
            <span className="text-xs px-2.5 py-0.5 bg-white text-pink-brand border border-pink-100 rounded-full font-extrabold">
              {cartItems.length} Jenis
            </span>
          </div>
          <button
            id="btn-close-cart-sidebar"
            onClick={onClose}
            className="text-pink-400 hover:text-pink-700 p-1.5 rounded-full hover:bg-pink-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Contents representing state */}
        <div className="flex-grow p-5 space-y-6">
          
          {/* Cart listings */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-brand mb-2">
              Daftar Belanja
            </h4>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <ShoppingBag className="mx-auto h-10 w-10 text-pink-300 stroke-1 mb-2" />
                <p className="text-sm">Keranjang kosong. Cari pakaian mewah Anda!</p>
              </div>
            ) : (
              <div className="divide-y divide-pink-50 max-h-[320px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-xl bg-pink-50/20 border border-pink-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-grow min-w-0 flex flex-col justify-between text-left">
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {item.name}
                        </h5>
                        <p className="text-[10px] text-pink-brand font-bold tracking-wide uppercase -mt-0.5">
                          Ukuran: {item.size}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden bg-white shadow-3xs">
                          <button
                            id={`btn-cart-qty-dec-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-6 bg-pink-soft/30 hover:bg-pink-soft text-pink-brand text-xs font-bold"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-pink-brand-dark">
                            {item.quantity}
                          </span>
                          <button
                            id={`btn-cart-qty-inc-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-6 bg-pink-soft/30 hover:bg-pink-soft text-pink-brand text-xs font-bold"
                            disabled={item.quantity >= item.maxStock}
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-pink-brand font-mono">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`btn-cart-item-remove-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-300 hover:text-red-500 self-center"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-stone-100" />

          {/* User Sign-In Callout if guest */}
          {!currentUser && (
            <div className="p-4 bg-pink-soft/75 border border-pink-100 rounded-2xl text-left">
              <p className="text-xs text-pink-905 font-medium">
                💡 <strong>Rekomendasi:</strong> Masuk / registrasi akun agar daftar pesanan tersimpan di riwayat transaksi Anda.
              </p>
              <button
                id="btn-cart-login-callout"
                onClick={onOpenAuth}
                className="mt-2 text-xs font-extrabold text-pink-brand underline hover:text-pink-brand-dark"
              >
                Masuk / Buat Akun Sekarang
              </button>
            </div>
          )}

          {/* Form details */}
          <form id="cart-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-brand flex items-center gap-1">
              Informasi Pemesanan & Alamat 🌸
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Nama Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-input-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Siti Rahma"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  E-mail Pembeli <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: sitirahma@gmail.com"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Alamat Lengkap Pengiriman <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="checkout-input-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Perumahan Citra Asri Blok B9 No. 4, Kebayoran Baru, Jakarta Selatan, 12110"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Catatan untuk Butik (Opsional)
                </label>
                <input
                  id="checkout-input-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Tambah pita kado / kirim sebelum jam 5 sore"
                  className="w-full px-3 py-2 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-brand rounded-xl text-sm bg-white"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-2">
                  Metode Pembayaran
                </label>
                <div id="payment-methods-grid" className="grid grid-cols-2 gap-3">
                  <button
                    id="btn-payment-qris"
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === "qris"
                        ? "border-pink-brand bg-pink-soft ring-2 ring-pink-brand/25 text-pink-brand-dark font-extrabold"
                        : "border-pink-100 bg-white text-stone-500 hover:border-pink-300"
                    }`}
                  >
                    <span className="text-lg">🤳📱</span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold">QRIS Digital</span>
                  </button>

                  <button
                    id="btn-payment-cash"
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === "cash"
                        ? "border-pink-brand bg-pink-soft ring-2 ring-pink-brand/25 text-pink-brand-dark font-extrabold"
                        : "border-pink-100 bg-white text-stone-500 hover:border-pink-300"
                    }`}
                  >
                    <span className="text-lg">💵🏠</span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold font-semibold">Cash COD</span>
                  </button>
                </div>
              </div>
            </div>

            {validationError && (
              <p id="checkout-validation-error" className="text-xs text-red-600 font-semibold">
                ⚠️ {validationError}
              </p>
            )}
          </form>
        </div>

        {/* Sticky Bill checkout box */}
        <div className="sticky bottom-0 bg-[#FFF5F6] border-t border-pink-100 p-5 mt-auto">
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs text-stone-500">
              <span>Subtotal Pakaian</span>
              <span className="font-mono font-bold text-stone-750">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-xs text-stone-500">
              <span>Ongkos Kirim</span>
              <span className="text-pink-brand font-bold uppercase tracking-wider text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-100">Gratis Ongkir! 🌸</span>
            </div>
            <hr className="border-pink-200/50 my-1.5" />
            <div className="flex justify-between text-base font-bold text-stone-950">
              <span>Total Pembayaran</span>
              <span className="font-mono text-pink-brand font-extrabold">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            id="btn-checkout-submit"
            onClick={handleCheckoutSubmit}
            disabled={cartItems.length === 0}
            className={`w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md ${
              cartItems.length === 0
                ? "bg-stone-100 text-stone-400 cursor-not-allowed shadow-none border border-stone-200/70"
                : "bg-pink-brand hover:bg-pink-brand-dark text-white shadow-pink-200 hover:shadow-lg active:scale-98"
            }`}
          >
            <span>Proses Pemesanan & Bayar 🌟</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <p className="text-[10px] text-center text-pink-700 mt-2.5 font-semibold">
            Sistem otomatis menghubungkan Anda ke WhatsApp Admin & memotong stok butik secara real-time.
          </p>
        </div>

      </div>
    </div>
  );
}
