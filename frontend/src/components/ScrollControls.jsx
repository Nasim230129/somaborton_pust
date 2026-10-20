import React, { useState, useEffect } from "react";

/**
 * ScrollControls:
 * 1. Fixed reading progress bar at the very top of the window
 * 2. Floating scroll-to-top button with smooth deceleration
 */
export default function ScrollControls() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(Math.max((scrollY / scrollHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }

      setShowScrollTop(scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* 1. TOP SCROLL PROGRESS BAR */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Scroll progress indicator"
      />

      {/* 2. FLOATING SCROLL-TO-TOP BUTTON */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`scroll-to-top-btn group ${
          showScrollTop ? "is-active" : ""
        }`}
        aria-label="Scroll back to top"
        title="উপরে স্ক্রোল করুন / Scroll to Top"
      >
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
}
