import React, { useState, useEffect } from "react";
import { CheckCircle2, QrCode, PhoneCall, Copy, Check, Clock, ExternalLink } from "lucide-react";
import { Order } from "../types";

interface PaymentModalProps {
  order: Order;
  boutiquePhone: string;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

export default function PaymentModal({
  order,
  boutiquePhone,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins expiry

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setCheckingStatus(true);
    
    // Simulate server status check
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    try {
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "paid", status: "processing" }),
      });
      
      if (response.ok) {
        setIsPaid(true);
        onPaymentSuccess(order.id);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Generate WA Template
  const generateWaLink = () => {
    const targetPhone = boutiquePhone.replace("+", "").replace("-", "").replace(" ", "");
    
    const itemsText = order.items
      .map(
        (it) =>
          `• *${it.name}* (Size ${it.size})\n  Qty: ${it.quantity} x Rp ${it.price.toLocaleString("id-ID")}`
      )
      .join("\n");

    const messageText = `Halo Yuniverse Boutique! Saya baru saja melakukan pemesanan pakaian eksklusif.\n\n*DETAIL PESANAN*\n----------------------------------\n📄 *ID Pesanan:* ${order.id}\n👤 *Nama Pelanggan:* ${order.userName}\n📬 *Alamat Kirim:* ${order.notes ? `(${order.notes}) ` : ""}${order.userEmail}\n💳 *Metode Bayar:* ${order.paymentMethod === "qris" ? "QRIS GPN (Digital)" : "Cash / Tunai COD"}\n💰 *Total Transaksi:* Rp ${order.totalAmount.toLocaleString("id-ID")}\n🛍️ *Item Pesanan:*\n${itemsText}\n----------------------------------\n\n*Status Pembayaran:* ${order.paymentMethod === "qris" ? "SUDAH DIBAYAR (LUNAS via Mobile Banking)" : "Akan Dibayar Cash saat Kurir Tiba"}\n\nMohon bantuannya untuk segera diproses dan dikirimkan ya, terima kasih! ✨`;

    return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(messageText)}`;
  };

  return (
    <div
      id="payment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-lg max-w-md w-full mx-auto overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        
        {/* Header Title */}
        <div className="bg-pink-brand text-white px-5 py-4 flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-serif text-base font-bold tracking-wider uppercase text-pink-soft">
              Gerbang Pembayaran
            </h3>
            <p className="text-[10px] text-pink-100 font-sans tracking-wide font-semibold">
              YUNIVERSE BOUTIQUE SECURE CHECKOUT
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-pink-brand-dark/50 text-white rounded-full border border-pink-200/35">
            #{order.id}
          </span>
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto flex-grow text-center space-y-6">
          
          {/* Success screen if paid */}
          {isPaid ? (
            <div className="py-8 space-y-4 animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-50 text-pink-brand rounded-full border border-pink-200">
                <CheckCircle2 className="h-10 w-10 animate-bounce text-pink-brand" />
              </div>
              <h4 className="font-serif text-xl font-bold text-stone-900">
                Pembayaran Berhasil!
              </h4>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto leading-relaxed">
                Stok busana di inventaris Yuniverse Boutique telah resmi dikunci untuk Anda. Notifikasi e-mail otomatis telah sukses terkirim ke admin.
              </p>

              <div className="p-4 bg-pink-soft/50 rounded-2xl text-left text-xs border border-pink-100 font-sans space-y-2.5 max-w-sm mx-auto mt-6">
                <div className="flex justify-between">
                  <span className="text-stone-400">Penerima</span>
                  <span className="font-bold text-stone-900">{order.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Belanja</span>
                  <span className="font-bold text-stone-900 font-mono">Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Metode Bayar</span>
                  <span className="font-bold text-pink-brand capitalize">{order.paymentMethod} (Lunas)</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-6 space-y-3">
                <a
                  id="btn-complete-whatsapp-redirect"
                  href={generateWaLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-[#faf9f6] rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Kirim Rincian ke WhatsApp Admin</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  id="btn-close-payment-success"
                  onClick={onClose}
                  className="w-full py-3 px-4 border border-pink-200 hover:bg-pink-soft-hover text-pink-brand rounded-full font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  Kembali Ke Katalog Toko
                </button>
              </div>
            </div>
          ) : (
            /* Normal checkout screens (QRIS or COD) */
            <>
              {order.paymentMethod === "qris" ? (
                /* QRIS screen */
                <div className="space-y-4">
                  {/* Digital Clock */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-pink-brand bg-pink-50 rounded-full px-3 py-1.5 w-fit mx-auto border border-pink-100">
                    <Clock className="h-3.5 w-3.5 text-pink-brand" />
                    <span>Selesaikan pembayaran dalam</span>
                    <span className="font-mono font-bold animate-pulse text-pink-brand-dark">{formatTime(secondsLeft)}</span>
                  </div>

                  {/* QRIS Graphic box */}
                  <div className="bg-pink-soft/80 border border-pink-200 rounded-2xl p-4 max-w-[310px] mx-auto shadow-xs space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-pink-200">
                      <span className="text-[11px] font-mono tracking-widest font-extrabold text-[#dd2834]">QRIS</span>
                      <span className="text-[8px] font-sans font-bold text-stone-500 uppercase">YUNIVERSE BOUTIQUE</span>
                    </div>

                    {/* Styled Link Alert with real QR code image preview */}
                    <div className="bg-white border border-pink-150 rounded-xl p-3.5 text-center flex flex-col items-center justify-center space-y-3">
                      
                      {/* Image container representing the cropped/scannable QR code */}
                      <div className="relative w-56 h-56 overflow-hidden rounded-lg border-2 border-stone-150 shadow-inner bg-stone-50 flex items-center justify-center group">
                        
                        {/* Real QRIS Image loaded directly from Google Drive */}
                        <img 
                          src="https://lh3.googleusercontent.com/d/1fnodqvMi6Y8tmtF9v6aRoUdYJT4S3Pl0" 
                          alt="QRIS Yuniverse Boutique"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover scale-[1.05] transition-transform duration-300 group-hover:scale-[1.12]"
                          onError={(e) => {
                            // Fallback to direct download link on error
                            e.currentTarget.src = "https://docs.google.com/uc?export=download&id=1fnodqvMi6Y8tmtF9v6aRoUdYJT4S3Pl0";
                          }}
                        />

                        {/* Scanner corners (Aesthetic look) */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-pink-500 rounded-tl-xs"></div>
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-pink-500 rounded-tr-xs"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-pink-500 rounded-bl-xs"></div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-pink-500 rounded-br-xs"></div>
                        
                        {/* Scanner Laser effect */}
                        <div className="absolute left-0 right-0 h-[1.5px] bg-pink-500/70 shadow-[0_0_8px_rgba(219,39,119,0.5)] top-1/2 -translate-y-1/2 animate-[pulse_2s_infinite]"></div>
                      </div>

                      <p className="text-[11px] text-stone-600 font-sans leading-relaxed px-1 font-medium">
                        Silakan scan QRIS Resmi kami langsung dari layar ini menggunakan m-banking atau e-wallet (GoPay, OVO, Dana, dll).
                      </p>
                      
                      <a
                        href="https://drive.google.com/file/d/1fnodqvMi6Y8tmtF9v6aRoUdYJT4S3Pl0/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-soft hover:bg-pink-soft-hover text-pink-brand border border-pink-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Buka via Google Drive (Cadangan)</span>
                      </a>
                    </div>

                    <div className="text-[10px] text-stone-500 font-sans tracking-wide">
                      Kode QRIS ini aman & terverifikasi GPN Indonesia.
                    </div>
                  </div>

                  {/* Pricing detail */}
                  <div className="space-y-1">
                    <p className="text-[11px] text-stone-400 uppercase tracking-widest font-semibold">Total Tagihan Pembayaran</p>
                    <p className="text-xl font-bold font-mono text-pink-brand">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 space-y-2.5">
                    <button
                      id="btn-simulate-qris-payment"
                      onClick={handleSimulatePayment}
                      disabled={checkingStatus}
                      className="w-full py-3.5 px-4 bg-pink-brand hover:bg-pink-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-full flex items-center justify-center gap-2 transition-all disabled:bg-stone-300"
                    >
                      {checkingStatus ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Memeriksa Mutasi QRIS...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Saya Sudah Scan & Bayar QRIS</span>
                        </>
                      )}
                    </button>

                    <button
                      id="btn-copy-order-id"
                      onClick={handleCopyOrderId}
                      className="w-full py-2.5 px-4 border border-pink-200 hover:bg-pink-soft text-pink-brand rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedOrderId ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">ID Pesanan Berhasil Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-pink-brand" />
                          <span>Salin ID Pesanan Untuk WA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Cash / Tunai COD screen */
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-50 text-pink-brand rounded-full border border-pink-100">
                    💵
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                    Instruksi Pembayaran COD (Bayar di Tempat)
                  </h4>
                  <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto leading-relaxed text-left">
                    Pesanan Anda telah dicatat oleh sistem Yuniverse Boutique. Silakan siapkan uang tunai pas sebesar nominal di bawah ini untuk diserahkan ke kurir saat barang tiba di alamat rumah Anda.
                  </p>

                  <div className="p-4 bg-pink-soft/40 border border-pink-100 rounded-2xl text-left text-xs font-sans space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Penerima</span>
                      <strong className="text-stone-800">{order.userName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Alamat Kirim</span>
                      <strong className="text-stone-800 line-clamp-1">{order.userEmail}</strong>
                    </div>
                    <div className="flex justify-between border-t border-pink-150 pt-2 mt-2">
                      <span className="text-stone-800 font-bold">Tagihan COD Pas</span>
                      <strong className="text-md text-pink-brand font-mono">Rp {order.totalAmount.toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 space-y-3">
                    <a
                      id="btn-direct-wa-template-cod"
                      href={generateWaLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Kirim Pesanan ke WhatsApp Admin</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <button
                      id="btn-close-payment-cod"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 border border-pink-200 hover:bg-pink-soft text-pink-brand rounded-full text-xs font-bold uppercase transition-colors"
                    >
                      Tutup & Lanjutkan Belanja
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
