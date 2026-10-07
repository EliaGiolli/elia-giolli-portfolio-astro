export const AUTHOR_NAME = "Elia Giolli"
export const BLOG_NAME = "Elia Giolli"
export const SITE_TAGLINE = "Da front-end developer a Technical SEO & Analytics specialist"
export const JOB_TITLE = "Technical SEO & Analytics specialist"
export const SITE_DESCRIPTION = "Elia Giolli: da front-end developer a Technical SEO & Analytics specialist. Core Web Vitals, HTML semantico, dati strutturati, Google Analytics 4 e Search Console."
export const SITE_LOCALE = "it_IT"

export const OG_IMAGE_PATH = "/og-image.png"
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export const CONTACT_EMAIL = "eliagiolli22@gmail.com"
export const LINKEDIN_URL = "https://www.linkedin.com/in/eliagiolli/"
export const GITHUB_URL = "https://github.com/EliaGiolli"

// Navigation of the inner pages; the homepage uses its index instead.
export const NAV_LINKS = [
	{ label: "Chi sono", href: "/#about" },
	{ label: "Case study", href: "/case-studies/" },
	{ label: "Blog", href: "/blog" },
	{ label: "CV", href: "/cv/" },
] as const

export const CONTACT_LINK = { label: "Contatti", href: "/#contact" } as const

// Homepage sections, in reading order: they feed the index (01–06) and the section anchors.
export const HOME_SECTIONS = [
	{ id: "about", label: "Chi sono" },
	{ id: "case-studies", label: "Case study" },
	{ id: "blog", label: "Blog" },
	{ id: "skills", label: "Competenze" },
	{ id: "certificates", label: "Certificati" },
	{ id: "contact", label: "Contatti" },
] as const

export const HOME_INTRO = "Da front-end developer a SEO: aiuto i siti a farsi trovare e a capire cosa succede quando qualcuno arriva."

// Text links, not logos: the design system has no icon set.
export const SOCIAL_LINKS = [
	{ label: "LinkedIn", href: LINKEDIN_URL },
	{ label: "GitHub", href: GITHUB_URL },
	{ label: "Email", href: `mailto:${CONTACT_EMAIL}` },
	{ label: "RSS", href: "/rss.xml" },
] as const

export const CONSENT_STORAGE_KEY = "analytics-consent"

// GA4 measurement IDs are public by design (they ship in every page): not a secret.
export const GA_MEASUREMENT_ID = "G-P6B0WQEQ3H"

// Search Console "HTML tag" verification token: public too, it is printed in every page head.
export const GOOGLE_SITE_VERIFICATION = "WrPrcSwf5ah2sfaoB0iRvxd8Qt-qN2BNTn0Rx32ibWM"

// Screen-reader hint on links that open in a new tab.
export const NEW_TAB_HINT = "(si apre in una nuova scheda)"
