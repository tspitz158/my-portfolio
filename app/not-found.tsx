"use client";

import Link from "next/link";
import ColorBends from "@/components/ColorBends";
import FuzzyText from "@/components/FuzzyText";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
      {/* Color Bends shader background */}
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={0}
        speed={0.15}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        parallax={0.5}
        noise={0.1}
        transparent={false}
        autoRotate={0}
      />

      {/* Fuzzy 404 text */}
      <div className="relative z-10 flex flex-col items-center">
        <FuzzyText
          fontSize="clamp(4rem, 15vw, 12rem)"
          fontWeight={900}
          color="#ffffff"
          baseIntensity={0.3}
          hoverIntensity={0.8}
          enableHover={true}
          clickEffect={true}
        >
          404
        </FuzzyText>

        <p
          className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase font-light mt-4"
          style={{ textShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
        >
          Page Not Found
        </p>

        <Link
          href="/"
          className="mt-10 px-6 py-3 border border-white/20 rounded-full text-white/70 text-sm tracking-widest uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
