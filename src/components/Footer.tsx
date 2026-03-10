import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <div className="mb-3">
          <Link to="/roster" className="font-display text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors">
            {lang === "ru" ? "Состав клана" : "Clan Roster"}
          </Link>
        </div>
        <p className="mb-1">© {new Date().getFullYear()} ОСО — Отряд Специальных Операций. {t("footer.rights")}.</p>
        <p className="text-xs">{t("footer.game")}</p>
      </div>
    </footer>
  );
}
