import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";
import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Crosshair, Clock, Trophy } from "lucide-react";

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const controls = animate(0, value, {
            duration,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

const stats = [
  { icon: Users, valueKey: "stats.members.value", labelKey: "stats.members.label", value: 85 },
  { icon: Crosshair, valueKey: "stats.operations.value", labelKey: "stats.operations.label", value: 340 },
  { icon: Clock, valueKey: "stats.hours.value", labelKey: "stats.hours.label", value: 12500 },
  { icon: Trophy, valueKey: "stats.wins.value", labelKey: "stats.wins.label", value: 210 },
];

export default function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 bg-card/50">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
            {t("stats.title")}
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4, borderColor: "hsl(30 100% 50% / 0.4)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-3 p-8 rounded-xl bg-card border border-border text-center"
              >
                <stat.icon className="text-primary" size={32} />
                <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} />
                  {stat.value >= 1000 ? "+" : ""}
                </span>
                <span className="text-sm text-muted-foreground">{t(stat.labelKey)}</span>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
