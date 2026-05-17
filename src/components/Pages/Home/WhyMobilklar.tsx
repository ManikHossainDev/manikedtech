"use client"
import WhyMobilklarImg from "@/assets/HeroBannerSection/WhyMobilklar.png"
import Safety from "@/assets/svg/Safety.png"
import Education from "@/assets/svg/Education.png"
import Guidance from "@/assets/svg/Guidance.png"
import Collaboration from "@/assets/svg/Collaboration.png"
import Image from "next/image";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react"
import { LandingWhyMobilklar, LandingQuote, LandingPillar } from "@/types/landing.types";

interface WhyMobilklarProps {
  whyMobilklarData?: LandingWhyMobilklar;
  quoteData?: LandingQuote;
}

const staticPillars = [
  { icon: Safety, label: "Safety" },
  { icon: Education, label: "Education" },
  { icon: Guidance, label: "Guidance" },
  { icon: Collaboration, label: "Collaboration" },
];

const delays = ["0.1s", "0.2s", "0.3s", "0.4s"];

const WhyMobilklar: React.FC<WhyMobilklarProps> = ({ whyMobilklarData, quoteData }) => {
  const displayTitle = whyMobilklarData?.sectionTitle || "Hvorfor Mobilklar?";
  const displaySubtitle =
    whyMobilklarData?.subtitle ||
    "En strukturert, ekspertutviklet løsning bygget med pedagoger, barnepsykologer og spesialister på digital sikkerhet.";
  const dynamicPillars: LandingPillar[] | null =
    Array.isArray(whyMobilklarData?.pillars) && whyMobilklarData.pillars.length > 0
      ? whyMobilklarData.pillars
      : null;
  const displayQuote = quoteData || {
    title: 'Foreldreomtaler',
    text: "Et barns digitale reise begynner med bevisstgjøring.",
    author: "— Dr. Emily Parker, barnepsykolog",
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 100,
      easing: 'ease-in-out',
    });
    return () => { AOS.refresh(); };
  }, []);

  return (
    <section className="w-full xxl:container mx-auto md:pt-[90px] pt-10 px-4 md:px-0 overflow-hidden">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 justify-center">
          <h2 className="text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
            {displayTitle}
          </h2>
          <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
        </div>
        <p
          className="md:text-center text-xs md:text-base lg:text-lg mx-auto animate-fade-in opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          {displaySubtitle}
        </p>
      </div>

      <div className="md:flex justify-between items-center gap-8 lg:gap-12">
        <div className="w-full md:w-[55%] lg:w-[50%]">
          {/* Pillars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 mb-8 md:mb-10">
            {dynamicPillars
              ? dynamicPillars.map((pillar, idx) => (
                  <div
                    key={pillar.title + idx}
                    className="flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:bg-orange-50 hover:scale-105 hover:shadow-lg animate-slide-up opacity-0 cursor-pointer group"
                    style={{ animationDelay: delays[idx] || '0.4s', animationFillMode: 'forwards' }}
                    title={pillar.description}
                  >
                    <span
                      data-aos="zoom-in-up"
                      className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110"
                    >
                      {pillar.icon || '⭐'}
                    </span>
                    <h3
                      data-aos="zoom-in-up"
                      className="text-sm md:text-base lg:text-lg font-semibold text-center text-gray-800 group-hover:text-orange-500 transition-colors duration-300"
                    >
                      {pillar.title}
                    </h3>
                  </div>
                ))
              : staticPillars.map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:bg-orange-50 hover:scale-105 hover:shadow-lg animate-slide-up opacity-0 cursor-pointer group"
                    style={{ animationDelay: delays[idx], animationFillMode: 'forwards' }}
                  >
                    <div className="relative transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                      <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <Image
                        data-aos="zoom-in-up"
                        src={item.icon}
                        alt={item.label}
                        width={40}
                        height={40}
                        className="relative z-10"
                      />
                    </div>
                    <h3
                      data-aos="zoom-in-up"
                      className="text-sm md:text-base lg:text-lg font-semibold text-center text-gray-800 group-hover:text-orange-500 transition-colors duration-300"
                    >
                      {item.label}
                    </h3>
                  </div>
                ))}
          </div>

          {/* Quote Section */}
          <div
            className="text-center md:mt-0 px-4 md:px-2 pb-6 md:pb-8 rounded-2xl animate-fade-in-up opacity-0 relative overflow-hidden"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <div className="relative z-10 lg:mt-10">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-gray-900">
                {displayQuote.title}
              </h3>
              <h4 className="text-base md:text-lg lg:text-lg xl:text-3xl font-semibold lg:font-bold mb-3 text-gray-800 leading-tight">
                &quot;{displayQuote.text}&quot;
              </h4>
              <p className="text-sm md:text-base lg:text-xl font-semibold text-gray-600">
                {displayQuote.author}
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[45%] lg:w-[40%] mt-8 md:mt-0">
          <div className="relative animate-float" style={{ animationDelay: '0.8s' }}>
            <Image
              src={WhyMobilklarImg}
              alt="WhyMobilklar"
              className="mx-auto relative z-10 h-[350px] hover:scale-105 transition-transform duration-500 rounded-2xl"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default WhyMobilklar;
