import React from "react";
import { wa } from "../data/mockData";

export default function LoadingFallback({ message = "Loading PUST Alumni Portal..." }) {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-full border-3 border-[#006B3F]/20 border-t-[#006B3F] animate-spin flex items-center justify-center" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={wa}
            alt=""
            aria-hidden="true"
            className="w-7 h-7 object-contain opacity-80"
          />
        </div>
      </div>
      <p className="font-display font-semibold text-sm text-slate-800 tracking-tight">
        {message}
      </p>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
