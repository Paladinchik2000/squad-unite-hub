import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import gameSquad from "@/assets/game-squad.jpg";
import gameBrokenArrow from "@/assets/game-broken-arrow.jpg";
import gameArmaReforger from "@/assets/game-arma-reforger.jpg";

const games = [
  { titleKey: "games.squad.title", descKey: "games.squad.desc", image: gameSquad },
  { titleKey: "games.ba.title", descKey: "games.ba.desc", image: gameBrokenArrow },
  { titleKey: "games.arma.title", descKey: "games.arma.desc", image: gameArmaReforger },
];

export default function GamesSection() {
  const { t } = useLanguage();

  return (
    <section id="games" className="py-24 px-4 bg-card/50">
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient text-center mb-16">
            {t("games.title")}
          </h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-xl overflow-hidden border border-border bg-card group cursor-default"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={game.image}
                    alt={t(game.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {t(game.titleKey)}
                    </h3>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(game.descKey)}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
