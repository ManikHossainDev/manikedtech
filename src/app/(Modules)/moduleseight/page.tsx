/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import car from "@/assets/Modules/Car.png";
import Background from "@/assets/Modules/Background.png";
import NRunModules08 from "@/assets/NModules/NRunModules08.png";
import Imagemodaleight from "@/assets/Modules/Imagemodaleight.png";
import tirProint from "@/assets/Modules/tirProint.png";
import Group from "@/assets/Modules/Group.png";
import Image from "next/image";
import { ArrowDown, ChevronLeft, LucideLoaderPinwheel, X } from "lucide-react";
import { LiaHandPointer } from "react-icons/lia";
import { FaLongArrowAltLeft, FaStar } from "react-icons/fa";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import { Button } from "antd";
import Link from "next/link";

const Page = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAtRight, setIsAtRight] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("normal");
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [showTransitionImage, setShowTransitionImage] = useState(false);
  const [secondRound, setSecondRound] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
               const router = useRouter()
                const [updateCheckPoints] = useUpdateCheckPointsMutation();
                const startLeaningHanlder = async () => {
                try {
                  const introBody = {
                    moduleNumber: 8,
                    checkpoint: "intro_page",
                    childProfileId: childId,
                  };
                  await updateCheckPoints({ updatesBody: introBody }).unwrap();
                  const learningBody = {
                    moduleNumber: 8,
                    checkpoint: "learning_content",
                    childProfileId: childId,
                  };
                  const response = await updateCheckPoints({
                    updatesBody: learningBody,
                  }).unwrap();
                  if (response?.code === 200) {
                    router.push(`/Learningeight?childId=${childId}`);
                  }
                } catch (error) {
                  console.log(error)
                }
              };
  

  // module id eight
  const id = "6936776976dca28d7e43e6c7";
  const { data } = useGetModulesByIdQuery(id);
  const { title, theme, learningObjectives, introVideo } = data?.data || {};
  const handleStart = () => {
  setIsAnimating(true);
  setIsAtRight(true);
  setAnimationDirection("normal");

  setTimeout(() => {
    setIsAnimating(false);
    setShowBlackScreen(true);

    setTimeout(() => {
      setShowTransitionImage(true);

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
        }, 100); // 0 থেকে 100ms করুন
      }, 4000);
    }, 1000);
  }, 5000);
};

const handleBack = () => {
  setIsAnimating(true);
  setIsAtRight(false);
  setAnimationDirection("reverse");
  setSecondRound(false); 
  setTimeout(() => {
    setIsAnimating(false);
  }, 5000);
};

  const handleDivClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
                src={NRunModules08}
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
                src={NRunModules08}
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
        <div className="absolute top-[15px] right-[100px] sm:top-[40px] sm:right-[140px] md:top-[40px] md:right-[265px] lg:top-[100px] lg:right-[360px]   xl:top-[260px] xl:right-[393px]  xxl:top-[295px] xxl:right-[593px] 3xl:top-[280px] 3xl:right-[600px] 4xl:top-[330px] 4xl:right-[875px] shadow-lg shadow-[#E58A11]/50 cursor-pointer"
          onClick={handleDivClick}
        >
          <div className="bg-[#E58A11]  px-1 md:py-2 rotate-3 xl:pt-[5px] xl:px-[14px] xxl:px-[20px] border border-white rounded-md relative h-full flex flex-col items-center justify-between">
            {/* Title Section */}
            <div className="hidden md:block text-center text-white font-black w-full">
              <div className="md:text-[10px] xl:text-[16px] tracking-tight leading-tight font-extrabold">
                Skjerm
              </div>
              <div className="md:text-[8px] xl:text-[16px]  font-extrabold">
                Tid
              </div>
              <div className="md:text-[10px] xl:text-[16px] mt-3 font-extrabold">
                08
              </div>
            </div>
            {/* Icon Container */}
            <div className="md:flex items-center gap-1 py-1 px-1 md:py-0 md:px-0">
              <ArrowDown
                className="w-3 h-3 md:w-4 md:h-4 text-white animate-bounce"
                strokeWidth={3}
              />
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    width: "28px",
                    height: "28px",
                    top: "-5px",
                    left: "-5px",
                  }}
                ></div>
                <LiaHandPointer
                  className="w-3 h-3  md:w-4 md:h-4 xl:w-8 xl:h-8 text-white hand-tap"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Button
                className="bg-[#FF9E1C] text-white font-semibold py-3"
              >
                <Link href="/AddChildren" className=" flex items-center ">
                   <ChevronLeft className="font-bold" />  Tilbake til Dashboard
                </Link>
              </Button>
      {/* Car */}
      {/* xl:translate-x-[calc(90vw-500px)] lg:translate-x-[calc(110vw-500px)] md:translate-x-[calc(128vw-500px)] */}
      <div
  className={`absolute 
     top-[50px]
  sm:top-[70px]
  md:top-[120px]
  lg:top-[155px]

  xl:top-auto xl:bottom-[100px]
  xxl:bottom-[120px]
  3xl:bottom-[140px]
  4xl:bottom-[180px]
  5xl:bottom-[220px]
    z-[10] 
    transition-transform duration-[5000ms] ease-linear
    ${
      isAtRight
        ? secondRound
          ? "translate-x-[calc(215vw-500px)] sm:translate-x-[calc(180vw-500px)] md:translate-x-[calc(130vw-500px)] lg:translate-x-[calc(113vw-500px)] xl:translate-x-[calc(97vw-500px)] xxl:translate-x-[calc(92vw-500px)]"
          : "translate-x-[calc(260vw-500px)] sm:translate-x-[calc(220vw-500px)] md:translate-x-[calc(200vw-500px)] xxl:translate-x-[calc(140vw-500px)]"
        : "translate-x-0"
    }
  `}
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
            onClick={handleStart}
            className="hover:bg-[#FFFFFF] text-xs hover:text-[#FF9E1C] absolute top-[17px] left-[40px] sm:top-[22px] sm:left-[48px] md:top-[52px] md:left-[80px] lg:top-[65px] lg:left-28 xl:top-36 xl:left-48 md:px-1 py-[1px] lg:px-2 lg:py-1 xl:px-3 xl:py-2 border border-[#FFFFFF] rounded-md text-white"
          >
            Start
          </button>
        )}
        {/* Back button - shows when at right and not animating */}
        {isAtRight && !isAnimating && (
          <button
            onClick={handleBack}
            className="hover:bg-[#FFFFFF] text-xs hover:text-[#FF9E1C] absolute top-[17px] left-[40px] sm:top-[22px] sm:left-[48px] md:top-[52px] md:left-[80px] lg:top-[65px] lg:left-28 xl:top-36 xl:left-48 md:px-1 py-[1px] lg:px-2 lg:py-1 xl:px-3 xl:py-2 border Car1 rounded-md text-white"
          >
            Tilbake
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  z-50 flex md:items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#F0EFF0] rounded-lg  shadow-xl p-1 md:p-4 max-w-2xl w-full mx-4 ">
            <div className="w-full    flex justify-between items-center">
              <div>
                <h1>Tilbake til Modul 08</h1>
              </div>
              {/* Close button */}
              <button
                onClick={closeModal}
                className=" hover:bg-red-300 rounded-md right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6 hover:text-red-500" />
              </button>
            </div>

            {/* Modal content */}
            <div className="mt-2">
              <div className="bg-white flex items-center space-x-2 w-fit py-3 px-2 rounded-br-[38px] rounded-tl-[38px]">
                <Image
                  width={40}
                  height={40}
                  className="w-10 h-10 "
                  src={Imagemodaleight}
                  alt="imag"
                />
                <h2 className=" text-base md:text-xl font-bold text-[#E58A11]">
                  Modul 8: {title}
                </h2>
              </div>
              <div className="bg-white mt-2 p-2  rounded-md">
                <div className="flex items-center space-x-2 bg-[#FFDFD2] p-2 rounded-xl w-fit">
                  <FaLongArrowAltLeft />
                  <h1> {theme}</h1>
                </div>

                <div className="w-full px-1 py-2">
                  <video
                    className="w-full h-[315px] rounded-lg"
                    controls
                    preload="metadata"
                  >
                    <source src={introVideo.url} type="video/mp4" />
                    Nettleseren din støtter ikke videotaggen.
                  </video>
                </div>
                <div>
                  <div className="flex items-center space-x-2 py-1  rounded-xl w-fit">
                    <Image className="w-7 h-7 " src={tirProint} alt="imag" />
                    <h1 className="mt-1">Læringsmål</h1>
                  </div>
                  <div className="space-y-1">
                    {learningObjectives.map((item: any) => (
                      <div
                        key={item.order}
                        className="flex items-center space-x-2 py-1 rounded-xl w-fit"
                      >
                        <Image className="w-6 h-6" src={Group} alt="imag" />
                        <h1 className="mt-1">{item.text}</h1>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 md:gap-4 py-2 justify-center">
                    <div onClick={startLeaningHanlder}>
                      <button className="flex items-center justify-center gap-2 bg-[#FF9E1C] hover:bg-[#FF9E1C] text-white font-semibold py-3 px-2 md:px-8 rounded-lg transition-colors duration-200 shadow-md">
                        <FaStar className="text-xs md:text-xl" />
                        <span className="text-xs md:text-xl">
                          Start læring
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
