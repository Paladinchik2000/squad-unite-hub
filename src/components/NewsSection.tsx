import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowRight } from "lucide-react";

interface NewsPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_nickname?: string;
  image_url?: string | null;
}

export default function NewsSection() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("clan_news")
        .select("id, title, content, created_at, author_id, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        const authorIds = [...new Set((data as any[]).map((p: any) => p.author_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, nickname")
          .in("id", authorIds);

        const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));

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
  }, [lang]);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="news" className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-4">
            {t("news.title")}
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            {t("news.subtitle")}
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-card animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <motion.article
                  whileHover={{ scale: 1.01, borderColor: "hsl(30 100% 50% / 0.4)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-xl bg-card border border-border overflow-hidden"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 sm:h-56 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {post.title}
                    </h3>
                    <p className="text-foreground/80 leading-relaxed mb-4 whitespace-pre-line line-clamp-4">
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

        {!loading && posts.length > 0 && (
          <AnimatedSection delay={0.3}>
            <div className="text-center mt-10">
              <button
                onClick={() => navigate("/news")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 text-primary font-display text-sm tracking-wider hover:bg-primary/5 transition-colors"
              >
                {t("news.all")}
                <ArrowRight size={16} />
              </button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
