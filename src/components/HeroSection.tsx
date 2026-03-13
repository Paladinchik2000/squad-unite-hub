import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import ocoLogo from "@/assets/oco-logo.png";
import heroBg from "@/assets/hero-bg.png";
import { useRef, useMemo } from "react";

// Generate deterministic particles
function generateParticles(count: number) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: (i * 37.7 + 13) % 100,
      y: (i * 53.1 + 7) % 100,
      size: 1 + (i % 4),
      duration: 3 + (i % 5) * 1.5,
      delay: (i * 0.3) % 4,
      opacity: 0.15 + (i % 5) * 0.08,
    });
  }
  return particles;
}

export default function HeroSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const particles = useMemo(() => generateParticles(40), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.7, 0.95]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.08, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${heroBg})`, y: bgY, scale: 1.15 }}
      />

      {/* Dynamic overlay */}
      <motion.div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Animated glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary blur-[160px] will-change-transform"
        style={{ scale: glowScale, opacity: glowOpacity }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -30 - p.size * 8, 0],
              x: [0, (p.id % 2 === 0 ? 1 : -1) * (8 + p.size * 3), 0],
              opacity: [0, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 text-center px-4"
        style={{ y: contentY }}
      >
        <motion.img
          src={ocoLogo}
          alt="ОСО — Отряд Специальных Операций"
          className="mx-auto mb-8 h-44 sm:h-60 md:h-72 w-auto drop-shadow-[0_0_40px_hsl(30_100%_50%/0.3)]"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-gradient mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          ОСО
        </motion.h1>
        <motion.p
          className="font-display text-xl sm:text-2xl tracking-widest text-foreground/80 mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t("hero.tagline")}
        </motion.p>
        <motion.p
          className="text-muted-foreground max-w-xl mx-auto mb-10 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsl(30 100% 50% / 0.6)" }}
          whileTap={{ scale: 0.97 }}
          href="https://discord.gg/VtWJR3YrZy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-lg tracking-wider px-8 py-4 rounded shadow-[0_0_30px_hsl(30_100%_50%/0.3)]"
        >
          {t("hero.cta")}
        </motion.a>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
