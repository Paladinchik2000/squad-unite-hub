import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";

export default function SocialLinks() {
  const { t } = useLanguage();

  const links = [
    { label: "Discord", href: "https://discord.gg/VtWJR3YrZy", icon: "💬" },
    { label: "YouTube", href: "#", icon: "▶️" },
    { label: "Twitch", href: "#", icon: "📺" },
    { label: "TikTok", href: "#", icon: "🎵" },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-12">
          {t("social.title")}
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-border rounded-lg px-6 py-3 font-display tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
