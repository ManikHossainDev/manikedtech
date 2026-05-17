/*
 * Fetch Landing Page Data
 * Retrieves dynamic landing page content from backend API with fallback data
 * API: GET /api/v1/landing?locale=en|nb
 *
 * NOTE: avoid long-lived in-memory caching here so frontend reflects admin
 * changes. In production we use ISR (Next.js `next.revalidate`) to balance
 * freshness and performance. For instant updates on admin edits, trigger
 * Next.js on-demand revalidation from the admin backend.
 */

import { LandingPageData } from '@/types/landing.types';

export async function fetchLandingPageData(locale: string = 'en'): Promise<LandingPageData> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.mobilklar.no/api/v1';

    const url = `${backendUrl}/landing?locale=${locale}`;

    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (process.env.NODE_ENV === 'production') {
      // Use ISR in production (adjust seconds to taste)
      fetchOptions.next = { revalidate: 60 };
    } else {
      // In development always fetch fresh
      fetchOptions.cache = 'no-store';
    }

    const response = await fetch(url, fetchOptions as RequestInit);

    if (!response.ok) {
      console.warn(`Failed to fetch landing data [${response.status}]. Using fallback data.`);
      return getDefaultLandingData();
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    console.warn('Invalid API response format. Using fallback data.');
    return getDefaultLandingData();
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return getDefaultLandingData();
  }
}

/**
 * Default Landing Page Data
 * Used when the API is unavailable or returns an error.
 * All text values match the backend's expected structure after locale flattening.
 */
export function getDefaultLandingData(): LandingPageData {
  return {
    contact: {
      phone: '+4604328390903',
      email: 'demo@gmail.com',
      address: 'Norway',
    },
    hero: {
      title: 'Gjør barnet ditt klart for sin første telefon – trygt, gøy og enkelt',
      subtitle: 'Gjør barnets telefon til et sted der kreativitet møter ansvar. Gi barnet ditt et trygt sted der læring møter utforskning.',
      ctaText: 'Start læring',
    },
    howItWorks: {
      sectionTitle: 'Slik fungerer Mobilklar',
      steps: [
        {
          order: 1,
          title: 'Lær (Moduler)',
          description:
            'Barn går gjennom interaktive moduler med tekster, videoer og historier.',
        },
        {
          order: 2,
          title: 'Bli sertifisert (Digitalt lappen)',
          description:
            'Etter læringen tar barna quizer, mini-spill og får belønning.',
        },
        {
          order: 3,
          title: 'Avtal (Familieavtale)',
          description: 'Foreldre bruker dashbordet for å følge med på fremgangen.',
        },
      ],
    },
    features: {
      sectionTitle: '8 spennende læringsmoduler',
      description:
        'Hver modul inneholder videoer, interaktive aktiviteter og quizer tilpasset barn',
      items: [
        {
          moduleNo: 1,
          title: 'Telefongrunnleggende',
          description: 'Lær hva du gjør når den ikke fungerer, og hvordan du bruker den trygt',
          icon: '📱',
          time: '15min',
        },
        {
          moduleNo: 2,
          title: 'Personvern og passord',
          description: 'Forstå viktigheten av sterke passord og personvern',
          icon: '🔒',
          time: '20min',
        },
        {
          moduleNo: 3,
          title: 'Nettmobbing',
          description: 'Hva er nettmobbing og hva gjør du hvis det skjer?',
          icon: '🛡️',
          time: '25min',
        },
        {
          moduleNo: 4,
          title: 'Sosiale medier',
          description: 'Bruk sosiale medier trygt og ansvarlig',
          icon: '💬',
          time: '20min',
        },
        {
          moduleNo: 5,
          title: 'Nettsikkerhet',
          description: 'Gjenkjenn nettfarer og beskytt deg selv',
          icon: '🌐',
          time: '20min',
        },
        {
          moduleNo: 6,
          title: 'Skjermtid og balanse',
          description: 'Finn en sunn balanse mellom skjermtid og andre aktiviteter',
          icon: '⏱️',
          time: '20min',
        },
        {
          moduleNo: 7,
          title: 'Deling av bilder',
          description: 'Tenk før du deler – lær om trygg bildedeling',
          icon: '📷',
          time: '15min',
        },
        {
          moduleNo: 8,
          title: 'Digitalt skjønn',
          description: 'Ta smarte valg på nett og vær en god digital borger',
          icon: '🧠',
          time: '20min',
        },
      ],
    },
    benefits: {
      sectionTitle: 'Gjør barnet ditt mobilklar',
      items: [
        { text: 'Komplett læringsreise med 8 moduler' },
        { text: 'Personlig digitalt lappen' },
        { text: 'Tilgang for hele familien' },
        { text: 'Interaktive aktiviteter og quizer' },
        { text: 'Generator for familieavtale' },
        { text: 'Engangsbeløp – ingen abonnement' },
      ],
    },
    whyMobilklar: {
      sectionTitle: 'Hvorfor Mobilklar?',
      subtitle: 'En strukturert, ekspertutviklet løsning bygget med pedagoger, barnepsykologer og spesialister på digital sikkerhet.',
      pillars: [
        {
          title: 'Sikkerhet',
          description: 'Ekspertkuratert innhold utformet for barn i alderen 8–13 år.',
          icon: '🔒',
        },
        {
          title: 'Utdanning',
          description: 'Lær kritiske digitale ferdigheter, fra internettssikkerhet til ansvarlig bruk av sosiale medier.',
          icon: '📚',
        },
        {
          title: 'Veiledning',
          description: 'Foreldre og barn lærer sammen og styrker familiebåndene.',
          icon: '🤝',
        },
        {
          title: 'Samarbeid',
          description: 'Anerkjente sertifikater ved fullføringen som gir motivasjon.',
          icon: '🏆',
        },
      ],
    },
    quote: {
      title: 'Foreldreomtaler',
      text: "Et barns digitale reise begynner med bevisstgjøring.",
      author: '— Dr. Emily Parker, barnepsykolog',
    },
    about: {
      title: 'Om oss',
      paragraphs: [
        {
          order: 1,
          text: 'Mobilklar er grunnlagt på troen om at digital kompetanse er en kritisk livsferdighet for barn i det 21. århundre.',
        },
        {
          order: 2,
          text: 'Vi samarbeider med skoler, foreldre og eksperter på barnesikkerhet for å skape en helhetlig læringsopplevelse.',
        },
        {
          order: 3,
          text: 'Vår misjon er å gi barn kunnskap og selvtillit til å navigere den digitale verden trygt.',
        },
      ],
    },
  };
}
