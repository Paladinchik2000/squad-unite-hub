import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p className="mb-1">© {new Date().getFullYear()} ОСО — Отряд Специальных Операций. {t("footer.rights")}.</p>
        <p className="text-xs">{t("footer.game")}</p>
      </div>
    </footer>
  );
}
