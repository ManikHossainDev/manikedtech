"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { LandingAboutSection } from "@/types/landing.types";

interface AboutUsProps {
  aboutData?: LandingAboutSection;
}

const defaultAbout: LandingAboutSection = {
  title: "Om oss",
  paragraphs: [
    { order: 1, text: "Mobilklar er grunnlagt på troen om at digital kompetanse er en kritisk livsferdighet for barn i det 21. århundre." },
    { order: 2, text: "Vi samarbeider med skoler, foreldre og eksperter på barnesikkerhet for å skape en helhetlig læringsopplevelse." },
    { order: 3, text: "Vår misjon er å gi barn kunnskap og selvtillit til å navigere den digitale verden trygt." },
  ],
};

/* eslint-disable react/no-unescaped-entities */
const AboutUs: React.FC<AboutUsProps> = ({ aboutData }) => {
  const displayData = aboutData || defaultAbout;
  const displayTitle = displayData.title || "Om oss";
  const displayParagraphs = Array.isArray(displayData.paragraphs) && displayData.paragraphs.length > 0
    ? displayData.paragraphs
    : defaultAbout.paragraphs;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 100,
      easing: "ease-in-out",
    });
    return () => { AOS.refresh(); };
  }, []);

  return (
    <div className="w-full xxl:container mx-auto md:py-[110px] py-10 px-5 lg:mb-20">
      <div id="aboutus">
        <div className="flex items-center gap-3 mb-8 xl:mb-10 justify-center">
          <h2 className="text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
            {displayTitle.split(" ").length > 1 ? (
              <>
                {displayTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="font-bold" style={{ color: "#FF9E1C" }}>
                  {displayTitle.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              <span className="font-bold" style={{ color: "#FF9E1C" }}>{displayTitle}</span>
            )}
          </h2>
          <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
        </div>
        {/* Paragraphs */}
        <div className="md:max-w-5xl mx-auto space-y-3 text-justify md:space-y-6 text-gray-700 leading-relaxed md:text-center">
          {displayParagraphs.map((paragraph, index) => (
            <p
              key={paragraph.order ?? index}
              data-aos="zoom-in-top"
              className="text-base sm:text-lg md:text-center text-justify"
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
