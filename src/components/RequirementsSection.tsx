import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle } from "lucide-react";

const reqKeys = [
  "req.age", "req.behavior", "req.mic", "req.knowledge",
  "req.activity", "req.rules",
];

export default function RequirementsSection() {
  const { t } = useLanguage();

  return (
    <section id="requirements" className="py-24 px-4 bg-card/50">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
          {t("requirements.title")}
        </h2>
        <ul className="grid gap-4">
          {reqKeys.map((key) => (
            <li
              key={key}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors"
            >
              <CheckCircle className="text-primary shrink-0" size={22} />
              <span className="text-foreground/90">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
