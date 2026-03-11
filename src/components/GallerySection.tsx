import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { useState } from "react";
import { Play, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const galleryItems: GalleryItem[] = [
  {
    type: "video",
    thumbnail: "https://img.youtube.com/vi/2K1yJKOi0jQ/maxresdefault.jpg",
    videoId: "2K1yJKOi0jQ",
    titleKey: "gallery.video1",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    titleKey: "gallery.screenshot1",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=800&q=80",
    titleKey: "gallery.screenshot2",
  },
  {
    type: "video",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    titleKey: "gallery.video2",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
    titleKey: "gallery.screenshot3",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
    titleKey: "gallery.screenshot4",
  },
];

type GalleryItem =
  | { type: "image"; src: string; titleKey: string }
  | { type: "video"; thumbnail: string; videoId: string; titleKey: string };

export default function GallerySection() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-4">
            {t("gallery.title")}
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative aspect-video rounded-lg overflow-hidden border border-border bg-card cursor-pointer group"
                onClick={() => setSelected(item)}
              >
                <img
                  src={item.type === "video" ? item.thumbnail : item.src}
                  alt={t(item.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.type === "video" ? (
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="text-primary-foreground ml-1" size={24} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                      <ImageIcon className="text-primary-foreground" size={24} />
                    </div>
                  )}
                </div>
                {item.type === "video" && (
                  <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                    VIDEO
                  </div>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-background border-border overflow-hidden">
          <DialogTitle className="sr-only">{selected ? t(selected.titleKey) : ""}</DialogTitle>
          {selected?.type === "video" ? (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selected.videoId}?autoplay=1`}
                title={t(selected.titleKey)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : selected?.type === "image" ? (
            <img
              src={selected.src}
              alt={t(selected.titleKey)}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
