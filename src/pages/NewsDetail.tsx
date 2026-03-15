import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEO from "@/components/SEO";
import { Calendar, User, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

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
              </article>
            </AnimatedSection>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
