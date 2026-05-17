"use client";
import { useState } from "react";
import car from "@/assets/Modules/Car.png";
import Background from "@/assets/Modules/Background.png";
import RunModules09 from "@/assets/Modules/RunModules09.png";
import Image from "next/image";
import { ArrowUp, LucideLoaderPinwheel } from "lucide-react";

import Link from "next/link";
import LicenseEarned from "@/assets/Modules/LicenseEarned.png";
import { useSearchParams } from "next/navigation";

const Page = () => {
   const searchParams = useSearchParams();
   const childId = searchParams.get("childId");
   console.log(childId)
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAtRight, setIsAtRight] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("normal");
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [showTransitionImage, setShowTransitionImage] = useState(false);
  const [secondRound, setSecondRound] = useState(false);
  

  const handleStart = () => {
    setIsAnimating(true);
    setIsAtRight(true);
    setAnimationDirection("normal");

    // After 5 seconds (animation completes), start the black screen sequence
    setTimeout(() => {
      setIsAnimating(false);
      setShowBlackScreen(true);

      // After 3 seconds of black screen, show transition image
      setTimeout(() => {
        setShowTransitionImage(true);

        // After another 5 seconds, return to main page and auto-start
        setTimeout(() => {
          setShowBlackScreen(false);
          setShowTransitionImage(false);
          setIsAtRight(false);
          setSecondRound(true);

          // Auto start second animation
          setTimeout(() => {
            setIsAnimating(true);
            setIsAtRight(true);
            setAnimationDirection("normal");

            setTimeout(() => {
              setIsAnimating(false);
            }, 5000);
          }, 0);
        }, 4000);
      }, 1000);
    }, 5000);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setIsAtRight(false);
    setAnimationDirection("reverse");
    setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  };

  // Black screen with transition image overlay
  if (showBlackScreen) {
    return (
      <div className="w-full fixed inset-0 bg-black z-[100] flex items-center justify-center">
        {/* Loader - hidden when transition image shows */}
        {!showTransitionImage && (
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 border-4 border-gray-800 border-t-white rounded-full animate-spin"></div>

            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Transition Image - shows when ready */}
        {showTransitionImage && (
          <div className="animate-fadeIn w-full h-auto">
            {/* Mobile version */}
            <div className="block md:hidden">
              <Image
                src={RunModules09}
                alt="Transition"
                width={600}
                height={400}
                className="w-full h-auto "
                priority
              />
            </div>

            {/* Desktop / md+ version */}
            <div className="hidden md:block w-full h-full">
              <Image
                src={RunModules09}
                alt="Transition"
                fill
                className=""
                priority
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative h-screen bg-contain bg-no-repeat xl:bg-cover xl:bg-center"
      style={{
        backgroundImage: `url(${Background.src})`,
      }}
    >
      {/* Orange/Yellow div - shows ONLY when at right position and not animating in second round */}
      {secondRound && isAtRight && !isAnimating && (
        <Link href={`/CertificateDownloard?childId=${childId}`}>
          <div className="absolute top-[15px] right-[100px] sm:top-[40px] sm:right-[140px] md:top-[40px] md:right-[265px] lg:top-[90px] lg:right-[360px]   xl:top-[240px] xl:right-[384px]  xxl:top-[285px] xxl:right-[588px] shadow-lg shadow-[#E58A11]/50 cursor-pointer">
            <div className="bg-[#E58A11]  px-1 md:py-2 rotate-3 xl:pt-[5px] xl:px-[16px] border border-white rounded-md relative h-full flex flex-col items-center justify-between">
              {/* Title Section */}
              <div className="hidden md:block text-center text-white font-black w-full">
                <div translate="yes" className="md:text-[10px] xl:text-[16px] xxl:text-[18px] tracking-tight leading-tight font-extrabold">
                  License
                </div>
                <div translate="yes" className="md:text-[8px] xl:text-[16px]  font-extrabold">
                  Earned
                </div>
                <div>
                  <Image
                    src={LicenseEarned}
                    alt="iamge"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              {/* Icon Container */}
              <div className="md:flex items-center gap-1 py-1 px-1 md:py-0 md:px-0 mt-2">
                <ArrowUp
                  className="w-5 h-5 md:w-4 md:h-4 text-white animate-bounce"
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>
        </Link>
      )}
      {/* Car */}
      {/* xl:translate-x-[calc(90vw-500px)] lg:translate-x-[calc(110vw-500px)] md:translate-x-[calc(128vw-500px)] */}
      <div
        className={`absolute top-[50px] sm:top-[70px] md:top-[120px] xl:top-[420px]  xxl:top-[500px]  lg:top-[155px] md: z-[10] transition-transform duration-[5000ms] ease-linear ${
          isAtRight
            ? secondRound
              ? "translate-x-[calc(215vw-500px)] sm:translate-x-[calc(180vw-500px)] md:translate-x-[calc(130vw-500px)] lg:translate-x-[calc(113vw-500px)] xl:translate-x-[calc(97vw-500px)] xxl:translate-x-[calc(92vw-500px)]"
              : "translate-x-[calc(260vw-500px)] sm:translate-x-[calc(220vw-500px)] md:translate-x-[calc(200vw-500px)] xxl:translate-x-[calc(140vw-500px)]"
            : "translate-x-0"
        }`}
      >
        <Image
          className="relative w-[110px] h-[50px] sm:w-[130px] sm:h-[65px]  md:w-[210px] md:h-[110px] lg:w-[280px] lg:h-[150px]  xl:w-[440px] xl:h-[285px]"
          width={500}
          height={500}
          src={car}
          alt=""
        />

        {isAnimating && (
          <>
            <div className="absolute top-[31px] left-[20px] sm:top-[44px] sm:left-[25.5px] lg:top-[98px] lg:left-[52px] xl:top-[193px] xl:left-[82px] md:top-[72px] md:left-[40px]">
              <LucideLoaderPinwheel
                size={80}
                className="hidden xl:block text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
              <LucideLoaderPinwheel
                size={50}
                className="hidden lg:block xl:hidden text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
              <LucideLoaderPinwheel
                size={35}
                className="hidden md:block lg:hidden text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
              <LucideLoaderPinwheel
                size={20}
                className="block md:hidden text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
            </div>
            <div className="absolute top-[31px] right-[24px] sm:top-[44px] sm:right-[30.6px] lg:top-[98px] lg:right-[63px] xl:top-[193px]  xl:right-[98px] md:top-[72px] md:right-[48px]">
              <LucideLoaderPinwheel
                size={80}
                className="hidden xl:block text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
              <LucideLoaderPinwheel
                size={50}
                className="hidden lg:block xl:hidden text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
              <LucideLoaderPinwheel
                size={35}
                className="hidden md:block lg:hidden text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
              <LucideLoaderPinwheel
                size={20}
                className="block md:hidden text-black/50 animate-spin"
                style={{ animationDirection: animationDirection }}
              />
            </div>
          </>
        )}

        {/* Start button - shows when at left and not animating ONLY in first round */}
        {!isAtRight && !isAnimating && (
          <button
           translate="yes"
            onClick={handleStart}
            className="hover:bg-[#FFFFFF] text-xs hover:text-[#FF9E1C] absolute top-[17px] left-[40px] sm:top-[22px] sm:left-[48px] md:top-[52px] md:left-[80px] lg:top-[65px] lg:left-28 xl:top-36 xl:left-48 md:px-1 py-[1px] lg:px-2 lg:py-1 xl:px-3 xl:py-2 border border-[#FFFFFF] rounded-md text-white"
          >
            Start
          </button>
        )}
        {/* Back button - shows when at right and not animating */}
        {isAtRight && !isAnimating && (
          <button
          translate="yes"
            onClick={handleBack}
            className="hover:bg-[#FFFFFF] text-xs hover:text-[#FF9E1C] absolute top-[17px] left-[40px] sm:top-[22px] sm:left-[48px] md:top-[52px] md:left-[80px] lg:top-[65px] lg:left-28 xl:top-36 xl:left-48 md:px-1 py-[1px] lg:px-2 lg:py-1 xl:px-3 xl:py-2 border Car1 rounded-md text-white"
          >
            Back
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .hand-tap {
          animation: tap 1s infinite;
        }
        @keyframes tap {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
