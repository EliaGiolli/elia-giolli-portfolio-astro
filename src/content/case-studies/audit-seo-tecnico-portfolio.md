---
title: "Audit SEO tecnico del mio portfolio"
description: "Come ho analizzato e corretto il mio sito Astro: metadati, HTML semantico, dati strutturati, sitemap, Core Web Vitals e misurazione con GA4."
pubDate: 2026-10-06
tags: ["Technical SEO", "Core Web Vitals", "Schema.org", "Accessibilità", "GA4", "Astro"]
challenge: "Il portfolio era corretto per un utente umano, ma quasi invisibile per un motore di ricerca: stesso title e stessa description su ogni pagina, nessuna sitemap, nessun canonical, due H1 nella home e nessun dato strutturato."
approach: "Ho trattato il sito come quello di un cliente: inventario delle pagine, controllo di head, gerarchia dei titoli e landmark, poi interventi a livello di layout, così che ogni pagina nuova erediti la SEO senza doverci ripensare."
result: "Ogni pagina ha ora title, description e canonical propri, Open Graph, sitemap, robots.txt, feed RSS e JSON-LD. La misurazione parte con Search Console e GA4 (solo dopo consenso) per confrontare i dati prima e dopo."
metrics:
  - label: "Impressioni"
  - label: "Pagine indicizzate"
  - label: "LCP mobile"
githubUrl: "https://github.com/EliaGiolli/elia-giolli-portfolio-astro"
---

## Perché partire dal mio sito

Il primo cliente di un SEO specialist è il proprio sito. Se il portfolio di chi si occupa di SEO non è ottimizzato, il messaggio è sbagliato prima ancora di leggere una riga. Ho quindi applicato al mio portfolio, costruito con Astro, lo stesso processo che userei su un sito aziendale.

## 1. Inventario e diagnosi

Ho elencato tutte le pagine generate dalla build (home, CV, pagine dei progetti, 404) e per ognuna ho controllato cosa vede un crawler. Questi i problemi emersi:

| Area | Problema trovato | Impatto |
| --- | --- | --- |
| Metadati | Stesso `<title>` ("Portfolio Elia Giolli") e stessa description su tutte le pagine | Snippet duplicati in SERP, pagine in competizione tra loro |
| Indicizzazione | Nessuna sitemap, nessun `robots.txt`, nessun canonical | Scansione più lenta, rischio di URL duplicati (con e senza slash finale) |
| HTML semantico | Un secondo `<h1>` nascosto nella navbar, hero fuori dal `<main>` | Gerarchia dei contenuti ambigua per crawler e screen reader |
| Navigazione | Le voci "Certificati" e "Progetti" puntavano alla sezione sbagliata | Esperienza utente confusa, link interni incoerenti |
| Condivisione | Nessun tag Open Graph o Twitter Card | Anteprime vuote su LinkedIn, il canale principale per i recruiter |
| Dati strutturati | Nessun JSON-LD | Google non sa chi è l'autore né cosa offre il sito |
| Performance | Font caricato con `@import` dentro il CSS | Catena di richieste che ritarda il primo rendering (LCP) |

## 2. Interventi

### Metadati per pagina, centralizzati nel layout

Ho creato un componente `BaseHead` che riceve title, description e tipo di pagina, e genera da solo canonical, Open Graph, Twitter Card e meta robots. Il canonical usa sempre lo slash finale, coerente con la sitemap: un solo URL per ogni contenuto.

### Sitemap, robots.txt e RSS

La sitemap viene generata dall'integrazione `@astrojs/sitemap`, il `robots.txt` è un endpoint che legge il dominio dalla configurazione (un solo punto da aggiornare dopo il deploy) e il blog ha un feed RSS.

### Dati strutturati

- **Person** sulla home: nome, ruolo, competenze (`knowsAbout`) e profili collegati (`sameAs`).
- **BlogPosting** su ogni articolo, con data di pubblicazione e di aggiornamento.
- **BreadcrumbList** su blog e case studies, insieme alle breadcrumb visibili.

### HTML semantico e accessibilità

Un solo `<h1>` per pagina, un unico `<main>` con skip link, `aria-current` sulla voce di menu attiva, contrasto dei colori verificato sui testi piccoli. L'accessibilità e la SEO tecnica condividono gran parte del lavoro: un documento leggibile per uno screen reader è leggibile anche per un crawler.

### Core Web Vitals

- Font caricato con `<link>` e `preconnect` invece di `@import`.
- Immagini ottimizzate in WebP da Astro, con dimensioni esplicite per evitare layout shift (CLS).
- Nessuno script di terze parti prima del consenso: Google Analytics viene scaricato solo se l'utente accetta.
- Prefetch dei link interni per una navigazione più rapida.

## 3. Misurazione

Un'ottimizzazione senza misurazione è solo un'opinione. Il piano:

1. **Google Search Console**: verifica della proprietà, invio della sitemap, monitoraggio di pagine indicizzate, impressioni e CTR.
2. **PageSpeed Insights / Lighthouse**: punteggi di performance, accessibilità e SEO subito dopo il deploy, come baseline.
3. **Google Analytics 4** con Consent Mode v2: pagine più lette e canali di provenienza, in particolare il traffico da LinkedIn verso il blog.

I risultati verranno aggiunti a questo case study dopo le prime settimane di dati.

## Cosa ho imparato

- La SEO tecnica si fa nel layout, non pagina per pagina: un componente ben progettato vale più di cento correzioni manuali.
- Il background da sviluppatore è un vantaggio concreto: so leggere l'HTML generato, non solo il report di uno strumento.
- Accessibilità, performance e SEO non sono tre progetti separati, ma lo stesso lavoro visto da tre angolazioni.
