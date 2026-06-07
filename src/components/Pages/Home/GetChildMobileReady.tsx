"use client";
import { LandingBenefits, LandingBenefitItem } from "@/types/landing.types";

interface GetChildMobileReadyProps {
  benefitsData?: LandingBenefits;
}

const defaultItems: LandingBenefitItem[] = [
  { text: "Komplett læringsreise med 8 moduler" },
  { text: "Personlig digitalt lappen" },
  { text: "Tilgang for hele familien" },
  { text: "Interaktive aktiviteter og quizer" },
  { text: "Generator for familieavtale" },
  { text: "Engangsbeløp – ingen abonnement" },
];

const GetChildMobileReady: React.FC<GetChildMobileReadyProps> = ({ benefitsData }) => {
  const displayTitle = benefitsData?.sectionTitle || "Gjør barnet ditt mobilklar";
  const displayItems = Array.isArray(benefitsData?.items) && benefitsData.items.length > 0
    ? benefitsData.items
    : defaultItems;

  return (
    <div className="w-full xxl:container mx-auto md:pt-[130px] py-10 px-5">
      <div className="flex items-center gap-1 mb-8 justify-center">
        <h2 className="text-md sm:text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
          {displayTitle}
        </h2>
  
      </div>
      <div className="max-w-[750px] mx-auto">
        <div className="md:ml-3 grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
          {displayItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-orange-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <p className="text-gray-900 text-sm md:text-[16px] lg:text-[18px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetChildMobileReady;