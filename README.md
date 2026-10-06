# Elia Giolli · Portfolio

Portfolio personale di Elia Giolli, **da front-end developer a Technical SEO & Analytics specialist**.

Il sito racconta il passaggio dallo sviluppo web alla SEO tecnica e alla web analytics attraverso case studies documentati e un blog i cui articoli vengono poi ripresi e riscritti per LinkedIn.

## ✦ Esperienza

- **Hero**: posizionamento "da developer a SEO", competenze, CTA verso case studies, blog e CV.
- **Profilo**: il percorso lingue → codice → supporto IT → SEO.
- **Case studies** (`/case-studies`): collection `caseStudies`, con sfida, approccio, risultato e il racconto completo.
- **Blog** (`/blog`): collection `blog`, con tempo di lettura, JSON-LD `BlogPosting`, feed RSS e link al post LinkedIn.
- **Certificazioni**: dati in `src/features/certificates/certificates.ts`, immagini ottimizzate con Astro Image.
- **CV** (`/cv`), **Contatti** (EmailJS con fallback `mailto:`), **Privacy** (`/privacy`).

## 🔎 SEO e analytics

- `BaseHead.astro`: title, description, canonical (con slash finale), robots, Open Graph, Twitter Card, verifica Search Console.
- `@astrojs/sitemap` → `/sitemap-index.xml`; `src/pages/robots.txt.ts` genera il robots.txt dal `site` in `astro.config.mjs`.
- JSON-LD: `Person` (home), `BlogPosting` (articoli), `BreadcrumbList` (blog, case studies, privacy). Builder in `src/helpers/structuredData.ts`.
- Core Web Vitals: font via `<link>` + `preconnect`, immagini WebP con `widths`/`sizes`, prefetch dei link interni, nessuno script di terze parti prima del consenso.
- Accessibilità: skip link, un solo `h1` per pagina, un unico `<main>`, `aria-current` nel menu, tab delle certificazioni navigabili con le frecce.
- **Google Analytics 4** con Consent Mode v2 "basic": `gtag.js` viene scaricato solo dopo "Accetta" nel banner (Alpine.js). Logica in `src/helpers/analyticsConsent.ts`.

## ✍️ Scrivere un articolo

Crea `src/content/blog/<slug>.md`: lo slug del file diventa l'URL `/blog/<slug>/`.

```md
---
title: "Titolo (50-60 caratteri)"
description: "Meta description, massimo 170 caratteri."
pubDate: 2026-10-06
updatedDate: 2026-10-20        # opzionale
tags: ["Technical SEO", "GA4"] # il primo tag compare come etichetta
linkedinUrl: "https://www.linkedin.com/posts/..."  # opzionale, dopo il repurposing
cover: "./cover.jpg"           # opzionale, richiede coverAlt
coverAlt: "Descrizione dell'immagine"
draft: true                    # visibile solo in `astro dev`
---

Testo in Markdown. Usa titoli `##` e `###` (l'`h1` è il title).
```

Flusso consigliato: articolo completo sul sito → post LinkedIn riscritto (hook, 3-5 punti, link all'articolo nel primo commento) → aggiungi `linkedinUrl` all'articolo.

I case studies (`src/content/case-studies/<slug>.md`) usano invece `challenge`, `approach`, `result` e opzionalmente `githubUrl` e `liveUrl`.

## 🚀 Dopo il primo deploy su Vercel

1. Aggiorna `site` in `astro.config.mjs` con l'URL reale (canonical, sitemap, robots, RSS e OG dipendono da lì).
2. GA4 è già configurato con l'ID `G-P6B0WQEQ3H` (`GA_MEASUREMENT_ID` in `constants.ts`), attivo solo nelle build di produzione. `PUBLIC_GA_MEASUREMENT_ID` serve solo come override.
3. Search Console è verificato con il tag HTML (`GOOGLE_SITE_VERIFICATION` in `constants.ts`; `PUBLIC_GOOGLE_SITE_VERIFICATION` serve solo come override). Invia `/sitemap-index.xml` dalla sezione Sitemap.
4. Misura la baseline con PageSpeed Insights e aggiungi i numeri al case study dell'audit.

## 🧭 Architettura

```text
src/
├── content/
│   ├── blog/                 # Articoli Markdown
│   └── case-studies/         # Case studies Markdown
├── content.config.ts         # Schemi delle collection blog e caseStudies
├── core/layouts/             # MainLayout e CvLayout (entrambi usano BaseHead)
├── features/                 # blog, case-studies, certificates, contact, cv, home
├── helpers/                  # Logica pura: SEO, JSON-LD, tempo di lettura, consenso analytics
├── pages/                    # /, /blog, /case-studies, /cv, /privacy, rss.xml, robots.txt
├── shared/                   # BaseHead, Navbar, Footer, Breadcrumbs, PageHeader, UI, Alpine bootstrap
└── styles/global.css         # Tailwind + stile .prose-document per i contenuti lunghi
```

## 🛠️ Stack

- [Astro](https://astro.build/) · rendering statico e routing
- [Tailwind CSS](https://tailwindcss.com/) · sistema visuale e responsive layout
- [Alpine.js](https://alpinejs.dev/) · carousel, menu mobile e stato locale
- `Card.astro`, `Button.astro`, `Input.astro` e `Form.astro` · primitive UI condivise
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) · contenuti progetto tipizzati
- `@astrojs/sitemap` e `@astrojs/rss` · sitemap e feed
- [Astro Image](https://docs.astro.build/en/guides/images/) + `sharp` · ottimizzazione immagini
- [EmailJS](https://www.emailjs.com/) · invio del form di contatto
- TypeScript · helper e contratti dei componenti
- [Vitest](https://vitest.dev/) + jsdom · test unitari e di integrazione
- [Playwright](https://playwright.dev/) · test end-to-end

## 🚀 Avvio locale

Requisiti: Node.js `>=22.12.0`.

```sh
npm install
npm run dev
```

Per avviare il server nella modalità background prevista dal progetto:

```sh
npx astro dev --background
```

Il sito è disponibile su `http://localhost:4321`.

Comandi utili:

| Comando | Scopo |
| --- | --- |
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Genera il sito statico di produzione |
| `npm run preview` | Serve la build locale |
| `npm run astro` | Esegue comandi Astro |
| `npx astro dev stop` | Arresta il server background |
| `npx astro dev status` | Controlla lo stato del server |
| `npx astro dev logs` | Legge i log del server background |

## ✉️ Configurazione EmailJS

Il form usa EmailJS quando sono presenti queste variabili pubbliche. In assenza della configurazione, mantiene un fallback `mailto:` per non interrompere il contatto.

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
PUBLIC_GA_MEASUREMENT_ID=          # opzionale: sovrascrive l'ID GA4 nel codice
PUBLIC_GOOGLE_SITE_VERIFICATION=   # opzionale: sovrascrive il token nel codice
```

Il template EmailJS deve prevedere almeno i campi `from_name`, `reply_to`, `subject` e `message`.

## 🧪 Test

| Comando | Cosa verifica |
| --- | --- |
| `npm run test:unit` | Helpers e utility (Vitest), file `*.test.ts` accanto al codice che testano |
| `npm run test:integration` | Fa una build di produzione e analizza l'HTML generato con jsdom: SEO, dati strutturati, accessibilità, link, contenuti |
| `npm run test:e2e` | Build + Playwright su Chromium contro la build servita in locale |
| `npm test` | Tutte e tre le suite in sequenza |

Prima volta: `npx playwright install chromium`.

```text
src/**/*.test.ts            # unit: seo, structuredData, readingTime, publishedEntries,
                            #       navigation, formatDate, analyticsConsent, cn…
tests/
├── integration/
│   ├── setup/buildSite.ts  # una sola `astro build` per tutta la suite
│   ├── utils/dist.ts       # lettura e parsing delle pagine in dist/
│   ├── seo.test.ts         # route, robots, sitemap, RSS, title/description/canonical/OG
│   ├── structuredData.test.ts
│   ├── accessibility.test.ts
│   ├── links.test.ts       # nessun link interno o ancora rotta
│   └── content.test.ts     # home, blog, case study, CV, GDPR
└── e2e/
    ├── fixtures.ts         # blocca ogni richiesta a Google: i test non toccano GA4
    ├── server.mjs          # serve dist/ in primo piano per Playwright
    ├── navigation.spec.ts  # navbar, menu mobile, skip link, 404
    ├── consent.spec.ts     # banner cookie e caricamento di GA4 solo dopo il consenso
    └── content.spec.ts     # blog, case study, tab certificazioni, form contatti
```

## 🔗 Riferimenti

- [Profilo GitHub di Elia Giolli](https://github.com/EliaGiolli)
- [Documentazione Astro](https://docs.astro.build/)
- [Documentazione Alpine.js](https://alpinejs.dev/start-here)
