import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNewsManager from "@/components/AdminNewsManager";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, Swords, UserRound, Search, X, Trash2, Plus, Pencil, Check } from "lucide-react";
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

function AddMemberForm({ lang, onAdded }: { lang: string; onAdded: (member: Tables<"profiles">) => void }) {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState<ClanRole>("recruit");
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return;

    setSaving(true);
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: crypto.randomUUID(),
        nickname: trimmed,
        clan_role: role,
        hours_in_game: parseInt(hours) || 0,
      })
      .select()
      .single();

    if (error) {
      toast({ title: lang === "ru" ? "Ошибка" : "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      toast({ title: lang === "ru" ? "Участник добавлен" : "Member added" });
      onAdded(data);
      setNickname("");
      setRole("recruit");
      setHours("");
      setOpen(false);
    }
    setSaving(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors font-display text-sm tracking-wider"
      >
        <Plus size={16} />
        {lang === "ru" ? "Добавить участника" : "Add member"}
      </button>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="p-4 rounded-lg bg-card border border-border space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground tracking-wider">
          {lang === "ru" ? "Новый участник" : "New member"}
        </h3>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={lang === "ru" ? "Никнейм *" : "Nickname *"}
          required
          maxLength={50}
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-sans text-sm"
        />
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder={lang === "ru" ? "Часы в игре" : "Hours in-game"}
          min={0}
          className="w-full sm:w-32 px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-sans text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const rc = roleConfig[r];
          const isActive = role === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border font-display text-xs tracking-wider transition-all ${
                isActive
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <rc.icon size={12} />
              {rc.label[lang as "ru" | "en"]}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {lang === "ru" ? "Отмена" : "Cancel"}
        </button>
        <button
          type="submit"
          disabled={saving || !nickname.trim()}
          className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-display text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving
            ? (lang === "ru" ? "Сохранение..." : "Saving...")
            : (lang === "ru" ? "Добавить" : "Add")}
        </button>
      </div>
    </motion.form>
  );
}

function MemberInfo({ member, lang, updating, onUpdate }: {
  member: Tables<"profiles">;
  lang: string;
  updating: string | null;
  onUpdate: (updated: Partial<Tables<"profiles">> & { id: string }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(member.nickname);
  const [hours, setHours] = useState(String(member.hours_in_game));
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    setSaving(true);
    const newHours = parseInt(hours) || 0;
    const { error } = await supabase
      .from("profiles")
      .update({ nickname: trimmed, hours_in_game: newHours, updated_at: new Date().toISOString() })
      .eq("id", member.id);
    if (error) {
      toast({ title: lang === "ru" ? "Ошибка" : "Error", description: error.message, variant: "destructive" });
    } else {
      onUpdate({ id: member.id, nickname: trimmed, hours_in_game: newHours });
      toast({ title: lang === "ru" ? "Сохранено" : "Saved" });
      setEditing(false);
    }
    setSaving(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-border shrink-0">
          <AvatarImage src={member.avatar_url || undefined} />
          <AvatarFallback className="bg-muted text-muted-foreground font-display text-sm">
            {nickname?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={50}
            className="px-2 py-1 rounded border border-primary/40 bg-background text-foreground text-sm font-display focus:outline-none focus:border-primary flex-1 min-w-0"
          />
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min={0}
            className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm w-20 focus:outline-none focus:border-primary"
            placeholder="h"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !nickname.trim()}
          className="p-1.5 rounded border border-primary text-primary hover:bg-primary/10 transition-colors shrink-0 disabled:opacity-50"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => { setEditing(false); setNickname(member.nickname); setHours(String(member.hours_in_game)); }}
          className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 group">
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
      <button
        onClick={() => setEditing(true)}
        disabled={updating === member.id}
        className="p-1.5 rounded border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100"
        title={lang === "ru" ? "Редактировать" : "Edit"}
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}

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

  const handleMemberAdded = (member: Tables<"profiles">) => {
    setProfiles((prev) => [...prev, member].sort((a, b) => a.nickname.localeCompare(b.nickname)));
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

          {/* Add member */}
          <AnimatedSection delay={0.05} className="mb-6">
            <AddMemberForm lang={lang} onAdded={handleMemberAdded} />
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
                    <MemberInfo member={member} lang={lang} updating={updating} onUpdate={(updated) => {
                      setProfiles((prev) => prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p));
                    }} />

                    <div className="flex items-center gap-3">
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
                      <button
                        disabled={updating === member.id}
                        onClick={() => handleDelete(member.id, member.nickname)}
                        className="p-1.5 rounded border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors shrink-0"
                        title={lang === "ru" ? "Удалить" : "Remove"}
                      >
                        <Trash2 size={14} />
                      </button>
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
