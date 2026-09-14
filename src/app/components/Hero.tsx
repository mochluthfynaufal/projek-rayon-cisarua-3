"use client";
import { useEffect, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import Paralax from "./Paralax";
import ClickSpark from "../rb/ClickSpark/ClickSpark";
import RotatingText from "../rb/RotatingText/RotatingText";

interface HeroProps {
  title: string;
  highlightPrefix?: string;
  rotatingTexts: string[];
  subtitle: string;
  primaryColor: string;
  ctaPrimary: {
    text: string;
    action?: () => void;
  };
  ctaSecondary: {
    text: string;
    action?: () => void;
  };
  theme: {
    gradient: string;
    primaryColor: string;
    primaryHover: string;
    borderColor: string;
    hoverBg: string;
  };
}

export default function Hero({
  title,
  highlightPrefix = "Kamu",
  rotatingTexts,
  subtitle,
  primaryColor,
  ctaPrimary,
  ctaSecondary,
  theme,
}: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 600]); // Parallax dengan Framer Motion
  const rotateX = useTransform(scrollY, [0, 1000], [0, -5]); // Rotasi X untuk efek miring ke depan

  return (
    <ClickSpark
      sparkColor="#000000"
      sparkSize={20}
      sparkRadius={15}
      sparkCount={12}
      duration={400}
    >
      <section className="relative w-full h-[85vh] lg:h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient - Dynamic based on theme */}
        <div className={`absolute inset-0 ${theme.gradient} z-[10]`} />

        <Paralax />

        <motion.header
          className="lg:-mt-4 -mt-30 text-center px-4 w-full max-w-4xl items-center relative z-[35]"
          style={{
            y,
            rotateX,
            transformPerspective: 1000,
          }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-3 tracking-tight">
            {title}
          </h1>
          <div
            className={`${primaryColor} gap-3 items-center justify-center flex flex-wrap text-3xl md:text-4xl lg:text-5xl font-extrabold min-h-[3.5rem]`}
          >
            <span>{highlightPrefix}</span>
            <RotatingText
              texts={rotatingTexts}
              mainClassName={`px-3.5 py-1 sm:px-4 sm:py-1.5 md:py-2 text-shadow-sm ${theme.primaryColor} shadow-lg shadow-black/10 text-white font-black overflow-hidden justify-center rounded-2xl inline-flex items-center`}
              staggerFrom={"last"}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden leading-tight"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2200}
            />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mt-4 mb-8 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={ctaPrimary.action}
              className={`${theme.primaryColor} text-shadow-sm shadow-md ${theme.primaryHover} text-white font-bold py-3 px-7 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95`}
            >
              {ctaPrimary.text}
            </button>
            <button
              onClick={ctaSecondary.action}
              className={`border-2 ${theme.borderColor} ${primaryColor} ${theme.hoverBg} font-bold py-3 px-7 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95`}
            >
              {ctaSecondary.text}
            </button>
          </div>
        </motion.header>
      </section>
    </ClickSpark>
  );
}
