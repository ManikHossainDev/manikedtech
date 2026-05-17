import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import React from "react";
import { fetchLandingPageData } from "@/utils/fetch-landing-data";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const landingData = await fetchLandingPageData('en');
  return (
    <section>
      <div className="">
        <Header />
      </div>
      {children}
      <Footer contactData={landingData.contact} />
    </section>
  );
};

export default MainLayout;
