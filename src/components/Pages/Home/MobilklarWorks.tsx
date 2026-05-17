"use client";
import Image from "next/image";
import Modules from "@/assets/HeroBannerSection/heroWorks.png";
import Certificate from "@/assets/HeroBannerSection/License.png";
import Family from "@/assets/HeroBannerSection/Family.png";
import { LandingHowItWorks, LandingStep } from "@/types/landing.types";

interface MobilklarWorksProps {
  howItWorksData?: LandingHowItWorks;
}

const defaultSteps: LandingStep[] = [
  {
    order: 1,
    title: "Lær (Moduler)",
    description: "Barn går gjennom interaktive moduler med tekster, videoer og historier.",
  },
  {
    order: 2,
    title: "Bli sertifisert (Digitalt lappen)",
    description: "Etter læringen tar barna quizer, mini-spill og får belønning.",
  },
  {
    order: 3,
    title: "Avtal (Familieavtale)",
    description: "Foreldre bruker dashbordet for å følge med på fremgangen.",
  },
];

const MobilklarWorks: React.FC<MobilklarWorksProps> = ({ howItWorksData }) => {
  const displayTitle = howItWorksData?.sectionTitle || 'Slik fungerer Mobilklar';
  const displaySteps = Array.isArray(howItWorksData?.steps) && howItWorksData.steps.length > 0
    ? howItWorksData.steps
    : defaultSteps;

  const images = [Modules, Certificate, Family];

  return (
    <div id="Works" className="w-full xxl:container mx-auto md:pt-[130px] py-5 px-5">
      <div>
        {/* Title */}
        <div className="flex items-center gap-3 mb-8 md:mb-12 justify-center py-5">
          <h2 className="text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
            {displayTitle}
          </h2>
          <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4  mx-auto">
          {displaySteps.map((step, index) => (
            <div key={step.order} className="flex flex-col items-center text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4 md:mb-6 lg:mb-8 font-bold text-gray-800"
                style={{ backgroundColor: "#FFD4B2" }}
              >
                {step.order}
              </div>
              <Image
                src={images[index] || Modules}
                alt={step.title}
                width={400}
                height={400}
                className="mb-4 md:mb-6 lg:mb-8 md:w-[388px] md:h-[270px]"
              />
              <div className="max-w-[300px]">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilklarWorks;
