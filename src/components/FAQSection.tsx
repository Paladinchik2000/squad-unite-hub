import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
];

export default function FAQSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-24 px-4 bg-card/50">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
          {t("faq.title")}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqKeys.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="font-display text-base tracking-wide text-foreground hover:text-primary hover:no-underline">
                {t(faq.q)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(faq.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
