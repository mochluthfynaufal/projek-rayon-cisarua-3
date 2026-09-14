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
        {/* Gedung tengah (di belakang teks hero) */}
        <img
          src="/wikrama/Gedung tengah.webp"
          alt="Gedung Tengah"
          className="absolute bottom-0 left-1/2 min-w-[650px] lg:min-w-[1150px] object-contain z-[20] select-none pointer-events-none"
          data-speed="-1"
          data-x="-50%"
          draggable={false}
        />
        {/* Seragam senin (di samping kiri menempel tanah/garis batas session) */}
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
