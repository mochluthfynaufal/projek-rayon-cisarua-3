"use client";
import { useEffect, useRef } from "react";

export default function Paralax() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;

      const scrolled = window.pageYOffset;
      const threshold = 300; // Parallax dimulai setelah scroll 300px

      const parallaxElements =
        parallaxRef.current.querySelectorAll("[data-speed]");

      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute("data-speed") || "0");
        const xOffset = element.getAttribute("data-x") || "-50%";

        if (scrolled < threshold) {
          // Sebelum threshold, reset posisi ke posisi awal
          (element as HTMLElement).style.transform = `translate(${xOffset}, 0px)`;
        } else {
          // Setelah threshold, hitung offset berdasarkan scroll yang sudah melewati threshold
          const adjustedScroll = scrolled - threshold;
          const yPos = -(adjustedScroll * speed);
          (
            element as HTMLElement
          ).style.transform = `translate(${xOffset}, ${yPos}px)`;
        }
      });
    };

    // Jalankan handleScroll sekali untuk set posisi awal
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div
        ref={parallaxRef}
        className="relative w-full h-full overflow-x-hidden overflow-y-hidden"
      >
        {/* Layer 1: Background paling belakang */}
        <img
          src="/wikrama/background.webp"
          alt="Background Langit"
          className="absolute -top-[10%] left-0 w-full h-[120%] object-cover z-[12] select-none pointer-events-none opacity-40"
          data-speed="-0.15"
          data-x="0"
          draggable={false}
        />

        {/* Layer 2: Awan (di belakang gedung, di depan background) */}
        <img
          src="/wikrama/awan.webp"
          alt="Awan Depan"
          className="absolute top-0 left-0 w-full object-cover sm:object-contain object-top z-[15] select-none pointer-events-none max-h-[45vh]"
          data-speed="0.2"
          data-x="0"
          draggable={false}
        />

        {/* Layer 3: Gedung tengah (di BELAKANG gedung samping) */}
        <img
          src="/wikrama/Gedung tengah.webp"
          alt="Gedung Tengah"
          className="absolute left-0 w-full h-[81vh] object-contain object-bottom z-[17] select-none pointer-events-none"
          style={{ bottom: "-100px" }}
          data-speed="-0.25"
          data-x="0"
          draggable={false}
        />

        {/* Layer 4: Gedung samping (di DEPAN gedung tengah) */}
        <img
          src="/wikrama/gedungsamping.webp"
          alt="Gedung Samping"
          className="absolute bottom-0 left-0 w-full h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] xl:h-[95vh] object-cover object-bottom z-[18] select-none pointer-events-none"
          data-speed="-0.25"
          data-x="0"
          draggable={false}
        />

        {/* Layer 5: Seragam senin (di samping kiri menempel tanah) */}
        <img
          src="/wikrama/Seragam senin.webp"
          alt="Seragam Senin"
          className="absolute bottom-0 left-8 sm:left-14 md:left-20 lg:left-28 xl:left-36 w-[170px] sm:w-[210px] md:w-[260px] lg:w-[310px] object-contain z-[50] select-none pointer-events-none"
          data-speed="-0.4"
          data-x="0"
          draggable={false}
        />
      </div>
    </section>
  );
}
