import React from "react";
import { Eye, ShieldAlert, Star, MapPin } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Generate realistic authentic Tokopedia rating and sales
  const pseudoRating = (4.7 + ((product.id ? product.id.length : 0) % 4) * 0.1).toFixed(1);
  const pseudoSold = ((product.price % 17) + 3) * 4;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl border border-pink-100 overflow-hidden shadow-xs hover:shadow-lg hover:border-pink-300 transition-all duration-300 flex-grow"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-pink-50/20 border-b border-pink-50">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-all duration-500 scale-100 group-hover:scale-105 ${
            isSoldOut ? "opacity-50 grayscale" : ""
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Free shipping badge overlay (Tokopedia style) */}
        {!isSoldOut && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            <span className="px-2 py-0.5 text-[9px] font-black bg-pink-brand text-white rounded-md shadow-xs tracking-wider uppercase">
              Bebas Ongkir 🌸
            </span>
            {product.isFeatured && (
              <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#FFF5F6] text-pink-brand rounded-md border border-pink-200 shadow-3xs tracking-wider uppercase">
                EXCLUSIF
              </span>
            )}
          </div>
        )}

        {/* Sold Out banner */}
        {isSoldOut ? (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-3xs flex items-center justify-center z-10">
            <span id={`sold-out-badge-${product.id}`} className="px-3 py-1.5 border border-white bg-stone-900/90 text-[10px] font-black tracking-widest text-white uppercase rounded-lg shadow-lg">
              HABIS / SOLD OUT
            </span>
          </div>
        ) : (
          /* Low stock tag */
          isLowStock && (
            <div className="absolute bottom-2 left-2 z-10">
              <span id={`low-stock-badge-${product.id}`} className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase bg-rose-600 text-white rounded shadow-xs">
                <ShieldAlert className="h-3 w-3 animate-pulse" />
                Sisa {product.stock}
              </span>
            </div>
          )
        )}

        {/* Quick icon on hover */}
        {!isSoldOut && (
          <div className="absolute inset-0 bg-pink-905/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              id={`quick-view-${product.id}`}
              onClick={() => onSelect(product)}
              className="bg-white text-pink-brand hover:bg-pink-brand hover:text-white p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center focus:outline-none"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Details (Tokopedia spacing) */}
      <div className="p-3.5 flex flex-col flex-grow text-left">
        {/* Category micro label */}
        <span className="text-[9px] font-extrabold text-pink-400 tracking-wider uppercase mb-0.5">
          {product.category}
        </span>

        {/* Title: 2 lines limit */}
        <h3 
          onClick={() => !isSoldOut && onSelect(product)}
          className="font-sans text-xs sm:text-sm text-stone-800 font-semibold tracking-normal leading-snug line-clamp-2 h-10 group-hover:text-pink-brand transition-colors cursor-pointer"
        >
          {product.name}
        </h3>
        
        {/* Price (Large & pink) */}
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-sm sm:text-base font-extrabold text-pink-brand font-mono">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Promo and Shop location info */}
        <div className="mt-1.5 space-y-1">
          {/* Cashback Promo tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] text-[#C13E53] font-extrabold bg-pink-100/50 px-1.5 py-0.5 rounded border border-pink-200/40">
              Cashback 3%
            </span>
            <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/40">
              Grosir
            </span>
          </div>

          {/* Shop Location */}
          <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
            <MapPin className="h-3 w-3 text-pink-400" />
            <span className="truncate">Yuniverse Sentra</span>
          </div>

          {/* Stars Rating & Sold counter */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
              <span className="text-[10px] font-bold text-stone-700 ml-0.5 mt-0.5">{pseudoRating}</span>
            </div>
            <span className="text-stone-300 text-[10px]">|</span>
            <span className="text-[10px] text-stone-500 font-semibold">Terjual {pseudoSold}+</span>
          </div>
        </div>

        {/* Hover quick add or select trigger */}
        <div className="mt-3 pt-2 border-t border-pink-50/55 flex">
          <button
            id={`btn-select-prod-${product.id}`}
            onClick={() => onSelect(product)}
            disabled={isSoldOut}
            className={`w-full py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 ${
              isSoldOut
                ? "bg-stone-50 text-stone-400 cursor-not-allowed border border-stone-200"
                : "bg-[#FFF5F6] text-pink-brand hover:bg-pink-brand hover:text-white border border-pink-200 hover:border-pink-brand active:scale-95"
            }`}
          >
            {isSoldOut ? "Stok Habis" : "Lihat Detail"}
          </button>
        </div>
      </div>
    </div>
  );
}
