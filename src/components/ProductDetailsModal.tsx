import React, { useState } from "react";
import { X, ShoppingBag, Check } from "lucide-react";
import { Product } from "../types";

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAdd = () => {
    if (!selectedSize) {
      setErrorMsg("Mohon pilih ukuran (Size) pakaian terlebih dahulu.");
      return;
    }
    setErrorMsg("");
    onAddToCart(product, selectedSize, quantity);
    
    // Show beautiful success visual feedback
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="product-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full mx-auto overflow-hidden shadow-2xl border border-pink-100 flex flex-col md:flex-row relative max-h-[90vh] md:max-h-auto overflow-y-auto">
        
        {/* Close Button */}
        <button
          id="btn-close-details-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/85 hover:bg-stone-100 text-stone-700 p-1.5 rounded-full border border-stone-200/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 aspect-3/4 max-h-[400px] md:max-h-none md:h-auto bg-stone-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Customizer & Checkout Configuration */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between text-left">
          <div>
            <span className="text-[10px] font-bold text-pink-brand tracking-widest uppercase mb-1.5 block">
              {product.category}
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-950 tracking-tight leading-snug">
              {product.name}
            </h2>
            
            <p className="mt-3 text-lg font-semibold text-pink-brand font-mono">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <hr className="my-4 border-pink-100/50" />

            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
              Deskripsi Pakaian
            </h4>
            <p className="text-sm font-light text-stone-600 leading-relaxed font-sans">
              {product.description}
            </p>

            <hr className="my-4 border-pink-100/50" />

            {/* Selection: Sizes */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-900">
                  Pilih Ukuran (Size)
                </span>
                <span className="text-[10px] text-pink-brand font-bold bg-pink-soft px-2 py-0.5 rounded-full border border-pink-100">
                  Stok: {product.stock} pcs
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setErrorMsg("");
                    }}
                    className={`min-w-[40px] h-10 px-3 rounded-xl text-xs font-bold font-sans flex items-center justify-center border transition-all ${
                      selectedSize === sz
                        ? "bg-pink-brand text-white border-pink-brand shadow-md scale-102"
                        : "bg-white text-stone-800 border-pink-200 hover:border-pink-brand"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {errorMsg && (
                <p id="size-error-message" className="text-xs text-red-650 mt-2 font-semibold flex items-center gap-1">
                  💡 {errorMsg}
                </p>
              )}
            </div>

            {/* Selector: Quantity */}
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-900 block mb-2">
                Jumlah Pesanan
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                  <button
                    id="btn-qty-decrease"
                    onClick={handleDecreaseQty}
                    className="w-10 h-9 bg-pink-soft/40 hover:bg-pink-soft text-pink-brand flex items-center justify-center font-bold font-sans transition-colors focus:outline-none"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span id="qty-display" className="w-12 text-center text-sm font-bold text-stone-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    id="btn-qty-increase"
                    onClick={handleIncreaseQty}
                    className="w-10 h-9 bg-pink-soft/40 hover:bg-pink-soft text-pink-brand flex items-center justify-center font-bold font-sans transition-colors focus:outline-none"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-stone-500">
                  Maksimal pembelian {product.stock} pcs
                </span>
              </div>
            </div>

            {/* Tokopedia-style Shipping & Trust badges */}
            <div className="p-3 bg-pink-soft/30 rounded-xl border border-pink-100/50 space-y-2.5 mb-6 text-xs text-stone-650">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[9px] uppercase font-black">BEBAS ONGKIR ✅</span>
                <span>Estimasi Pengiriman</span>
              </div>
              <div className="space-y-1.5 pl-1">
                <p className="font-semibold text-stone-700 flex justify-between">
                  <span>🚚 Instan / Reguler (Seluruh Indonesia)</span>
                  <span className="text-pink-brand font-bold">Gratis</span>
                </p>
                <p className="text-[10px] text-stone-500">
                  Estimasi tiba dalam 1-3 hari kerja. Dikirim dengan GoSend, Grab, J&E, J&T, atau SiCepat.
                </p>
              </div>
              <div className="border-t border-pink-100/50 pt-2 flex items-center gap-2 text-[10px] text-stone-500 font-bold">
                <span>🛡️ 100% Produk Butik Orisinil</span>
                <span>•</span>
                <span>🌸 Layanan WhatsApp Siaga</span>
              </div>
            </div>
          </div>

          {/* Checkout/Add Button */}
          <div>
            <button
              id="btn-add-to-cart"
              onClick={handleAdd}
              className={`w-full py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${
                addedFeedback
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "bg-pink-brand text-white hover:bg-pink-brand-dark shadow-pink-205 active:scale-98"
              }`}
              disabled={addedFeedback || product.stock === 0}
            >
              {addedFeedback ? (
                <>
                  <Check className="h-4.5 w-4.5 animate-bounce" />
                  <span>Berhasil Ditambahkan!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>Masukkan ke Keranjang 🌸</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
