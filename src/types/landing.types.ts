/**
 * Landing Page Data Types
 * Matches backend API response from GET /api/v1/landing?locale=en|nb
 * Sections: contact | hero | howItWorks | features | benefits | whyMobilklar | quote | about
 */

export type Locale = 'en' | 'nb';

// ─────────────────────────────────────────────────────────────────────────
// Contact (shown in Footer — phone, email, address only)
// ─────────────────────────────────────────────────────────────────────────
export interface LandingContact {
  phone: string;
  email: string;
  address: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────────────
export interface LandingHero {
  title: string;
  subtitle: string;
  ctaText: string;
}

// ─────────────────────────────────────────────────────────────────────────
// How It Works Section
// ─────────────────────────────────────────────────────────────────────────
export interface LandingStep {
  order: number;
  title: string;
  description: string;
}

export interface LandingHowItWorks {
  sectionTitle: string;
  steps: LandingStep[];
}

// ─────────────────────────────────────────────────────────────────────────
// Features Section (8 Learning Module Cards)
// ─────────────────────────────────────────────────────────────────────────
export interface LandingFeatureItem {
  moduleNo: number;
  title: string;
  description: string;
  icon: string;
  time: string;
}

export interface LandingFeaturesSection {
  sectionTitle: string;
  description: string;
  items: LandingFeatureItem[];
}

// ─────────────────────────────────────────────────────────────────────────
// Benefits Section (Get Your Child Mobile Ready — checklist)
// ─────────────────────────────────────────────────────────────────────────
export interface LandingBenefitItem {
  text: string;
}

export interface LandingBenefits {
  sectionTitle: string;
  items: LandingBenefitItem[];
}

// ─────────────────────────────────────────────────────────────────────────
// Why Mobilklar Section (4 Pillars)
// ─────────────────────────────────────────────────────────────────────────
export interface LandingPillar {
  title: string;
  description: string;
  icon: string;
}

export interface LandingWhyMobilklar {
  sectionTitle: string;
  subtitle: string;
  pillars: LandingPillar[];
}

// ─────────────────────────────────────────────────────────────────────────
// Quote Section (Parent Reviews)
// ─────────────────────────────────────────────────────────────────────────
export interface LandingQuote {
  title: string;
  text: string;
  author: string;
}

// ─────────────────────────────────────────────────────────────────────────
// About Us Section
// ─────────────────────────────────────────────────────────────────────────
export interface LandingAboutParagraph {
  order: number;
  text: string;
}

export interface LandingAboutSection {
  title: string;
  paragraphs: LandingAboutParagraph[];
}

// ─────────────────────────────────────────────────────────────────────────
// Full Landing Page Data (all sections, flattened to single locale by API)
// ─────────────────────────────────────────────────────────────────────────
export interface LandingPageData {
  contact: LandingContact | null;
  hero: LandingHero | null;
  howItWorks: LandingHowItWorks | null;
  features: LandingFeaturesSection | null;
  benefits: LandingBenefits | null;
  whyMobilklar: LandingWhyMobilklar | null;
  quote: LandingQuote | null;
  about: LandingAboutSection | null;
}

// ─────────────────────────────────────────────────────────────────────────
// API Response Format
// ─────────────────────────────────────────────────────────────────────────
export interface LandingApiResponse {
  success: boolean;
  message: string;
  data: LandingPageData;
}
