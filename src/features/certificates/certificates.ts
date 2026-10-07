import type { ImageMetadata } from "astro";

import hubspotDigitalMarketing from "./assets/hubspot-digital-marketing.png";
import introToNetworking from "./assets/intro-to-networking.png";
import introToCybersecurity from "./assets/intro-to-cybersecurity.png";
import networkSupport from "./assets/network-support-and-security.png";

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
		title: "Digital Marketing",
		provider: "HubSpot",
		issuer: "HubSpot Academy · valida fino a ottobre 2028",
		status: "SEO e digital marketing",
		image: hubspotDigitalMarketing,
		imageAlt: "Certificato HubSpot Academy Digital Marketing Certified rilasciato a Elia Giolli",
		copy: "Contenuti SEO friendly, ottimizzazione di un sito, strategia social, video, advertising e misurazione dei risultati con una mentalità inbound.",
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
