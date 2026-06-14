import React, { useState, useEffect } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Gift, Percent, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  bannerUrl: string;
}

export default function HeroSection({ title, subtitle, bannerUrl }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: title || "Koleksi Kebaya Modern",
      subtitle: subtitle || "Rancangan desainer orisinil dengan benang sutera premium mulberry silk.",
      image: bannerUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
      tag: "Diskon Baru 🌸",
    },
    {
      title: "Mulberry Silk Luxury",
      subtitle: "Kombinasi serat kain ramah kulit & desainer berkelas internasional.",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop&q=80",
      tag: "Eksklusif Butik ✨",
    },
    {
      title: "Kasual Formal Kontemporer",
      subtitle: "Estetika kebaya warisan nusantara dibalut paduan modernitas aktif.",
      image: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=1200&auto=format&fit=crop&q=80",
      tag: "New Arrivals 🔥",
    }
  ];

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div id="hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      
      {/* 2-Column Tokopedia-style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main interactive carousel slider (2/3 width) */}
        <div className="lg:col-span-2 relative aspect-[21/9] sm:aspect-[21/8] lg:aspect-auto lg:h-[300px] w-full rounded-2xl overflow-hidden group shadow-sm border border-pink-100 bg-white">
          
          {/* Active slide view */}
          <div className="absolute inset-0 z-0">
            <img
              src={slides[activeSlide].image}
              alt={slides[activeSlide].title}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out scale-100"
              referrerPolicy="no-referrer"
            />
            {/* Soft pink / white visual gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent"></div>
          </div>

          {/* Slide Text Content overlay */}
          <div className="absolute inset-y-0 left-0 z-10 max-w-sm sm:max-w-lg p-6 sm:p-10 flex flex-col justify-center text-left">
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-pink-brand px-2 py-0.5 bg-pink-soft border border-pink-100 rounded-md w-fit mb-2 sm:mb-3">
              <Sparkles className="h-2.5 w-2.5" />
              {slides[activeSlide].tag}
            </span>
            <h2 className="font-serif text-lg sm:text-2xl md:text-3xl text-stone-900 font-extrabold tracking-tight leading-tight">
              {slides[activeSlide].title}
            </h2>
            <p className="text-[10px] sm:text-xs text-stone-605 mt-1 sm:mt-2.5 max-w-xs font-semibold leading-relaxed line-clamp-2 sm:line-clamp-none">
              {slides[activeSlide].subtitle}
            </p>
            
            <a
              href="#katalog-produk"
              className="mt-3 sm:mt-5 px-4.5 py-2 sm:py-2.5 bg-pink-brand hover:bg-pink-brand-dark text-white rounded-lg text-[10px] font-bold tracking-widest uppercase w-fit shadow-md shadow-pink-100 transition-all duration-300"
            >
              Belanja Sekarang 🛍️
            </a>
          </div>

          {/* Manual control arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-pink-100 hover:bg-white text-pink-brand flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 focus:outline-none"
            title="Slide Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-pink-100 hover:bg-white text-pink-brand flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 focus:outline-none"
            title="Slide Selanjutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-6 flex gap-1.5 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i ? "w-6 bg-pink-brand" : "bg-pink-200 hover:bg-pink-300"
                }`}
                title={`Menuju slide ${i + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Side mini promos (1/3 width, hidden on mobile for clutter reduction) */}
        <div className="hidden lg:flex flex-col gap-3.5">
          
          {/* Promo Card 1: Flash Discount */}
          <div className="flex-1 rounded-2xl border border-pink-100 bg-[#FFF5F6] p-4 flex flex-col justify-between text-left relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-software text-pink-brand pointer-events-none opacity-20 transform translate-x-2 -translate-y-2 rounded-full"></div>
            <div>
              <div className="flex items-center gap-1.5 text-pink-brand">
                <Percent className="h-4 w-4" />
                <span className="text-[10px] uppercase font-black tracking-wider">Kupon Ramadan / Juni 🌸</span>
              </div>
              <h3 className="text-sm font-black text-pink-brand-dark mt-1 leading-tight">
                Cashback Spesial 3% Tanpa Minimum
              </h3>
              <p className="text-[10px] text-stone-500 font-semibold mt-1">
                Klaim otomatis & berlaku instan saat checkout keranjang.
              </p>
            </div>
            
            <a 
              href="#katalog-produk" 
              className="mt-3 flex items-center gap-1 text-[10px] text-[#C13E53] font-bold hover:underline"
            >
              <span>Belanja Sekarang</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Promo Card 2: Free Shipping Banner */}
          <div className="flex-1 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex flex-col justify-between text-left hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Gift className="h-4 w-4" />
                <span className="text-[10px] uppercase font-black tracking-wider">Spesial Voucher 🚚</span>
              </div>
              <h3 className="text-sm font-black text-emerald-900 mt-1 leading-tight">
                Gratis Ongkir Seluruh Indonesia
              </h3>
              <p className="text-[10px] text-stone-500 font-semibold mt-1">
                Kami bayar ongkir Anda! Pengiriman premium berasuransi bebas biaya.
              </p>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-[9px] font-mono font-bold bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
              VOUCHER TERPAKAI
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
