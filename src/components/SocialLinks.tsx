import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function SocialLinks() {
  const { t } = useLanguage();

  const links = [
    { label: "Discord", href: "https://discord.gg/VtWJR3YrZy", icon: "💬" },
    { label: "YouTube", href: "https://www.youtube.com/@losplayoperspecsq", icon: "▶️" },
    { label: "Twitch", href: "https://www.twitch.tv/sweetbubaleh_tv", icon: "📺" },
    { label: "TikTok", href: "https://www.tiktok.com/@squadnaya?_r=1&_t=ZS-93UHCMTqX2b", icon: "🎵" },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-12">
            {t("social.title")}
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            {links.map((link) => (
              <motion.a
                key={link.label}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-border rounded-lg px-6 py-3 font-display tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </motion.a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
