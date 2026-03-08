

## OCO Clan Website Plan

### Overview
A bilingual (RU/EN) single-page website for the Squad clan "ОСО / Отряд Специальных Операций" with a military dark theme. The uploaded logo will be embedded on the site.

### Data
- **Clan name**: ОСО / Отряд Специальных Операций
- **Discord**: https://discord.gg/VtWJR3YrZy
- **YouTube / Twitch / TikTok**: placeholders for now
- **Logo**: user-uploads://OCOlong.png (will be copied to src/assets)

### Site Structure (single page, sections)

1. **Header/Nav** — Logo + clan name, language toggle (RU/EN), nav links to sections
2. **Hero** — Full-width dark military banner with logo, clan name, tagline, Discord CTA button
3. **About Us** — Brief description of the clan, history, values
4. **Requirements** — Candidate requirements list (age, hours, mic, etc. — placeholder content)
5. **How to Join** — Step-by-step enrollment process + Discord redirect button
6. **FAQ** — Accordion-style frequently asked questions
7. **Social Links** — YouTube, Twitch, Discord, TikTok icons/buttons
8. **Footer** — Copyright, social icons repeated

### Technical Approach

- **Language toggle**: React context (`LanguageContext`) storing `"ru" | "en"`, all text in a translations object
- **Theme**: Dark background (#0a0a0a / #111), orange/amber accents matching the logo gradient, military stencil-style headings
- **Components**: `LanguageProvider`, `LanguageToggle`, `HeroSection`, `AboutSection`, `RequirementsSection`, `JoinSection`, `FAQSection`, `SocialLinks`, `Footer`
- **Styling**: Tailwind with custom colors added to tailwind.config.ts
- **Animations**: Subtle scroll-based fade-ins using CSS/Tailwind
- **Logo**: Copied to `src/assets/oco-logo.png`, imported in components

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/assets/oco-logo.png` | Copy from upload |
| `src/contexts/LanguageContext.tsx` | Language provider + hook |
| `src/data/translations.ts` | All RU/EN text content |
| `src/components/Header.tsx` | Nav + language toggle |
| `src/components/HeroSection.tsx` | Hero banner |
| `src/components/AboutSection.tsx` | About us |
| `src/components/RequirementsSection.tsx` | Candidate requirements |
| `src/components/JoinSection.tsx` | How to join |
| `src/components/FAQSection.tsx` | FAQ accordion |
| `src/components/SocialLinks.tsx` | Social media links |
| `src/components/Footer.tsx` | Footer |
| `src/pages/Index.tsx` | Compose all sections |
| `tailwind.config.ts` | Add orange/military accent colors |
| `index.html` | Update title to "ОСО — Отряд Специальных Операций" |

