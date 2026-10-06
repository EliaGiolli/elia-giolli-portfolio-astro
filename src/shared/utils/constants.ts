export const AUTHOR_NAME = "Elia Giolli"
export const BLOG_NAME = "Elia Giolli"
export const SITE_TAGLINE = "Da front-end developer a Technical SEO & Analytics specialist"
export const JOB_TITLE = "Technical SEO & Analytics specialist"
export const SITE_DESCRIPTION = "Elia Giolli: da front-end developer a Technical SEO & Analytics specialist. Core Web Vitals, HTML semantico, dati strutturati, Google Analytics 4 e Search Console."
export const SITE_LOCALE = "it_IT"
export const LOGO_ALT_TEXT = "Il logo del portfolio"

export const OG_IMAGE_PATH = "/og-image.png"
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export const CONTACT_EMAIL = "eliagiolli22@gmail.com"
export const LINKEDIN_URL = "https://www.linkedin.com/in/eliagiolli/"
export const GITHUB_URL = "https://github.com/EliaGiolli"

export const NAV_LINKS = [
	{ label: "Su di me", href: "/#about" },
	{ label: "Certificazioni", href: "/#certificates" },
	{ label: "Case studies", href: "/#case-studies" },
	{ label: "Blog", href: "/blog" },
] as const

export const CONTACT_LINK = { label: "Contatti", href: "/#contact" } as const

export const CONSENT_STORAGE_KEY = "analytics-consent"

// GA4 measurement IDs are public by design (they ship in every page): not a secret.
export const GA_MEASUREMENT_ID = "G-V8J1ESE2BC"
