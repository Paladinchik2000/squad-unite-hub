import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEO from "@/components/SEO";
import { Calendar, User, ArrowLeft, ChevronLeft, ChevronRight, Share2 } from "lucide-react";

interface NavPost {
  id: string;
  title: string;
}

interface NewsPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
  author_nickname: string;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [prevPost, setPrevPost] = useState<NavPost | null>(null);
  const [nextPost, setNextPost] = useState<NavPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("clan_news")
        .select("id, title, content, created_at, author_id, image_url")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", (data as any).author_id)
        .maybeSingle();

      setPost({
        id: data.id,
        title: data.title,
        content: data.content,
        created_at: data.created_at,
        image_url: data.image_url,
        author_nickname: profile?.nickname || (lang === "ru" ? "Офицер" : "Officer"),
      });

      // Fetch prev/next posts (by created_at order)
      const currentDate = data.created_at;

      const [{ data: prev }, { data: next }] = await Promise.all([
        supabase
          .from("clan_news")
          .select("id, title")
          .eq("published", true)
          .lt("created_at", currentDate)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("clan_news")
          .select("id, title")
          .eq("published", true)
          .gt("created_at", currentDate)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);

      setPrevPost(prev ? { id: prev.id, title: prev.title } : null);
      setNextPost(next ? { id: next.id, title: next.title } : null);

      setLoading(false);
    };

    fetchPost();
  }, [id, lang]);

  const formattedDate = post
    ? new Date(post.created_at).toLocaleDateString(
        lang === "ru" ? "ru-RU" : "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : "";

  const handleShareDiscord = () => {
    if (!post) return;
    const url = `${window.location.origin}/news/${post.id}`;
    const text = `${post.title}\n\n${url}`;
    navigator.clipboard.writeText(text).then(() => {
      alert(lang === "ru" ? "Ссылка скопирована! Вставьте в Discord" : "Link copied! Paste into Discord");
    });
  };

  const handleShareTelegram = () => {
    if (!post) return;
    const url = `${window.location.origin}/news/${post.id}`;
    const text = `${post.title} — ОСО`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="min-h-screen bg-background">
      {post && (
        <SEO
          title={`${post.title} — ОСО`}
          description={post.content.slice(0, 155)}
          path={`/news/${post.id}`}
          image={post.image_url || undefined}
        />
      )}
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Back button */}
          <button
            onClick={() => navigate("/news")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-display"
          >
            <ArrowLeft size={16} />
            {lang === "ru" ? "Все новости" : "All news"}
          </button>

          {loading ? (
            <div className="space-y-4">
              <div className="h-64 rounded-xl bg-card animate-pulse border border-border" />
              <div className="h-8 w-2/3 rounded bg-card animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-card animate-pulse" />
              <div className="h-40 rounded bg-card animate-pulse" />
            </div>
          ) : notFound ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground font-display text-lg">
                {lang === "ru" ? "Новость не найдена" : "Post not found"}
              </p>
            </div>
          ) : post ? (
            <AnimatedSection>
              <article>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl border border-border mb-8"
                  />
                )}

                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {post.title}
                </h1>

                <div className="flex items-center gap-5 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {post.author_nickname}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formattedDate}
                  </span>
                </div>

                <div className="text-foreground/90 leading-relaxed whitespace-pre-line text-base">
                  {post.content}
                </div>

                {/* Share buttons */}
                <div className="mt-10 pt-8 border-t border-border">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground font-display flex items-center gap-2">
                      <Share2 size={14} />
                      {lang === "ru" ? "Поделиться:" : "Share:"}
                    </span>
                    <button
                      onClick={handleShareDiscord}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      Discord
                    </button>
                    <button
                      onClick={handleShareTelegram}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      Telegram
                    </button>
                  </div>
                </div>

                {/* Prev / Next navigation */}
                {(prevPost || nextPost) && (
                  <nav className="flex items-stretch gap-4 mt-8 pt-8 border-t border-border">
                    {prevPost ? (
                      <button
                        onClick={() => navigate(`/news/${prevPost.id}`)}
                        className="flex-1 flex items-center gap-3 text-left p-4 rounded-lg border border-border hover:border-primary/40 transition-colors group"
                      >
                        <ChevronLeft size={18} className="text-muted-foreground group-hover:text-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs text-muted-foreground font-display">
                            {lang === "ru" ? "Предыдущая" : "Previous"}
                          </span>
                          <p className="text-sm text-foreground truncate">{prevPost.title}</p>
                        </div>
                      </button>
                    ) : <div className="flex-1" />}
                    {nextPost ? (
                      <button
                        onClick={() => navigate(`/news/${nextPost.id}`)}
                        className="flex-1 flex items-center justify-end gap-3 text-right p-4 rounded-lg border border-border hover:border-primary/40 transition-colors group"
                      >
                        <div className="min-w-0">
                          <span className="text-xs text-muted-foreground font-display">
                            {lang === "ru" ? "Следующая" : "Next"}
                          </span>
                          <p className="text-sm text-foreground truncate">{nextPost.title}</p>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary shrink-0" />
                      </button>
                    ) : <div className="flex-1" />}
                  </nav>
                )}
              </article>
            </AnimatedSection>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
