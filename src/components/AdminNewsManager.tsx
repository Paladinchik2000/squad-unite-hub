import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Plus, X, Pencil, Trash2, Eye, EyeOff, Check } from "lucide-react";

interface NewsPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  author_id: string;
}

export default function AdminNewsManager({ lang }: { lang: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("clan_news" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as any[]) ?? []);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("clan_news" as any)
        .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() } as any)
        .eq("id", editingId);
      if (error) {
        toast({ title: lang === "ru" ? "Ошибка" : "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: lang === "ru" ? "Пост обновлён" : "Post updated" });
        setPosts((prev) => prev.map((p) => p.id === editingId ? { ...p, title: title.trim(), content: content.trim() } : p));
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from("clan_news" as any)
        .insert({ title: title.trim(), content: content.trim(), author_id: user.id, published: false } as any)
        .select()
        .single();
      if (error) {
        toast({ title: lang === "ru" ? "Ошибка" : "Error", description: error.message, variant: "destructive" });
      } else if (data) {
        toast({ title: lang === "ru" ? "Пост создан" : "Post created" });
        setPosts((prev) => [data as any, ...prev]);
        resetForm();
      }
    }
    setSaving(false);
  };

  const togglePublish = async (post: NewsPost) => {
    const { error } = await supabase
      .from("clan_news" as any)
      .update({ published: !post.published, updated_at: new Date().toISOString() } as any)
      .eq("id", post.id);
    if (!error) {
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, published: !p.published } : p));
      toast({ title: !post.published ? (lang === "ru" ? "Опубликовано" : "Published") : (lang === "ru" ? "Скрыто" : "Unpublished") });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(lang === "ru" ? "Удалить этот пост?" : "Delete this post?")) return;
    const { error } = await supabase.from("clan_news" as any).delete().eq("id", id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: lang === "ru" ? "Пост удалён" : "Post deleted" });
    }
  };

  const startEdit = (post: NewsPost) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground tracking-wider">
          {lang === "ru" ? "📰 Новости клана" : "📰 Clan News"}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors font-display text-sm tracking-wider"
          >
            <Plus size={16} />
            {lang === "ru" ? "Новый пост" : "New post"}
          </button>
        )}
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="p-4 rounded-lg bg-card border border-border space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-foreground tracking-wider">
              {editingId ? (lang === "ru" ? "Редактирование" : "Editing") : (lang === "ru" ? "Новый пост" : "New post")}
            </h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={lang === "ru" ? "Заголовок *" : "Title *"}
            required
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-sans text-sm"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={lang === "ru" ? "Содержание поста *" : "Post content *"}
            required
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-sans text-sm resize-y"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={resetForm} className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors">
              {lang === "ru" ? "Отмена" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-display text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (lang === "ru" ? "Сохранение..." : "Saving...") : editingId ? (lang === "ru" ? "Сохранить" : "Save") : (lang === "ru" ? "Создать" : "Create")}
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-card animate-pulse border border-border" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {lang === "ru" ? "Новостей пока нет" : "No news yet"}
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-lg bg-card border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-display text-sm font-bold text-foreground truncate">{post.title}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-display tracking-wider ${post.published ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {post.published ? (lang === "ru" ? "ОПУБЛ." : "LIVE") : (lang === "ru" ? "ЧЕРНОВИК" : "DRAFT")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(post.created_at).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className="p-1.5 rounded border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  title={post.published ? (lang === "ru" ? "Скрыть" : "Unpublish") : (lang === "ru" ? "Опубликовать" : "Publish")}
                >
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => startEdit(post)}
                  className="p-1.5 rounded border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 rounded border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
