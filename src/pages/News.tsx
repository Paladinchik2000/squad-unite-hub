import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";

interface NewsPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
  author_nickname: string;
}

const POSTS_PER_PAGE = 6;

export default function News() {
  const { t, lang } = useLanguage();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      const { count } = await supabase
        .from("clan_news")
        .select("id", { count: "exact", head: true })
        .eq("published", true);

      setTotalCount(count ?? 0);

      const from = page * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data } = await supabase
        .from("clan_news")
        .select("id, title, content, created_at, author_id, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (data) {
        const authorIds = [...new Set((data as any[]).map((p: any) => p.author_id))];
        let profileMap = new Map<string, string>();

        if (authorIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, nickname")
            .in("id", authorIds);
          profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));
        }

        setPosts(
          (data as any[]).map((p: any) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            created_at: p.created_at,
            image_url: p.image_url,
            author_nickname: profileMap.get(p.author_id) || (lang === "ru" ? "Офицер" : "Officer"),
          }))
        );
      }
      setLoading(false);
    };
    fetchNews();
  }, [page, lang]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient text-center mb-4">
              {t("news.title")}
            </h1>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              {t("news.subtitle")}
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-card animate-pulse border border-border" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-16 font-display">
              {lang === "ru" ? "Новостей пока нет" : "No news yet"}
            </p>
          ) : (
            <div className="space-y-8">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.08}>
                  <motion.article
                    whileHover={{ scale: 1.005, borderColor: "hsl(30 100% 50% / 0.4)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-xl bg-card border border-border overflow-hidden"
                  >
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-56 sm:h-64 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-6">
                      <h2 className="font-display text-xl font-bold text-foreground mb-3">
                        {post.title}
                      </h2>
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-line mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {post.author_nickname}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.created_at).toLocaleDateString(
                            lang === "ru" ? "ru-RU" : "en-US",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg font-display text-sm transition-colors ${
                    i === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
