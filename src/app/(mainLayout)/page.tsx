
import AboutUs from "@/components/Pages/Home/AboutUs";
import GetChildMobileReady from "@/components/Pages/Home/GetChildMobileReady";
import HeroBannerSection from "@/components/Pages/Home/HeroBannerSection";
import LearningModules from "@/components/Pages/Home/LearningModules";
import MobilklarWorks from "@/components/Pages/Home/MobilklarWorks";
import ParentReviews from "@/components/Pages/Home/ParentReviews";
import WhyMobilklar from "@/components/Pages/Home/WhyMobilklar";
import { fetchLandingPageData } from "@/utils/fetch-landing-data";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

const HomePage = async () => {
  // Fetch landing page data from API
  // Locale defaults to 'en'; can be extended with URL params in the future
  const landingData = await fetchLandingPageData('en');
  console.log(landingData);
  return (
    <section>
      <HeroBannerSection heroData={landingData.hero ?? undefined} />
      <MobilklarWorks howItWorksData={landingData.howItWorks ?? undefined} />
      <LearningModules featuresData={landingData.features ?? undefined} />
      <GetChildMobileReady benefitsData={landingData.benefits ?? undefined} />
      <WhyMobilklar whyMobilklarData={landingData.whyMobilklar ?? undefined} quoteData={landingData.quote ?? undefined} />
      <ParentReviews quote={landingData.quote ?? undefined} />
      <AboutUs aboutData={landingData.about ?? undefined} />
    </section>
  );
};

export default HomePage;
