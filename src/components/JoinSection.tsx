import { useLanguage } from "@/contexts/LanguageContext";

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
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
          {t("join.title")}
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="grid gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-6 items-start pl-2">
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
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <a
            href="https://discord.gg/VtWJR3YrZy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-base tracking-wider px-8 py-3 rounded hover:bg-primary/90 transition-colors"
          >
            {t("join.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
