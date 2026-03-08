import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Shield, Swords, Crown, UserRound, Search, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const roleConfig: Record<string, { label: { ru: string; en: string }; icon: typeof Shield; color: string }> = {
  commander: { label: { ru: "Командир", en: "Commander" }, icon: Crown, color: "text-yellow-400" },
  officer: { label: { ru: "Офицер", en: "Officer" }, icon: Shield, color: "text-primary" },
  fighter: { label: { ru: "Боец", en: "Fighter" }, icon: Swords, color: "text-foreground/70" },
  recruit: { label: { ru: "Рекрут", en: "Recruit" }, icon: UserRound, color: "text-muted-foreground" },
};

const roleOrder = ["commander", "officer", "fighter", "recruit"];

function RosterContent() {
  const { lang } = useLanguage();
  const [profiles, setProfiles] = useState<Tables<"profiles">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("clan_role", { ascending: true })
      .then(({ data }) => {
        setProfiles(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = profiles;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.nickname.toLowerCase().includes(q));
    }
    if (activeRole) {
      result = result.filter((p) => p.clan_role === activeRole);
    }
    return result;
  }, [profiles, search, activeRole]);

  const grouped = roleOrder
    .map((role) => ({
      role,
      ...roleConfig[role],
      members: filtered.filter((p) => p.clan_role === role),
    }))
    .filter((g) => g.members.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient text-center mb-4">
              {lang === "ru" ? "Состав клана" : "Clan Roster"}
            </h1>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              {lang === "ru"
                ? "Все бойцы Отряда Специальных Операций"
                : "All members of the Special Operations Unit"}
            </p>
          </AnimatedSection>

          {/* Search & Filter */}
          <AnimatedSection delay={0.1} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === "ru" ? "Поиск по никнейму..." : "Search by nickname..."}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-sans text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Role filter chips */}
              <div className="flex gap-2 flex-wrap">
                {roleOrder.map((role) => {
                  const cfg = roleConfig[role];
                  const isActive = activeRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => setActiveRole(isActive ? null : role)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-display text-xs tracking-wider transition-colors ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <cfg.icon size={14} />
                      {cfg.label[lang as "ru" | "en"]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground mt-3">
              {lang === "ru"
                ? `Найдено: ${filtered.length}`
                : `Found: ${filtered.length}`}
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-card animate-pulse border border-border" />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {search || activeRole
                ? (lang === "ru" ? "Никого не найдено" : "No matches found")
                : (lang === "ru" ? "Пока нет участников" : "No members yet")}
            </p>
          ) : (
            grouped.map((group, gi) => (
              <AnimatedSection key={group.role} delay={gi * 0.1} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <group.icon className={`${group.color}`} size={24} />
                  <h2 className="font-display text-2xl font-semibold text-foreground tracking-wider">
                    {group.label[lang as "ru" | "en"]}
                  </h2>
                  <span className="text-muted-foreground text-sm ml-1">({group.members.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border cursor-default"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.nickname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserRound className="text-muted-foreground" size={24} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-base font-semibold text-foreground truncate tracking-wide">
                          {member.nickname || (lang === "ru" ? "Без имени" : "Unnamed")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.hours_in_game}h in-game
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Roster() {
  return <RosterContent />;
}
