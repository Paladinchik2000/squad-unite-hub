import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import ocoLogo from "@/assets/oco-logo.png";
import heroBg from "@/assets/hero-bg.png";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <img
          src={ocoLogo}
          alt="ОСО — Отряд Специальных Операций"
          className="mx-auto mb-8 h-44 sm:h-60 md:h-72 w-auto drop-shadow-[0_0_40px_hsl(30_100%_50%/0.3)]"
        />
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-gradient mb-4">
          ОСО
        </h1>
        <p className="font-display text-xl sm:text-2xl tracking-widest text-foreground/80 mb-2">
          {t("hero.tagline")}
        </p>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-sm sm:text-base">
          {t("hero.subtitle")}
        </p>
        <a
          href="https://discord.gg/VtWJR3YrZy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-lg tracking-wider px-8 py-4 rounded hover:bg-primary/90 transition-colors shadow-[0_0_30px_hsl(30_100%_50%/0.3)]"
        >
          {t("hero.cta")}
        </a>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
