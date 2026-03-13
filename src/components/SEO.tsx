import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
}

const BASE_URL = "https://oco-squad.lovable.app";
const DEFAULT_TITLE = "ОСО — Отряд Специальных Операций | Squad Clan";
const DEFAULT_DESC = "ОСО — тактический клан в Squad. Дисциплина, координация, победа. Присоединяйся к Отряду Специальных Операций.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", `${BASE_URL}${path}`);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "ОСО — Отряд Специальных Операций");
    setMeta("property", "og:locale", "ru_RU");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE_URL}${path}`;

    // JSON-LD
    const jsonLdId = "seo-jsonld";
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ОСО — Отряд Специальных Операций",
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.ico`,
      description: DEFAULT_DESC,
      sameAs: ["https://discord.gg/VtWJR3YrZy"],
    });

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, path, image, type]);

  return null;
}
