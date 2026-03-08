import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Clock, FileText, LogOut, Upload } from "lucide-react";
import ocoLogo from "@/assets/oco-logo.png";

interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  clan_role: string;
  hours_in_game: number;
  bio: string;
  joined_at: string;
}

const roleLabels: Record<string, string> = {
  recruit: "Рекрут",
  fighter: "Боец",
  officer: "Офицер",
  commander: "Командир",
};

const roleBadgeColors: Record<string, string> = {
  recruit: "bg-muted text-muted-foreground",
  fighter: "bg-secondary text-secondary-foreground",
  officer: "bg-accent text-accent-foreground",
  commander: "bg-primary text-primary-foreground",
};

export default function Cabinet() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [hoursInGame, setHoursInGame] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data as Profile);
      setNickname(data.nickname);
      setBio(data.bio || "");
      setHoursInGame(data.hours_in_game);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: nickname.trim(),
        bio: bio.trim(),
        hours_in_game: hoursInGame,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Сохранено", description: "Профиль обновлён" });
      setEditing(false);
      fetchProfile();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Ошибка", description: "Файл слишком большой (макс. 2 МБ)", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase.from("profiles").update({ avatar_url: publicUrl, updated_at: new Date().toISOString() }).eq("id", user.id);

    toast({ title: "Аватар обновлён" });
    setUploading(false);
    fetchProfile();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-display animate-pulse">Загрузка...</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src={ocoLogo} alt="ОСО" className="h-8 w-auto" />
            <span className="font-display text-sm tracking-wider text-primary hidden sm:inline">ОСО</span>
          </button>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="font-display text-muted-foreground gap-2">
            <LogOut size={16} />
            Выйти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-display text-3xl text-gradient mb-8">Личный кабинет</h1>

        {/* Profile card */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground font-display text-xl">
                  {profile.nickname?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Upload size={20} className="text-primary" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">{profile.nickname || "Безымянный"}</h2>
              <span className={`inline-block mt-1 px-3 py-0.5 rounded text-xs font-display tracking-wider ${roleBadgeColors[profile.clan_role] || roleBadgeColors.recruit}`}>
                {roleLabels[profile.clan_role] || profile.clan_role}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <Clock size={18} className="text-primary" />
              <div>
                <div className="text-xs text-muted-foreground font-display">Часов в игре</div>
                <div className="font-display text-lg text-foreground">{profile.hours_in_game}</div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <Shield size={18} className="text-primary" />
              <div>
                <div className="text-xs text-muted-foreground font-display">В клане с</div>
                <div className="font-display text-lg text-foreground">
                  {new Date(profile.joined_at).toLocaleDateString("ru-RU", { month: "short", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>

          {/* Bio / edit */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-display text-muted-foreground mb-1">Никнейм</label>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-background border-border" maxLength={30} />
              </div>
              <div>
                <label className="block text-sm font-display text-muted-foreground mb-1">Часов в игре</label>
                <Input type="number" value={hoursInGame} onChange={(e) => setHoursInGame(Number(e.target.value))} className="bg-background border-border" min={0} />
              </div>
              <div>
                <label className="block text-sm font-display text-muted-foreground mb-1">О себе</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-background border-border" maxLength={500} rows={3} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="font-display">Сохранить</Button>
                <Button variant="ghost" onClick={() => setEditing(false)} className="font-display text-muted-foreground">Отмена</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FileText size={16} className="text-muted-foreground mt-1" />
                <p className="text-sm text-muted-foreground">{profile.bio || "Нет описания"}</p>
              </div>
              <Button variant="outline" onClick={() => setEditing(true)} className="font-display border-border text-foreground gap-2">
                <User size={16} />
                Редактировать профиль
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
