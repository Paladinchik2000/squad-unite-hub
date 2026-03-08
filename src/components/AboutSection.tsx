import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Users, Target } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

export default function AboutSection() {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, text: t("about.p1") },
    { icon: Users, text: t("about.p2") },
    { icon: Target, text: t("about.p3") },
  ];

  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
            {t("about.title")}
          </h2>
        </AnimatedSection>
        <div className="grid gap-8">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div className="flex gap-5 items-start p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
                <f.icon className="text-primary shrink-0 mt-1" size={28} />
                <p className="text-foreground/85 leading-relaxed">{f.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
