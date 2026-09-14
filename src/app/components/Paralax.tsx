"use client";
import { useEffect, useRef } from "react";

export default function Paralax() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;

      const scrolled = window.pageYOffset;
      const threshold = 300; // Parallax dimulai setelah scroll 700px

      const parallaxElements =
        parallaxRef.current.querySelectorAll("[data-speed]");

      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute("data-speed") || "0");
        const offsetX = element.getAttribute("data-offset-x") || "0px";

        if (scrolled < threshold) {
          // Sebelum threshold, reset posisi ke posisi awal
          (element as HTMLElement).style.transform = `translate(calc(-50% + ${offsetX}), 0px)`;
        } else {
          // Setelah threshold, hitung offset berdasarkan scroll yang sudah melewati threshold
          const adjustedScroll = scrolled - threshold;
          const yPos = -(adjustedScroll * speed);
          (
            element as HTMLElement
          ).style.transform = `translate(calc(-50% + ${offsetX}), ${yPos}px)`;
        }
      });
    };

    // Jalankan handleScroll sekali untuk set posisi awal
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="absolute top-0 left-0 w-full h-full overflow-hidden z-[30]">
      <div
        ref={parallaxRef}
        className="relative w-full h-[80vh] lg:h-[120vh] overflow-x-hidden overflow-y-hidden"
      >
        {/* Tengah (Siswa) */}
        <img
          src="/paralax/tengah.png"
          alt="Siswa"
          className="absolute -bottom-24 left-1/2 min-w-[0px] lg:min-w-[420px] object-cover z-50 select-none pointer-events-none"
          data-speed="-0.4"
          draggable={false}
        />
      </div>
    </section>
  );
}
