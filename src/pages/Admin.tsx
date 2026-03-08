import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, Swords, UserRound, Search, X, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import type { Database } from "@/integrations/supabase/types";

type ClanRole = Database["public"]["Enums"]["clan_role"];

const roleConfig: Record<ClanRole, { label: { ru: string; en: string }; icon: typeof Shield; color: string }> = {
  commander: { label: { ru: "Командир", en: "Commander" }, icon: Crown, color: "text-yellow-400" },
  officer: { label: { ru: "Офицер", en: "Officer" }, icon: Shield, color: "text-primary" },
  fighter: { label: { ru: "Боец", en: "Fighter" }, icon: Swords, color: "text-foreground/70" },
  recruit: { label: { ru: "Рекрут", en: "Recruit" }, icon: UserRound, color: "text-muted-foreground" },
};

const roles: ClanRole[] = ["commander", "officer", "fighter", "recruit"];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<Tables<"profiles">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin && user) navigate("/cabinet");
  }, [authLoading, adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (isAdmin) fetchProfiles();
  }, [isAdmin]);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("nickname", { ascending: true });
    setProfiles(data ?? []);
    setLoading(false);
  };

  const handleRoleChange = async (profileId: string, newRole: ClanRole) => {
    setUpdating(profileId);
    const { error } = await supabase
      .from("profiles")
      .update({ clan_role: newRole, updated_at: new Date().toISOString() })
      .eq("id", profileId);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Роль обновлена" });
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, clan_role: newRole } : p))
      );
    }
    setUpdating(null);
  };

  const handleDelete = async (profileId: string, nickname: string) => {
    if (!window.confirm(lang === "ru" ? `Удалить ${nickname} из клана?` : `Remove ${nickname} from clan?`)) return;
    setUpdating(profileId);
    const { error } = await supabase.from("profiles").delete().eq("id", profileId);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: lang === "ru" ? "Участник удалён" : "Member removed" });
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    }
    setUpdating(null);
  };

  const filtered = search.trim()
    ? profiles.filter((p) => p.nickname.toLowerCase().includes(search.toLowerCase()))
    : profiles;

  if (authLoading || adminLoading || (!isAdmin && !adminLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-display animate-pulse">
          {lang === "ru" ? "Загрузка..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient text-center mb-4">
              {lang === "ru" ? "Панель управления" : "Admin Panel"}
            </h1>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              {lang === "ru"
                ? "Управление ролями бойцов клана"
                : "Manage clan member roles"}
            </p>
          </AnimatedSection>

          {/* Search */}
          <AnimatedSection delay={0.1} className="mb-8">
            <div className="relative max-w-md mx-auto">
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
            <p className="text-xs text-muted-foreground text-center mt-2">
              {lang === "ru" ? `Всего: ${filtered.length}` : `Total: ${filtered.length}`}
            </p>
          </AnimatedSection>

          {/* Members list */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-card animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((member) => {
                const cfg = roleConfig[member.clan_role as ClanRole];
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-card border border-border"
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 border border-border shrink-0">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="bg-muted text-muted-foreground font-display text-sm">
                          {member.nickname?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-foreground truncate tracking-wide">
                          {member.nickname || (lang === "ru" ? "Без имени" : "Unnamed")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.hours_in_game}h • {lang === "ru" ? "с" : "since"}{" "}
                          {new Date(member.joined_at).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Role selector */}
                    <div className="flex gap-1.5 flex-wrap">
                      {roles.map((role) => {
                        const rc = roleConfig[role];
                        const isActive = member.clan_role === role;
                        const isUpdating = updating === member.id;
                        return (
                          <button
                            key={role}
                            disabled={isUpdating}
                            onClick={() => !isActive && handleRoleChange(member.id, role)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded border font-display text-xs tracking-wider transition-all ${
                              isActive
                                ? "border-primary bg-primary/15 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            } ${isUpdating ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                          >
                            <rc.icon size={12} />
                            {rc.label[lang as "ru" | "en"]}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}

              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {lang === "ru" ? "Никого не найдено" : "No members found"}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
