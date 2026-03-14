"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
} from "framer-motion";
import Image from "next/image";
import ColorBends from "@/components/ColorBends";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LOGO_SPRING = { stiffness: 18, damping: 34, mass: 2.5 };
const TEXT_SPRING = { stiffness: 9, damping: 28, mass: 4 };


export default function Home() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const lastInput = useRef(Date.now());

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (Date.now() - lastInput.current > 3000) {
        const t = performance.now() / 1000;
        rawX.set(Math.sin(t * 0.29) * 0.35);
        rawY.set(Math.sin(t * 0.19 + 1.2) * 0.28);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rawX, rawY]);

  const sLogoX = useSpring(rawX, LOGO_SPRING);
  const sLogoY = useSpring(rawY, LOGO_SPRING);
  const sTextX = useSpring(rawX, TEXT_SPRING);
  const sTextY = useSpring(rawY, TEXT_SPRING);

  // Tilt — polar sine-bell curve; shared mag computed once
  const tiltMag = useTransform([sLogoX, sLogoY], ([x, y]: number[]) =>
    Math.sin(Math.min(Math.hypot(x, y) / Math.SQRT2, 1) * Math.PI) * 12
  );
  const tiltAngle = useTransform([sLogoX, sLogoY], ([x, y]: number[]) =>
    Math.atan2(y, x)
  );
  const tiltY = useTransform([tiltAngle, tiltMag], ([a, m]: number[]) => Math.cos(a) * m);
  const tiltX = useTransform([tiltAngle, tiltMag], ([a, m]: number[]) => -Math.sin(a) * m);

  const logoX = useTransform(sLogoX, (v) => v * 12);
  const logoY = useTransform(sLogoY, (v) => v * 7);
  const textX = useTransform(sTextX, (v) => v * -4);
  const textY = useTransform(sTextY, (v) => v * -2.5);

  useEffect(() => {
    const onOrientation = (e: DeviceOrientationEvent) => {
      lastInput.current = Date.now();
      rawX.set(Math.max(-1, Math.min(1, (e.gamma ?? 0) / 30)));
      rawY.set(Math.max(-1, Math.min(1, ((e.beta ?? 0) - 30) / 30)));
    };

    const listen = () =>
      window.addEventListener("deviceorientation", onOrientation);

    // iOS 13+ requires explicit permission via a user gesture
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof DOE.requestPermission === "function") {
      const onGesture = () => {
        DOE.requestPermission!().then((s) => { if (s === "granted") listen(); });
      };
      window.addEventListener("touchstart", onGesture, { once: true });
      window.addEventListener("click", onGesture, { once: true });
      return () => {
        window.removeEventListener("touchstart", onGesture);
        window.removeEventListener("click", onGesture);
        window.removeEventListener("deviceorientation", onOrientation);
      };
    }

    // Android / Chrome — no permission needed
    listen();
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [rawX, rawY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    lastInput.current = Date.now();
    rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
    rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <main
      className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={0}
        speed={0.15}
        scale={1.1}
        frequency={0.9}
        warpStrength={0.85}
        mouseInfluence={0.8}
        parallax={0.4}
        noise={0.04}
        transparent={false}
      />

      {/* Top-right ambient accent */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "55vw",
          height: "55vh",
          opacity: 0.55,
          maskImage: "radial-gradient(ellipse at 95% 5%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 95% 5%, black 0%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ColorBends
          colors={["#8a5cff", "#00ffd1", "#ff5c7a"]}
          rotation={180}
          speed={0.08}
          scale={1.1}
          frequency={0.9}
          warpStrength={0.85}
          mouseInfluence={0}
          parallax={0}
          noise={0.02}
          transparent={true}
          style={{ position: "absolute" }}
        />
      </div>

      {/* Main logo */}
      <motion.div
        className="relative z-10"
        style={{ perspective: 1200, x: logoX, y: logoY }}
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.6, ease: EASE_EXPO }}
      >
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
          className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72"
        >
          <motion.div
            style={{
              position: "absolute",
              top: -14, right: -14, bottom: -14, left: -14,
              border: "12px solid rgba(255,255,255,1)",
              z: -22,
              pointerEvents: "none",
            }}
          />
          <Image
            src="/logo.svg"
            alt="Spitz & Co."
            fill
            priority
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.15))" }}
          />
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        className="relative z-10 flex flex-col items-center mt-2"
        style={{ x: textX, y: textY }}
      >
        <motion.div
          className="w-px bg-white/20 mt-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 24 }}
          transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
        />
        <motion.p
          className="mt-6 text-white/35 text-[10px] tracking-[0.5em] uppercase font-light"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.15, ease: EASE_EXPO }}
        >
          Coming Soon
        </motion.p>
      </motion.div>
    </main>
  );
}
