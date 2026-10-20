import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen bg-[#17263C] flex items-center justify-center px-6 text-center">
      <div className="max-w-md mx-auto reveal-pop">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C7A76C] mb-2">
          <span className="font-bengali font-semibold">পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়</span> · 404 Error
        </p>
        <div className="font-serif text-[100px] sm:text-[140px] font-bold text-[#C7A76C]/25 leading-none mb-2">
          404
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-[#CBD5E1] text-sm mb-8 leading-relaxed">
          The requested page could not be located in the PUST alumni network registry. Perhaps the URL has moved or been updated.
        </p>
        <Link
          to="/"
          className="bg-[#7A1737] hover:bg-[#62122B] text-white font-semibold px-8 py-3.5 rounded-lg text-sm tracking-wide transition-all shadow-sm active:scale-95 inline-block"
        >
          Return to Institutional Home →
        </Link>
      </div>
    </div>
  );
}
