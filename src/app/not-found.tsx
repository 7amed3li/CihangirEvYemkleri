import Link from "next/link";
import { CookingPot, StoneOven } from "@/components/BrandIcons";
import { ArrowLeft, Home, Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#253D2C] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#FFFAF0] border-2 border-[#253D2C]/20 rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-[#F6F1E7] border border-[#253D2C]/24 flex items-center justify-center text-[#596752] mb-6 shadow-xs">
          <CookingPot size={44} />
        </div>

        <span className="text-4xl sm:text-5xl font-black text-[#596752] mb-2 font-mono">
          404
        </span>

        <h1
          className="text-xl sm:text-2xl font-black text-[#253D2C] mb-3"
          style={{ fontFamily: "var(--font-cairo)" }}
        >
          Sayfa Bulunamadı
        </h1>

        <p className="text-xs sm:text-sm text-[#76816E] leading-relaxed mb-8">
          Aradığınız yemek veya sayfa taşınmış veya artık mevcut olmayabilir.
          Lezzetli menümüzü keşfetmeye devam edebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/tr"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FFFAF0] border border-[#253D2C]/30 text-[#253D2C] hover:bg-[#F6F1E7] font-bold text-xs sm:text-sm transition-all"
          >
            <Home size={16} />
            <span>Ana Sayfa</span>
          </Link>

          <Link
            href="/tr/menu"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#354D37] hover:bg-[#293F30] text-white font-bold text-xs sm:text-sm transition-all shadow-md"
          >
            <Utensils size={16} />
            <span>Menüyü Gör</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
