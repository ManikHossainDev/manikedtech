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

export async function fetchLandingPageData(locale: string = 'en'): Promise<LandingPageData | undefined> {
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
    const result = await response.json();
    console.log('API response for landing page data:', result.data);
    return result.data as LandingPageData;
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return undefined;
  }
}

/**
 * Default Landing Page Data
 * Used when the API is unavailable or returns an error.
 * All text values match the backend's expected structure after locale flattening.
 */

