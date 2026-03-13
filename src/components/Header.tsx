import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useNavigate } from "react-router-dom";
import ocoLogo from "@/assets/oco-logo.png";
import { Menu, X, User, ShieldAlert } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const navKeys = ["nav.about", "nav.requirements", "nav.join", "nav.faq", "nav.roster", "nav.news"] as const;
const anchors = ["about", "requirements", "join", "faq", "/roster", "/news"];

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const dy = y - lastY.current;
    lastY.current = y;
    setHidden(dy > 5 && y > 80 && !menuOpen);
    setScrolled(y > 20);
  });

  const scrollTo = (id: string) => {
    if (id.startsWith("/")) {
      navigate(id);
      setMenuOpen(false);
      return;
    }
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md"
      initial={{ y: 0 }}
      animate={{
        y: hidden ? "-100%" : "0%",
        backgroundColor: scrolled ? "hsl(var(--background) / 0.95)" : "hsl(var(--background) / 0.7)",
        borderColor: scrolled ? "hsl(var(--border))" : "transparent",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={ocoLogo} alt="ОСО Logo" className="h-10 w-auto" />
          <span className="font-display text-lg font-bold tracking-wider text-primary hidden sm:inline">
            ОСО
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => scrollTo(anchors[i])}
              className="font-display text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              {t(key)}
            </button>
          ))}
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            className="ml-4 border border-border rounded px-3 py-1 text-xs font-display tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <button
            onClick={() => navigate(user ? "/cabinet" : "/auth")}
            className="border border-primary rounded px-3 py-1 text-xs font-display tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
          >
            <User size={14} />
            {user ? "Кабинет" : "Войти"}
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="border border-destructive/60 rounded px-3 py-1 text-xs font-display tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-1"
            >
              <ShieldAlert size={14} />
              Admin
            </button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            className="border border-border rounded px-2 py-1 text-xs font-display text-foreground"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-foreground">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-4">
          {navKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => scrollTo(anchors[i])}
              className="block w-full text-left py-3 font-display text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              {t(key)}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate(user ? "/cabinet" : "/auth"); }}
            className="block w-full text-left py-3 font-display text-sm tracking-wider text-primary"
          >
            {user ? "Личный кабинет" : "Войти"}
          </button>
          {isAdmin && (
            <button
              onClick={() => { setMenuOpen(false); navigate("/admin"); }}
              className="block w-full text-left py-3 font-display text-sm tracking-wider text-destructive"
            >
              Admin Panel
            </button>
          )}
        </nav>
      )}
    </motion.header>
  );
}
