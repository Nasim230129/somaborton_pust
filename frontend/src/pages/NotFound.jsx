import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen bg-[#1A2744] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-['Fraunces',serif] text-[120px] lg:text-[180px] font-light text-[#C9973C]/20 leading-none mb-4">
          404
        </div>
        <h1 className="font-['Fraunces',serif] text-4xl font-light text-[#F7F2E9] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#7A90B8] mb-10 max-w-sm mx-auto">
          This page does not exist in the PUST alumni network. Perhaps you were
          looking for something else?
        </p>
        <Link
          to="/"
          className="bg-[#C9973C] hover:bg-[#B5842E] text-[#1A2744] font-semibold px-8 py-4 rounded-sm text-sm tracking-wide transition-colors inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
