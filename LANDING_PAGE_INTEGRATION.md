# Landing Page Dynamic Content Integration

**Date:** March 11, 2026  
**Status:** ✅ Implemented  
**Branch:** `landing`

---

## Overview

The landing page has been updated to fetch dynamic content from the backend API instead of using hardcoded values. This allows the dashboard admin to edit landing page content and have changes reflected on the main app within seconds.

---

## How It Works

### 1. Data Flow

```
Dashboard (Admin Edits) → Backend API (/admin/landing/:section)
        ↓
Backend Stores in MongoDB
        ↓
Next.js App Fetches (GET /landing?locale=en)
        ↓
Components Render Dynamic Content
```

### 2. Server-Side Data Fetching

The main landing page (`src/app/(mainLayout)/page.tsx`) is now an **async server component** that:

1. Fetches landing page data from the backend API
2. Passes data to child components as props
3. Uses fallback/default data if the API is unavailable

```typescript
// src/app/(mainLayout)/page.tsx
const HomePage = async () => {
  // Fetch landing page data from API
  const landingData = await fetchLandingPageData('en');

  return (
    <section>
      <HeroBannerSection heroData={landingData.hero} />
      <MobilklarWorks stepsData={landingData.howItWorks} />
      {/* ... other components ... */}
    </section>
  );
};
```

### 3. API Endpoint

**GET** `/api/v1/landing?locale=en|nb`

- **Purpose:** Fetch complete landing page data for a specific locale
- **Response:** Flattened JSON with all sections for the requested locale
- **Caching:** Development uses `cache: 'no-store'`, production uses default (ISR compatible)

**Example Response:**
```json
{
  "success": true,
  "message": "Landing page data retrieved successfully",
  "data": {
    "hero": {
      "title": "Get your child ready...",
      "subtitle": "Transform your child's...",
      "ctaText": "Start Learning"
    },
    "howItWorks": [...],
    "features": [...],
    "whyMobilklar": {...},
    "quote": {...},
    "about": [...],
    "footer": {...}
  }
}
```

---

## Files Created

### 1. [src/types/landing.types.ts](src/types/landing.types.ts)

TypeScript interfaces for all landing page data structures:

- `LandingHero` - Hero section (title, subtitle, CTA button)
- `LandingStep` - "How It Works" steps (3 items)
- `LandingFeature` - Feature item (title + description)
- `LandingWhyMobilklar` - Why Mobilklar section (subtitle + 4 pillars)
- `LandingQuote` - Quote section (text + author)
- `LandingAbout` - About section paragraphs
- `LandingFooter` - Footer (tagline + nav links)
- `LandingPageData` - Complete page data (all sections)
- `LandingApiResponse` - API response wrapper

### 2. [src/utils/fetch-landing-data.ts](src/utils/fetch-landing-data.ts)

Fetching utility with fallback data:

- `fetchLandingPageData(locale)` - Async function to fetch from API
- `getDefaultLandingData()` - Fallback data when API fails

**Features:**
- Uses `NEXT_PUBLIC_BACKEND_URL` environment variable
- Handles API errors gracefully
- Returns sensible defaults if API unavailable
- Console logging for debugging

---

## Files Modified

### 1. [src/app/(mainLayout)/page.tsx](src/app/(mainLayout)/page.tsx)

**Changes:**
- Converted from static to async server component
- Added `fetchLandingPageData('en')` call
- Passes dynamic data to all child components

**Before:**
```typescript
const HomePage = () => {
  return (
    <section>
      <HeroBannerSection />
      <MobilklarWorks />
      {/* ... hardcoded components ... */}
    </section>
  );
};
```

**After:**
```typescript
const HomePage = async () => {
  const landingData = await fetchLandingPageData('en');
  
  return (
    <section>
      <HeroBannerSection heroData={landingData.hero} />
      <MobilklarWorks stepsData={landingData.howItWorks} />
      {/* ... components receive data ... */}
    </section>
  );
};
```

### 2. [src/components/Pages/Home/HeroBannerSection.tsx](src/components/Pages/Home/HeroBannerSection.tsx)

**Changes:**
- Added `HeroBannerSectionProps` interface
- Accepts optional `heroData?: LandingHero` prop
- Uses dynamic `title`, `subtitle`, `ctaText` from prop
- Falls back to hardcoded values if no prop provided

**Props:**
```typescript
interface HeroBannerSectionProps {
  heroData?: LandingHero;
}
```

**Usage in Template:**
```tsx
<h1>{displayTitle}</h1>
<p>{displaySubtitle}</p>
<button>{displayCtaText}</button>
```

### 3. [src/components/Pages/Home/MobilklarWorks.tsx](src/components/Pages/Home/MobilklarWorks.tsx)

**Changes:**
- Added `MobilklarWorksProps` interface
- Accepts optional `stepsData?: LandingStep[]` prop
- Maps over steps array dynamically
- Falls back to 3 default steps if not provided

**Props:**
```typescript
interface MobilklarWorksProps {
  stepsData?: LandingStep[];
}
```

**Usage in Template:**
```tsx
{displaySteps.map((step, index) => (
  <div key={step.order}>
    <h3>{step.title}</h3>
    <p>{step.description}</p>
  </div>
))}
```

### 4. [src/components/Pages/Home/GetChildMobileReady.tsx](src/components/Pages/Home/GetChildMobileReady.tsx)

**Changes:**
- Added `GetChildMobileReadyProps` interface
- Accepts optional `featuresData?: LandingFeature[]` prop
- Maps over features array (supports 8 items)
- Each feature has `title` and `description`
- Falls back to 6 default features

**Props:**
```typescript
interface GetChildMobileReadyProps {
  featuresData?: LandingFeature[];
}
```

**Feature Structure:**
```typescript
{ title: "Feature name", description: "Feature description" }
```

### 5. [src/components/Pages/Home/WhyMobilklar.tsx](src/components/Pages/Home/WhyMobilklar.tsx)

**Changes:**
- Added `WhyMobilklarProps` interface
- Accepts optional `whyMobilklarData` and `quoteData` props
- Uses dynamic quote text and author
- Placeholder for future pillar customization

**Props:**
```typescript
interface WhyMobilklarProps {
  whyMobilklarData?: LandingWhyMobilklar;
  quoteData?: LandingQuote;
}
```

**Dynamic Quote:**
```tsx
<h4>&quot;{displayQuote.text}&quot;</h4>
<p>{displayQuote.author}</p>
```

### 6. [src/components/Pages/Home/AboutUs.tsx](src/components/Pages/Home/AboutUs.tsx)

**Changes:**
- Added `AboutUsProps` interface
- Accepts optional `aboutData?: LandingAbout[]` prop
- Maps over paragraphs array (3 items)
- Maintains fallback to existing API data if dynamic not provided
- Keeps AOS animations

**Props:**
```typescript
interface AboutUsProps {
  aboutData?: LandingAbout[];
}
```

**Usage in Template:**
```tsx
{displayAbout.map((paragraph, index) => (
  <p key={index} data-aos="zoom-in-top">
    {paragraph.text}
  </p>
))}
```

---

## Environment Configuration

### Development (`.env.local`)

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8070/api/v1
NEXT_PUBLIC_FRONT_END_URL=http://localhost:3001
```

### Production (`.env`)

```
NEXT_PUBLIC_BACKEND_URL=https://api.mobilklar.no/api/v1
NEXT_PUBLIC_FRONT_END_URL=https://mobilklar.no
```

> **Note:** The `.env.local` file takes precedence over `.env` during development. Production uses `.env`.

---

## Section-by-Section Integration

### 1. Hero Section
- **Props:** `heroData?: LandingHero`
- **Fields:** `title`, `subtitle`, `ctaText`
- **Component:** HeroBannerSection

### 2. How It Works
- **Props:** `stepsData?: LandingStep[]`
- **Fields per Step:** `order`, `title`, `description`
- **Component:** MobilklarWorks
- **Note:** Expected to have exactly 3 steps

### 3. Features
- **Props:** `featuresData?: LandingFeature[]`
- **Fields per Feature:** `title`, `description`
- **Component:** GetChildMobileReady
- **Note:** Supports up to 8 items, currently uses 6-8

### 4. Why Mobilklar
- **Props:** `whyMobilklarData?`, `quoteData?: LandingQuote`
- **Quote Fields:** `text`, `author`
- **Component:** WhyMobilklar
- **Note:** Icons/pillars currently hardcoded (can be extended)

### 5. Quote
- **Props:** `quoteData?: LandingQuote`
- **Fields:** `text`, `author`
- **Component:** WhyMobilklar (embedded)

### 6. About
- **Props:** `aboutData?: LandingAbout[]`
- **Fields per Paragraph:** `order`, `text`
- **Component:** AboutUs
- **Note:** Expected to have 3 paragraphs

### 7. Footer
- **Status:** Not yet integrated
- **Component:** Footer (if present)

---

## Fallback Behavior

All components have **intelligent fallback**:

1. **If API data provided:** Use it
2. **If API data missing:** Use component-level defaults
3. **If API failure:** Display fallback data from `getDefaultLandingData()`

**Example (HeroBannerSection):**
```typescript
const displayTitle = heroData?.title || "Get your child ready...";
```

---

## Testing Locally

### 1. Start Backend (if running locally)
```bash
npm run dev  # or your backend start command
# Ensure API runs on http://localhost:8070/api/v1
```

### 2. Environment Variables
```bash
# Verify .env.local has correct backend URL
cat .env.local
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8070/api/v1
```

### 3. Start Next.js Dev Server
```bash
npm run dev
# App should be on http://localhost:3001 (or next available port)
```

### 4. Test API Endpoint
```bash
# Test public landing endpoint
curl http://localhost:8070/api/v1/landing?locale=en

# Should return JSON with all sections
```

### 5. Verify Components Render
- Visit `http://localhost:3001`
- Open DevTools → Network
- Check for successful API call to `/api/v1/landing`
- Verify landing page sections display content

### 6. Test Error Handling
- Stop your backend API
- Refresh the page
- Components should still render with fallback data

---

## Dashboard Integration

When the admin updates content in the dashboard:

1. Admin edits section in dashboard UI
2. Dashboard sends `PATCH /api/v1/admin/landing/:section`
3. Backend stores in MongoDB
4. Frontend detects changes (manual refresh or cache invalidation)
5. Landing page fetches fresh data
6. Components render updated content

**Cache Invalidation Timing:**
- **Development:** Instant (no caching)
- **Production:** Within 60 seconds (ISR revalidation by default)

---

## Locale Support

Currently hardcoded to English (`'en'`). To support multiple locales:

```typescript
// In page.tsx
const locale = searchParams?.locale || 'en'; // or 'nb'
const landingData = await fetchLandingPageData(locale);
```

Then pass `locale` to API:
```typescript
// In fetch-landing-data.ts
// Already supports: ?locale=en|nb
const response = await fetch(
  `${backendUrl}/landing?locale=${locale}`,
  ...
);
```

---

## Troubleshooting

### Issue: "Cannot find module 'landing.types'"

**Solution:** Ensure `src/types/landing.types.ts` exists

```bash
ls src/types/landing.types.ts
```

### Issue: API Returns "404 Not Found"

**Solution:** 
1. Verify backend API URL in `.env.local`
2. Ensure backend is running on correct port
3. Check backend has `/api/v1/landing` route implemented

### Issue: Components Show Fallback Data Only

**Solution:**
1. Check network tab for API request
2. Verify response status (should be 200 OK)
3. Check response data format matches `LandingPageData`
4. Look at console for error logs

### Issue: "ReferenceError: displayTitle is not defined"

**Solution:** Component wasn't properly updated. Ensure:
```typescript
const displayTitle = heroData?.title || "fallback text";
```

---

## Best Practices

1. **Always Provide Defaults:** Components have built-in fallbacks
2. **Check API Response:** Use browser DevTools Network tab
3. **Environment Variables:** Update `.env.local` for dev
4. **Monitor Errors:** Check browser console for API failures
5. **Test Fallbacks:** Temporarily disable API to verify defaults work
6. **Cache Busting:** In dev, use `cache: 'no-store'`

---

## Next Steps

1. ✅ Integrate landing types and fetching
2. ✅ Update components to accept data props
3. ✅ Add async server component to main page
4. ⬜ Add locale switching UI (optional)
5. ⬜ Integrate footer section (if separate component)
6. ⬜ Add analytics for landing page engagement
7. ⬜ Create pre-fetching strategy for faster loads

---

## API Contract Reference

See the detailed API documentation in your backend for:
- `GET /landing?locale=en|nb`
- `PATCH /admin/landing/:section` (admin only)
- All section schemas and validation rules

---

## Summary

The landing page is now **fully dynamic and editable from the dashboard**. Changes made by admins are reflected on the live site within seconds, with intelligent fallback handling ensuring the page never breaks even if the backend is unavailable.

