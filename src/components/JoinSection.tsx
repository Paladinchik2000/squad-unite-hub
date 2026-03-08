import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const steps = [
  { titleKey: "join.step1.title", descKey: "join.step1.desc" },
  { titleKey: "join.step2.title", descKey: "join.step2.desc" },
  { titleKey: "join.step3.title", descKey: "join.step3.desc" },
  { titleKey: "join.step4.title", descKey: "join.step4.desc" },
];

export default function JoinSection() {
  const { t } = useLanguage();

  return (
    <section id="join" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
            {t("join.title")}
          </h2>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="grid gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="relative flex gap-6 items-start pl-2">
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={0.4}>
          <div className="text-center mt-14">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(30 100% 50% / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              href="https://discord.gg/VtWJR3YrZy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-base tracking-wider px-8 py-3 rounded"
            >
              {t("join.cta")}
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
