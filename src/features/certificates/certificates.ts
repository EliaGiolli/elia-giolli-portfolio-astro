import type { ImageMetadata } from "astro";

import hubspotContentMarketing from "./assets/hubspot-content-marketing.png";
import hubspotDigitalMarketing from "./assets/hubspot-digital-marketing.png";
import introToNetworking from "./assets/intro-to-networking.png";
import introToCybersecurity from "./assets/intro-to-cybersecurity.png";
import networkSupport from "./assets/network-support-and-security.png";
import semrushSeoCrashCourse from "./assets/semrush-seo-crash-course.png";

export interface Certificate {
	title: string;
	// Short name for the card date column ("HubSpot", "Cisco").
	provider: string;
	issuer: string;
	status: string;
	image: ImageMetadata;
	imageAlt: string;
	copy: string;
	verifyUrl?: string;
}

// Newest and most relevant first: SEO and analytics, then the technical background.
export const certificates: Certificate[] = [
	{
		title: "SEO Crash Course with Brian Dean",
		provider: "Semrush",
		issuer: "Semrush Academy · valida fino a ottobre 2027",
		status: "SEO",
		image: semrushSeoCrashCourse,
		imageAlt: "Certificato Semrush Academy SEO Crash Course with Brian Dean rilasciato a Elia Giolli",
		copy: "Ricerca delle parole chiave, SEO on-page, contenuti pensati per posizionarsi, link building e basi di SEO tecnica, con il metodo di Brian Dean e gli strumenti Semrush.",
		// PDF hosted by Semrush, public and tied to the certificate code.
		verifyUrl: "https://static.semrush.com/academy/certificates/f2dd1b259e/elia-giolli_2.pdf",
	},
	{
		title: "Digital Marketing",
		provider: "HubSpot",
		issuer: "HubSpot Academy · valida fino a ottobre 2028",
		status: "SEO e digital marketing",
		image: hubspotDigitalMarketing,
		imageAlt: "Certificato HubSpot Academy Digital Marketing Certified rilasciato a Elia Giolli",
		copy: "Contenuti SEO friendly, ottimizzazione di un sito, strategia social, video, advertising e misurazione dei risultati con una mentalità inbound.",
	},
	{
		title: "Content Marketing",
		provider: "HubSpot",
		issuer: "HubSpot Academy · valida fino a novembre 2028",
		status: "SEO e digital marketing",
		image: hubspotContentMarketing,
		imageAlt: "Certificato HubSpot Academy Content Marketing Certified rilasciato a Elia Giolli",
		copy: "Pianificazione dei contenuti nel lungo periodo, scrittura, promozione e analisi dei risultati: il lavoro che sta dietro a ogni articolo del blog.",
	},
	{
		title: "Network Support and Security",
		provider: "Cisco",
		issuer: "Cisco Networking Academy",
		status: "Background tecnico",
		image: networkSupport,
		imageAlt: "Certificato Cisco Network Support and Security",
		copy: "Come funziona la rete sotto un sito: DNS, HTTP, sicurezza. Conoscenze utili quando un problema SEO nasce dal server, non dalla pagina.",
	},
	{
		title: "Introduction to Networking",
		provider: "Cisco",
		issuer: "Cisco Networking Academy",
		status: "Background tecnico",
		image: introToNetworking,
		imageAlt: "Certificato Cisco Introduction to Networking",
		copy: "Indirizzamento, protocolli e comunicazione client-server: le basi per capire latenza, caching e tempi di risposta.",
	},
	{
		title: "Introduction to Cybersecurity",
		provider: "Cisco",
		issuer: "Cisco Networking Academy",
		status: "Background tecnico",
		image: introToCybersecurity,
		imageAlt: "Certificato Cisco Introduction to Cybersecurity",
		copy: "Minacce e difese di base: HTTPS, dati personali e comportamento sicuro, temi che toccano anche privacy e tracciamento.",
	},
];
