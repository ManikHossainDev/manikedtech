// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import { useEffect, useState } from "react";
// import car from "@/assets/Modules/Car.png";
// import Background from "@/assets/Modules/Background.png";
// import NRunModules01 from "@/assets/NModules/NRunModules01.png";
// import ImagemodalOne from "@/assets/Modules/ImagemodalOne.png";
// import tirProint from "@/assets/Modules/tirProint.png";
// import Group from "@/assets/Modules/Group.png";
// import Image from "next/image";
// import { ArrowDown, ChevronLeft, LucideLoaderPinwheel, X } from "lucide-react";
// import { LiaHandPointer } from "react-icons/lia";
// import { FaLongArrowAltLeft, FaStar } from "react-icons/fa";
// // import Link from "next/link";
// import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
// import { useSelector } from "react-redux";
// import {
//   selectSelectedModule,
//   setSelectedModule,
// } from "@/redux/features/modules/moduleSlice";
// import { useDispatch } from "react-redux";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
// import { toast } from "sonner";
// import { Button } from "antd";
// import Link from "next/link";


// const Page = () => {


//   // selectors and states
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isAtRight, setIsAtRight] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [animationDirection, setAnimationDirection] = useState("normal");
//   const [showBlackScreen, setShowBlackScreen] = useState(false);
//   const [showTransitionImage, setShowTransitionImage] = useState(false);
//   const [secondRound, setSecondRound] = useState(false);
//   const selectedModule = useSelector(selectSelectedModule);
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   /** ================ Mutaions============ */
//   const [updateCheckPoints] = useUpdateCheckPointsMutation();

//   const childId = searchParams.get("childId");

//   // Check if selectedModule has data, if not fetch from API
//   const { data } = useGetModulesByIdQuery("695b946312423eb787bb458d", {
//     skip:
//       selectedModule !== null &&
//       selectedModule !== undefined &&
//       Object.keys(selectedModule).length > 0,
//   });
//   useEffect(() => {
//     if (
//       (selectedModule === null ||
//         selectedModule === undefined ||
//         Object.keys(selectedModule).length === 0) &&
//       data
//     ) {
//       dispatch(setSelectedModule(data.data)); // Set the data.data object into selectedModule
//     }
//   }, [selectedModule, data, dispatch]);

//   const handleStart = () => {
//     setIsAnimating(true);
//     setIsAtRight(true);
//     setAnimationDirection("normal");

//     setTimeout(() => {
//       setIsAnimating(false);
//       setShowBlackScreen(true);

//       setTimeout(() => {
//         setShowTransitionImage(true);

//         setTimeout(() => {
//           setShowBlackScreen(false);
//           setShowTransitionImage(false);
//           setIsAtRight(false);
//           setSecondRound(true);

//           // Auto start second animation
//           setTimeout(() => {
//             setIsAnimating(true);
//             setIsAtRight(true);
//             setAnimationDirection("normal");

//             setTimeout(() => {
//               setIsAnimating(false);
//             }, 5000);
//           }, 100); // 0 থেকে 100ms করুন
//         }, 4000);
//       }, 1000);
//     }, 5000);
//   };

//   const handleBack = () => {
//     setIsAnimating(true);
//     setIsAtRight(false);
//     setAnimationDirection("reverse");
//     setSecondRound(false);
//     setTimeout(() => {
//       setIsAnimating(false);
//     }, 5000);
//   };

//   const handleDivClick = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   // Black screen with transition image overlay
//   if (showBlackScreen) {
//     return (
//       <div className="w-full fixed inset-0 bg-black z-[100] flex items-center justify-center">
//         {/* Loader - hidden when transition image shows */}
//         {!showTransitionImage && (
//           <div className="relative">
//             {/* Outer rotating ring */}
//             <div className="w-20 h-20 border-4 border-gray-800 border-t-white rounded-full animate-spin"></div>

//             {/* Inner pulsing dot */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           </div>
//         )}

//         {/* Transition Image - shows when ready */}
//         {showTransitionImage && (
//           <div className="animate-fadeIn w-full h-auto">
//             {/* Mobile version */}
//             <div className="block md:hidden">
//               <Image
//                 src={NRunModules01}
//                 alt="Transition"
//                 width={600}
//                 height={400}
//                 className="w-full h-auto "
//                 priority
//               />
//             </div>

//             {/* Desktop / md+ version */}
//             <div className="hidden md:block w-full h-full">
//               <Image
//                 src={NRunModules01}
//                 alt="Transition"
//                 fill
//                 className=""
//                 priority
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   const startLeaningHanlder = async () => {
//     try {
//       // 1️⃣ Intro Page Update
//       const introBody = {
//         moduleNumber: 1,
//         checkpoint: "intro_page",
//         childProfileId: childId,
//       };

//       await updateCheckPoints({ updatesBody: introBody }).unwrap();

//       // 2️⃣ Læringsinnhold Update
//       const learningBody = {
//         moduleNumber: 1,
//         checkpoint: "learning_content",
//         childProfileId: childId,
//       };

//       const response = await updateCheckPoints({
//         updatesBody: learningBody,
//       }).unwrap();
//       if (response?.code === 200) {
//         router.push(`/LearningOne?childId=${childId}`);
//       }
//     } catch (error) {
//       toast.error("Feil ved oppdatering");
//     }
//   };

//   return (
//     <div
//       className="relative h-screen bg-contain bg-no-repeat xl:bg-cover xl:bg-center"
//       style={{
//         backgroundImage: `url(${Background.src})`,
//       }}
//     >
//       {/* Orange/Yellow div - shows ONLY when at right position and not animating in second round */}
//       {secondRound && isAtRight && !isAnimating && (
//         <div
//           className="absolute top-[15px] right-[100px] sm:top-[40px] sm:right-[140px] md:top-[40px] md:right-[265px] lg:top-[100px] lg:right-[360px]   xl:top-[260px] xl:right-[393px]  xxl:top-[295px] xxl:right-[593px] 3xl:top-[280px] 3xl:right-[600px] 4xl:top-[330px] 4xl:right-[875px] shadow-lg shadow-[#E58A11]/50 cursor-pointer"
//           onClick={handleDivClick}
//         >
//           <div className="bg-[#E58A11] rotate-2 xxl:rotate-3  px-1 md:py-2  xl:pt-[5px]  xl:px-[10px] border border-white rounded-md relative h-full flex flex-col items-center justify-between">
//             {/* Title Section */}
//             <div className="hidden md:block text-center text-white fo6nt-black w-full">
//               <div className="md:text-[10px] xl:text-[14px] xxl:text-[18px] tracking-tight leading-tight font-extrabold">
//                 Internett
//               </div>
//               <div className="md:text-[10px] xl:text-[10px] xxl:text-[18px] tracking-tight leading-tight font-extrabold">
//                 sikkerhet
//               </div>
//               <div className="md:text-[10px] xl:text-[16px] mt-3 font-extrabold">
//                 01
//               </div>
//             </div>
//             {/* Icon Container */}
//             <div className="md:flex items-center gap-1 py-1 px-1 md:py-0 md:px-0">
//               <ArrowDown
//                 className="w-3 h-3 md:w-4 md:h-4 text-white animate-bounce"
//                 strokeWidth={3}
//               />
//               <div className="relative">
//                 <div
//                   className="absolute inset-0 rounded-full animate-pulse"
//                   style={{
//                     width: "28px",
//                     height: "28px",
//                     top: "-5px",
//                     left: "-5px",
//                   }}
//                 ></div>
//                 <LiaHandPointer
//                   className="w-3 h-3  md:w-4 md:h-4 xl:w-8 xl:h-8 text-white hand-tap"
//                   strokeWidth={2.5}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div>
//         <Button
//           className="bg-[#FF9E1C] text-white font-semibold py-3"
//         >
//           <Link href="/AddChildren" className=" flex items-center ">
//             <ChevronLeft className="font-bold" />  Tilbake til Dashboard
//           </Link>
//         </Button>
//       </div>


//       <div
//         className={`absolute top-[50px] sm:top-[70px] md:top-[120px] lg:top-[155px] xl:top-auto xl:bottom-[100px] xxl:bottom-[120px] 3xl:bottom-[140px] 4xl:bottom-[180px] 5xl:bottom-[220px] z-[10] 
//     transition-transform duration-[5000ms] ease-linear
//     ${isAtRight
//             ? secondRound
//               ? "translate-x-[calc(215vw-500px)] sm:translate-x-[calc(180vw-500px)] md:translate-x-[calc(130vw-500px)] lg:translate-x-[calc(113vw-500px)] xl:translate-x-[calc(97vw-500px)] xxl:translate-x-[calc(92vw-500px)]"
//               : "translate-x-[calc(260vw-500px)] sm:translate-x-[calc(220vw-500px)] md:translate-x-[calc(200vw-500px)] xxl:translate-x-[calc(140vw-500px)]"
//             : "translate-x-0"
//           }
//   `}
//       >
//         <Image
//           className="relative w-[110px] h-[50px] sm:w-[130px] sm:h-[65px]  md:w-[210px] md:h-[110px] lg:w-[280px] lg:h-[150px]  xl:w-[440px] xl:h-[285px]"
//           width={500}
//           height={500}
//           src={car}
//           alt=""
//         />

//         {isAnimating && (
//           <>
//             <div className="absolute top-[31px] left-[20px] sm:top-[44px] sm:left-[25.5px] lg:top-[98px] lg:left-[52px] xl:top-[193px] xl:left-[82px] md:top-[72px] md:left-[40px]">
//               <LucideLoaderPinwheel
//                 size={80}
//                 className="hidden xl:block text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//               <LucideLoaderPinwheel
//                 size={50}
//                 className="hidden lg:block xl:hidden text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//               <LucideLoaderPinwheel
//                 size={35}
//                 className="hidden md:block lg:hidden text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//               <LucideLoaderPinwheel
//                 size={20}
//                 className="block md:hidden text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//             </div>
//             <div className="absolute top-[31px] right-[24px] sm:top-[44px] sm:right-[30.6px] lg:top-[98px] lg:right-[63px] xl:top-[193px]  xl:right-[98px] md:top-[72px] md:right-[48px]">
//               <LucideLoaderPinwheel
//                 size={80}
//                 className="hidden xl:block text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//               <LucideLoaderPinwheel
//                 size={50}
//                 className="hidden lg:block xl:hidden text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//               <LucideLoaderPinwheel
//                 size={35}
//                 className="hidden md:block lg:hidden text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//               <LucideLoaderPinwheel
//                 size={20}
//                 className="block md:hidden text-black/50 animate-spin"
//                 style={{ animationDirection: animationDirection }}
//               />
//             </div>
//           </>
//         )}

//         {/* Start button - shows when at left and not animating ONLY in first round */}
//         {!isAtRight && !isAnimating && (
//           <button
//             onClick={handleStart}
//             className="hover:bg-[#FFFFFF] text-xs hover:text-[#FF9E1C] absolute top-[17px] left-[40px] sm:top-[22px] sm:left-[48px] md:top-[52px] md:left-[80px] lg:top-[65px] lg:left-28 xl:top-36 xl:left-48 md:px-1 py-[1px] lg:px-2 lg:py-1 xl:px-3 xl:py-2 border border-[#FFFFFF] rounded-md text-white"
//           >
//             Start
//           </button>
//         )}
//         {/* Back button - shows when at right and not animating */}
//         {isAtRight && !isAnimating && (
//           <button
//             onClick={handleBack}
//             className="hover:bg-[#FFFFFF] text-xs hover:text-[#FF9E1C] absolute top-[17px] left-[40px] sm:top-[22px] sm:left-[48px] md:top-[52px] md:left-[80px] lg:top-[65px] lg:left-28 xl:top-36 xl:left-48 md:px-1 py-[1px] lg:px-2 lg:py-1 xl:px-3 xl:py-2 border Car1 rounded-md text-white"
//           >
//             Tilbake
//           </button>
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0  z-50 flex md:items-baseline lg:items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-[#F0EFF0] rounded-lg  shadow-xl p-1 md:p-4 max-w-2xl w-full mx-4 ">
//             <div className="w-full    flex justify-between items-center">
//               <div>
//                 <h1>Tilbake til Modul 01</h1>
//               </div>
//               {/* Close button */}
//               <button
//                 onClick={closeModal}
//                 className=" hover:bg-red-300 rounded-md right-4 text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X className="w-6 h-6 hover:text-red-500" />
//               </button>
//             </div>

//             {/* Modal content */}
//             <div className="mt-2">
//               <div className="bg-white flex items-center space-x-2 w-fit py-3 px-2 rounded-br-[38px] rounded-tl-[38px]">
//                 <Image
//                   width={40}
//                   height={40}
//                   className="w-10 h-10 "
//                   src={ImagemodalOne}
//                   alt="imag"
//                 />
//                 <h2 className=" text-base md:text-xl font-bold text-[#E58A11]">
//                   {selectedModule?.title || "Internett-sikkerhet og trivsel - Modul 01"}
//                 </h2>
//               </div>
//               <div className="bg-white mt-2 p-2  rounded-md">
//                 <div className="flex items-center space-x-2 bg-[#FFDFD2] p-2 rounded-xl w-fit">
//                   <FaLongArrowAltLeft />
//                   <h1>
//                     {selectedModule?.theme ||
//                       "Grunnleggende regler for oppførsel og sikkerhet på nett."}
//                   </h1>
//                 </div>

//                 <div className="w-full px-1 py-2">
//                   <video
//                     className="w-full h-[315px] rounded-lg"
//                     controls
//                     preload="metadata"
//                   >
//                     <source
//                       src={selectedModule?.introVideo?.url}
//                       type="video/mp4"
//                     />
//                     Nettleseren din støtter ikke videotaggen.
//                   </video>
//                 </div>
//                 <div>
//                   <div className="flex items-center space-x-2 py-1  rounded-xl w-fit">
//                     <Image className="w-7 h-7 " src={tirProint} alt="imag" />
//                     <h1 className="mt-1">Læringsmål</h1>
//                   </div>
//                   {selectedModule?.learningObjectives && (
//                     <div className="ml-2">
//                       {selectedModule?.learningObjectives.map(
//                         (obj: any, index: number) => (
//                           <div
//                             key={index}
//                             className="flex items-center space-x-2 py-1 rounded-xl w-fit"
//                           >
//                             <Image
//                               className="w-6 h-6 "
//                               src={Group}
//                               alt="imag"
//                             />
//                             <h1 className="mt-1">{obj?.text}</h1>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   )}
//                   <div className="flex gap-2 md:gap-4 py-2 justify-center">
//                     <div onClick={startLeaningHanlder}>
//                       <button className="flex items-center justify-center gap-2 bg-[#FF9E1C] hover:bg-[#FF9E1C] text-white font-semibold py-3 px-2 md:px-8 rounded-lg transition-colors duration-200 shadow-md">
//                         <FaStar className="text-xs md:text-xl" />
//                         <span className="text-xs md:text-xl">
//                           Start læring
//                         </span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 1s ease-out forwards;
//         }
//         .hand-tap {
//           animation: tap 1s infinite;
//         }
//         @keyframes tap {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Page;



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Play, RotateCcw, Sun, Moon, X } from "lucide-react";
import { FaLongArrowAltLeft, FaStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "antd";
import { toast } from "sonner";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { selectSelectedModule, setSelectedModule } from "@/redux/features/modules/moduleSlice";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

// Image imports
import ImagemodalOne from "@/assets/Modules/ImagemodalOne.png";
import tirProint from "@/assets/Modules/tirProint.png";
import Group from "@/assets/Modules/Group.png";

// ─────────────────────────────────────────────
// ASSET PATHS (adjust if needed)
// ─────────────────────────────────────────────
const wheelIconUrl = "/wheel-icon.svg";
const carImgSrc = "/car_side-2.png";

// ─────────────────────────────────────────────
// CLOUD SHAPE
// ─────────────────────────────────────────────
interface CloudShapeProps {
  isDay: boolean;
  scale: number;
}

const CloudShape = ({ isDay, scale }: CloudShapeProps) => {
  const fill = isDay ? "#ffffff" : "#5558b5";
  const shading = isDay ? "#c0d8ee" : "#343776";
  const highlight = isDay ? "rgba(255,255,255,0.9)" : "rgba(140,150,220,0.22)";

  return (
    <svg
      width={Math.round(140 * scale)}
      height={Math.round(70 * scale)}
      viewBox="0 0 140 70"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <ellipse cx="70" cy="67" rx="54" ry="7" fill={shading} opacity="0.45" />
      <ellipse cx="70" cy="55" rx="57" ry="14" fill={fill} />
      <ellipse cx="14" cy="52" rx="13" ry="11" fill={fill} />
      <ellipse cx="28" cy="44" rx="25" ry="22" fill={fill} />
      <ellipse cx="44" cy="39" rx="17" ry="14" fill={fill} />
      <ellipse cx="68" cy="28" rx="32" ry="30" fill={fill} />
      <ellipse cx="96" cy="41" rx="16" ry="13" fill={fill} />
      <ellipse cx="110" cy="45" rx="24" ry="20" fill={fill} />
      <ellipse cx="126" cy="52" rx="13" ry="11" fill={fill} />
      <ellipse cx="62" cy="20" rx="13" ry="9" fill={highlight} opacity="0.8" />
    </svg>
  );
};

// ─────────────────────────────────────────────
// SKY ELEMENTS
// ─────────────────────────────────────────────
const SkyElements = ({ theme }: { theme: string }) => {
  const isDay = theme === "day";

  const clouds = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${(Math.sin(i * 123) * 45 + 48).toFixed(2)}%`,
    top: `${(Math.cos(i * 321) * 18 + 8).toFixed(2)}%`,
    scale: Math.abs(Math.sin(i * 456)) * 0.8 + 0.55,
    opacity: isDay
      ? Math.abs(Math.cos(i * 789)) * 0.3 + 0.6
      : Math.abs(Math.cos(i * 789)) * 0.07 + 0.05,
    speed: Math.abs(Math.sin(i * 987)) * 25 + 35,
    yBob: Math.sin(i * 1.3) * 7,
    yBobDuration: 4 + (i % 5),
  }));

  const stars = Array.from({ length: 140 }).map((_, i) => ({
    id: `star-${i}`,
    idx: i,
    left: `${(Math.sin(i * 137) * 50 + 50).toFixed(2)}%`,
    top: `${(Math.cos(i * 251) * 45 + 45).toFixed(2)}%`,
    size: Math.abs(Math.sin(i * 456)) * 2.2 + 0.6,
    opacity: Math.abs(Math.cos(i * 789)) * 0.65 + 0.35,
  }));

  return (
    <div className="absolute top-0 w-full h-[65%] overflow-hidden pointer-events-none">
      <AnimatePresence>
        {!isDay &&
          stars.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.7] }}
              transition={{
                duration: 2 + (s.idx % 10) * 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: (s.idx % 20) * 0.1,
              }}
              className="absolute bg-white rounded-full"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                boxShadow: s.size > 1.8 ? `0 0 ${s.size * 2}px rgba(255,255,255,0.8)` : "none",
              }}
            />
          ))}
      </AnimatePresence>

      {clouds.map((c) => (
        <motion.div
          key={`cloud-${c.id}`}
          className="absolute pointer-events-none"
          style={{ left: c.left, top: c.top, opacity: c.opacity, filter: "blur(1.5px)" }}
          animate={{ x: [0, 1400], y: [0, c.yBob, 0] }}
          transition={{
            x: { duration: c.speed, repeat: Infinity, ease: "linear" },
            y: { duration: c.yBobDuration, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
          }}
        >
          <CloudShape isDay={isDay} scale={c.scale} />
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// BIRDS
// ─────────────────────────────────────────────
const Birds = ({ theme }: { theme: string }) => (
  <motion.svg
    className={`absolute top-[10%] right-[5%] w-[8vw] min-w-[60px] h-[4vw] pointer-events-none transition-colors duration-1000 ${theme === "day" ? "opacity-60" : "opacity-70"}`}
    viewBox="0 0 120 40"
    style={{ zIndex: 5 }}
  >
    <path d="M 0 15 Q 8 5 16 15 Q 8 10 0 15 Z" fill={theme === "day" ? "#2c3e50" : "#111428"} />
    <path d="M 25 8 Q 33 -2 41 8 Q 33 3 25 8 Z" fill={theme === "day" ? "#2c3e50" : "#111428"} />
    <path d="M 50 3 Q 58 -7 66 3 Q 58 -2 50 3 Z" fill={theme === "day" ? "#2c3e50" : "#111428"} />
  </motion.svg>
);

// ─────────────────────────────────────────────
// FAR CITY
// ─────────────────────────────────────────────
const FarCity = ({ theme }: { theme: string }) => {
  const isDay = theme === "day";
  return (
    <div
      className="absolute w-full flex items-end pointer-events-none z-0 transition-opacity duration-1000"
      style={{ bottom: "25vh", height: "42vh", opacity: isDay ? 0.9 : 1 }}
    >
      <div className="absolute bottom-0 w-full h-full flex items-end">
        <div className={`w-[3%] h-[28%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#adb8d8]"}`} style={{ opacity: isDay ? 1 : 0.55 }} />
        <div className={`w-[5%] h-[42%] ml-[1%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#b5c2dc]"}`} style={{ opacity: isDay ? 1 : 0.6 }} />
        <div className={`w-[3%] h-[32%] ml-[0.5%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#a8b5d0]"}`} style={{ opacity: isDay ? 1 : 0.5 }} />
        <div className={`w-[3.5%] h-[75%] ml-[15%] transition-colors duration-1000 ${isDay ? "bg-[#e1f5fe]" : "bg-[#c8d5ed]"}`} style={{ opacity: isDay ? 0.9 : 0.65 }} />
        <div className={`w-[2.5%] h-[85%] ml-[0.5%] transition-colors duration-1000 ${isDay ? "bg-[#e8f4ff]" : "bg-[#d0ddf0]"}`} style={{ opacity: isDay ? 0.9 : 0.7 }} />
        <div className={`w-[4%] h-[55%] ml-[2%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#aab8d5]"}`} style={{ opacity: isDay ? 0.8 : 0.5 }} />
        <div className={`w-[4%] h-[38%] ml-[20%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#aab8d5]"}`} style={{ opacity: isDay ? 0.8 : 0.5 }} />
        <div className={`w-[6%] h-[48%] ml-[1%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#b5c2dc]"}`} style={{ opacity: isDay ? 0.85 : 0.55 }} />
        <div className={`w-[3%] h-[35%] ml-[1%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#a8b5d0]"}`} style={{ opacity: isDay ? 0.75 : 0.5 }} />
        <div className={`w-[5%] h-[52%] ml-[2%] transition-colors duration-1000 ${isDay ? "bg-[#b3e5fc]" : "bg-[#b0bdd8]"}`} style={{ opacity: isDay ? 0.85 : 0.55 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// GEOMETRIC TREE
// ─────────────────────────────────────────────
const GeometricTree = ({
  style, scale = 1, flip = false, theme,
}: { style: React.CSSProperties; scale?: number; flip?: boolean; theme: string }) => {
  const isDay = theme === "day";
  return (
    <svg
      viewBox="0 0 220 240"
      style={{ ...style, transform: `scale(${scale}) ${flip ? "scaleX(-1)" : ""}`, width: "16vw", minWidth: "110px", maxWidth: "220px" }}
      className="absolute overflow-visible origin-bottom z-0 transition-colors duration-1000"
    >
      <rect x="104" y="140" width="10" height="100" fill={isDay ? "#6d4c2a" : "#2e1e14"} />
      <ellipse cx="110" cy="160" rx="90" ry="55" fill={isDay ? "#1b5e20" : "#1a2648"} />
      <ellipse cx="55"  cy="170" rx="55" ry="38" fill={isDay ? "#1b5e20" : "#1a2648"} />
      <ellipse cx="165" cy="165" rx="60" ry="42" fill={isDay ? "#1b5e20" : "#1a2648"} />
      <ellipse cx="110" cy="110" rx="85" ry="65" fill={isDay ? "#2e7d32" : "#1e2e5a"} />
      <ellipse cx="50"  cy="130" rx="50" ry="38" fill={isDay ? "#2e7d32" : "#1e2e5a"} />
      <ellipse cx="170" cy="125" rx="55" ry="42" fill={isDay ? "#2e7d32" : "#1e2e5a"} />
      <ellipse cx="110" cy="70"  rx="72" ry="55" fill={isDay ? "#388e3c" : "#253570"} />
      <ellipse cx="105" cy="45"  rx="52" ry="38" fill={isDay ? "#4caf50" : "#2c3e80"} />
    </svg>
  );
};

// ─────────────────────────────────────────────
// STREET PROPS
// ─────────────────────────────────────────────
const Bush = ({ left, theme }: { left: string; theme: string }) => {
  const isDay = theme === "day";
  return (
    <div className="absolute transform -translate-x-1/2 z-10" style={{ left, bottom: "25vh" }}>
      <div className="w-[9vw] min-w-[55px] max-w-[110px] aspect-[1.8] relative drop-shadow-lg">
        <div className={`absolute w-full h-full rounded-t-full bottom-0 ${isDay ? "bg-[#2e7d32]" : "bg-[#1a2548]"}`} />
        <div className={`absolute bottom-0 left-[15%] w-[70%] h-[75%] rounded-t-full ${isDay ? "bg-[#43a047]" : "bg-[#1e2e5a]"}`} />
        <div className={`absolute bottom-0 left-[25%] w-[50%] h-[50%] rounded-t-full ${isDay ? "bg-[#66bb6a]" : "bg-[#253570]"}`} />
      </div>
    </div>
  );
};

const TrafficLight = ({ left, state = "red", theme }: { left: string; state?: string; theme: string }) => {
  const isDay = theme === "day";
  return (
    <div className="absolute flex flex-col items-center z-20 transform -translate-x-1/2" style={{ left, bottom: "25vh" }}>
      <div className={`w-[40px] h-[100px] rounded-lg border-2 flex flex-col items-center justify-evenly z-10 relative transition-colors duration-1000 ${isDay ? "bg-[#374151] border-[#1f2937] shadow-xl" : "bg-[#2a2c3d] border-[#181926] shadow-2xl"}`}>
        <div className={`w-[16px] h-[16px] rounded-full transition-all duration-300 ${state === "red" ? "bg-[#ef4444] shadow-[0_0_15px_4px_#ef4444]" : "bg-[#7f1d1d] opacity-50"}`} />
        <div className={`w-[16px] h-[16px] rounded-full transition-all duration-300 ${state === "orange" ? "bg-[#ff8800] shadow-[0_0_15px_4px_#ff8800]" : "bg-[#7c3d00] opacity-50"}`} />
        <div className={`w-[16px] h-[16px] rounded-full transition-all duration-300 ${state === "green" ? "bg-[#22c55e] shadow-[0_0_15px_4px_#22c55e]" : "bg-[#14532d] opacity-50"}`} />
      </div>
      <div className={`w-[6px] h-[15vh] mt-[-10px] z-0 ${isDay ? "bg-[#4b5563]" : "bg-[#222333]"}`} />
    </div>
  );
};

const StreetLamp = ({ left, theme }: { left: string; theme: string }) => {
  const isDay = theme === "day";
  return (
    <div className="absolute flex flex-col items-center z-10 transform -translate-x-1/2" style={{ left, bottom: "25vh" }}>
      <div className="w-[70px] h-[220px] relative">
        <div className={`absolute bottom-0 right-[33px] w-[6px] h-[220px] ${isDay ? "bg-[#64748b]" : "bg-[#2a2838]"}`} />
        <div className={`absolute top-[30px] left-[2px] w-[16px] h-[16px] rounded-b-full z-20 ${isDay ? "bg-[#f8fafc]" : "bg-[#fff0d4] shadow-[0_0_60px_30px_rgba(255,200,80,0.7)]"}`} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BUS STOP SIGN (replaces the orange clickable box)
// ─────────────────────────────────────────────
const BusStopSign = ({
  left, text, isActive, onNavigate, theme,
}: { left: string; text: string; isActive: boolean; onNavigate: () => void; theme: string }) => {
  const isDay = theme === "day";
  return (
    <div className="absolute flex flex-col items-center z-30 transform -translate-x-1/2" style={{ left, bottom: "25vh" }}>
      <div className={`w-[28vw] min-w-[250px] max-w-[400px] h-[20vh] min-h-[120px] border-[6px] rounded-xl p-2 relative z-10 flex flex-col overflow-hidden transition-colors duration-1000 ${isDay ? "bg-[#1f2937] border-[#111827] shadow-[0_15px_30px_rgba(0,0,0,0.3)]" : "bg-[#1a2133] border-[#0f1421] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"}`}>
        <div className={`w-full h-full rounded border border-white/5 relative flex items-center justify-center ${isDay ? "bg-[#11141a]" : "bg-[#151926]"}`}>
          <AnimatePresence>
            {isActive ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                onClick={onNavigate}
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer z-20 outline-none"
              >
                <div className="text-[#E58A11] font-black text-2xl md:text-3xl text-center leading-tight drop-shadow-[0_0_15px_rgba(229,138,17,1)] tracking-widest uppercase">
                  {text.split("\n").map((line, i) => <div key={i} className="my-1">{line}</div>)}
                </div>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute bottom-2 text-[#E58A11] text-xs font-bold tracking-widest"
                >
                  Click Now
                </motion.div>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-tr ${isDay ? "from-[#0b0e12] to-[#1a212e]" : "from-[#0a0d14] to-[#1a2033]"}`}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-between w-[15vw] min-w-[150px] max-w-[250px] mt-[-10px] z-0">
        <div className={`w-[12px] h-[12vh] ${isDay ? "bg-[#374151]" : "bg-[#1e2336]"}`} />
        <div className={`w-[12px] h-[12vh] ${isDay ? "bg-[#374151]" : "bg-[#1e2336]"}`} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SMOKE PARTICLES
// ─────────────────────────────────────────────
interface Particle { id: string; delay: number; yOffset: number; xOffset: number; scale: number; }

const SmokeParticles = ({ trigger, theme }: { trigger: number; theme: string }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const isDay = theme === "day";

  useEffect(() => {
    if (!trigger) return;
    const newParticles: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `${trigger}-${i}`,
      delay: i * 0.04,
      yOffset: (Math.random() - 0.5) * 60,
      xOffset: (Math.random() - 0.5) * 80 - 50,
      scale: Math.random() * 2 + 0.5,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.map((n) => n.id).includes(p.id)));
    }, 2000);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="absolute left-[-10%] bottom-[10%] z-20">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0.2, opacity: 0, x: 0, y: 0 }}
            animate={{ scale: p.scale, opacity: [0, 0.7, 0], x: p.xOffset, y: p.yOffset - 30 }}
            transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
            className={`absolute w-[45px] h-[45px] rounded-full blur-[6px] ${isDay ? "bg-gray-200" : "bg-gray-400"}`}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// WHEEL
// ─────────────────────────────────────────────
const Wheel = ({ isSpinning, className }: { isSpinning: boolean; className?: string }) => (
  <motion.img
    src={wheelIconUrl}
    alt="wheel"
    draggable={false}
    animate={{ rotate: isSpinning ? 360 : 0 }}
    transition={{ duration: 1.2, ease: "linear", repeat: isSpinning ? Infinity : 0 }}
    className={`absolute pointer-events-none select-none ${className ?? ""}`}
  />
);

// ─────────────────────────────────────────────
// LEARNING MODAL (from Page.tsx)
// ─────────────────────────────────────────────
const LearningModal = ({
  isOpen,
  onClose,
  selectedModule,
  onStartLearning,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedModule: any;
  onStartLearning: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex md:items-baseline lg:items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#F0EFF0] rounded-lg shadow-xl p-1 md:p-4 max-w-2xl w-full mx-4"
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-gray-700">Tilbake til Modul 01</h1>
          <button
            onClick={onClose}
            className="hover:bg-red-300 rounded-md text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <X className="w-6 h-6 hover:text-red-500" />
          </button>
        </div>

        {/* Modal content */}
        <div className="mt-2">
          {/* Title block */}
          <div className="bg-white flex items-center space-x-2 w-fit py-3 px-2 rounded-br-[38px] rounded-tl-[38px]">
            <Image width={40} height={40} className="w-10 h-10" src={ImagemodalOne} alt="imag" />
            <h2 className="text-base md:text-xl font-bold text-[#E58A11]">
              {selectedModule?.title || "Internett-sikkerhet og trivsel - Modul 01"}
            </h2>
          </div>

          {/* Body */}
          <div className="bg-white mt-2 p-2 rounded-md">
            {/* Theme tag */}
            <div className="flex items-center space-x-2 bg-[#FFDFD2] p-2 rounded-xl w-fit">
              <FaLongArrowAltLeft className="text-black"/>
              <h1 className="text-black">{selectedModule?.theme || "Grunnleggende regler for oppførsel og sikkerhet på nett."}</h1>
            </div>

            {/* Video */}
            <div className="w-full px-1 py-2">
              <video className="w-full h-[315px] text-black rounded-lg" controls preload="metadata">
                <source src={selectedModule?.introVideo?.url} type="video/mp4" />
                Nettleseren din støtter ikke videotaggen.
              </video>
            </div>

            {/* Learning objectives */}
            <div>
              <div className="flex items-center space-x-2 py-1 rounded-xl w-fit">
                <Image className="w-7 h-7" src={tirProint} alt="imag" />
                <h1 className="mt-1 text-black">Læringsmål</h1>
              </div>
              {selectedModule?.learningObjectives && (
                <div className="ml-2">
                  {selectedModule.learningObjectives.map((obj: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 py-1 rounded-xl w-fit">
                      <Image className="w-6 h-6" src={Group} alt="imag" />
                      <h1 className="mt-1 text-black">{obj?.text}</h1>
                    </div>
                  ))}
                </div>
              )}

              {/* Start button */}
              <div className="flex gap-2 md:gap-4 py-2 justify-center">
                <button
                  onClick={onStartLearning}
                  className="flex items-center justify-center gap-2 bg-[#FF9E1C] hover:bg-[#e88c10] text-white font-semibold py-3 px-2 md:px-8 rounded-lg transition-colors duration-200 shadow-md"
                >
                  <FaStar className="text-xs md:text-xl" />
                  <span className="text-xs md:text-xl">Start læring</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function CarSceneMerged() {
  // ── Redux / routing ──
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get("childId");

  const [updateCheckPoints] = useUpdateCheckPointsMutation();

  // Fetch module data if not already in redux
  const { data } = useGetModulesByIdQuery("695b946312423eb787bb458d", {
    skip:
      selectedModule !== null &&
      selectedModule !== undefined &&
      Object.keys(selectedModule).length > 0,
  });

  useEffect(() => {
    if (
      (selectedModule === null || selectedModule === undefined || Object.keys(selectedModule).length === 0) &&
      data
    ) {
      dispatch(setSelectedModule(data.data));
    }
  }, [selectedModule, data, dispatch]);

  // ── Scene state ──
  const [theme, setTheme] = useState("night");
  const [carPhase, setCarPhase] = useState("idle");
  const [lightState, setLightState] = useState("red");
  const [smokeTrigger, setSmokeTrigger] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDay = theme === "day";

  // ── Car animation ──
  const handleStart = () => {
    if (carPhase !== "idle") return;
    setLightState("green");
    setTimeout(() => {
      setCarPhase("driving_out");
      setSmokeTrigger(Date.now());
      setTimeout(() => setIsFadingOut(true), 5000);
      setTimeout(() => {
        setCarPhase("black_screen");
        setTimeout(() => {
          setIsFadingOut(false);
          setCarPhase("driving_in");
          setTimeout(() => {
            setCarPhase("stopped");
            setSmokeTrigger(Date.now());
          }, 6000);
        }, 2500);
      }, 6000);
    }, 800);
  };

  const handleReset = () => {
    setCarPhase("idle");
    setLightState("red");
    setIsFadingOut(false);
    setIsModalOpen(false);
  };

  // Opens the modal (replaces the orange box click from Page.tsx)
  const handleBillboardClick = () => {
    setIsModalOpen(true);
  };

  // ── API: start learning ──
  const startLearningHandler = async () => {
    try {
      const introBody = { moduleNumber: 1, checkpoint: "intro_page", childProfileId: childId };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();

      const learningBody = { moduleNumber: 1, checkpoint: "learning_content", childProfileId: childId };
      const response = await updateCheckPoints({ updatesBody: learningBody }).unwrap();

      if (response?.code === 200) {
        router.push(`/LearningOne?childId=${childId}`);
      }
    } catch {
      toast.error("Feil ved oppdatering");
    }
  };

  // ── Car position ──
  let carX = "10%";
  let animDuration = 0;

  if (carPhase === "idle") { carX = "10%"; animDuration = 0; }
  else if (carPhase === "driving_out") { carX = "150%"; animDuration = 6; }
  else if (carPhase === "black_screen") { carX = "-50%"; animDuration = 0; }
  else if (carPhase === "driving_in") { carX = "78%"; animDuration = 6; }
  else if (carPhase === "stopped") { carX = "78%"; animDuration = 0; }

  const isSpinning = carPhase === "driving_out" || carPhase === "driving_in";

  const bgClasses = isDay
    ? "from-[#4facfe] via-[#81d4fa] to-[#e1f5fe] text-gray-900"
    : "from-[#1b1e52] via-[#2d3080] to-[#4848a8] text-white";

  return (
    <div className={`w-full h-screen overflow-hidden bg-gradient-to-b ${bgClasses} relative font-sans transition-colors duration-1000`}>

      {/* ── Back button (from Page.tsx) ── */}
      <div className="absolute top-4 left-4 z-50">
        <Button className="bg-[#FF9E1C] text-white font-semibold py-3">
          <Link href="/AddChildren" className="flex items-center">
            <ChevronLeft className="font-bold" /> Tilbake til Dashboard
          </Link>
        </Button>
      </div>

      {/* ── Theme & Config panel ── */}
      <div className="absolute top-6 right-6 z-50 flex gap-3 items-start">
        <button
          onClick={() => setTheme((prev) => (prev === "night" ? "day" : "night"))}
          className={`p-3 rounded-full border backdrop-blur-md transition-all shadow-lg ${isDay ? "bg-white/60 hover:bg-white/90 border-gray-300 text-gray-700" : "bg-black/40 hover:bg-black/60 border-white/20 text-white/80"}`}
          title={`Switch to ${isDay ? "Night" : "Day"} Mode`}
        >
          {isDay ? <Moon size={24} /> : <Sun size={24} />}
        </button>

      </div>

      {/* ── Cinematic black screen overlay ── */}
      <div
        className="fixed inset-0 bg-black z-[100] pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{ opacity: isFadingOut ? 1 : 0 }}
      />

      {/* ── Background layers ── */}
      <SkyElements theme={theme} />
      <Birds theme={theme} />
      <FarCity theme={theme} />

      {/* ── Trees ── */}
      <div className="absolute left-[0%] w-[420px]" style={{ bottom: "25vh" }}>
        <GeometricTree style={{ left: "0px", bottom: "0px" }} scale={1.3} theme={theme} />
        <GeometricTree style={{ left: "130px", bottom: "15px" }} scale={1.6} flip theme={theme} />
        <GeometricTree style={{ left: "280px", bottom: "-5px" }} scale={1.0} theme={theme} />
      </div>
      <div className="absolute left-[52%] w-[460px]" style={{ bottom: "25vh" }}>
        <GeometricTree style={{ left: "0px", bottom: "-10px" }} scale={1.7} flip theme={theme} />
        <GeometricTree style={{ left: "170px", bottom: "5px" }} scale={1.4} theme={theme} />
        <GeometricTree style={{ left: "320px", bottom: "-15px" }} scale={1.2} flip theme={theme} />
      </div>

      {/* ── Sidewalk props ── */}
      <Bush left="10%" theme={theme} />
      <TrafficLight left="27%" state={lightState} theme={theme} />
      <Bush left="38%" theme={theme} />
      <StreetLamp left="54%" theme={theme} />
      <Bush left="70%" theme={theme} />

      {/* ── Billboard (module sign) — click opens modal ── */}
      <BusStopSign
        left="86%"
        text={"Internett\nSikkerhet\n01"}
        isActive={carPhase === "stopped"}
        onNavigate={handleBillboardClick}
        theme={theme}
      />

      <StreetLamp left="98%" theme={theme} />

      {/* ── Ground: Sidewalk & Road ── */}
      <div className="absolute bottom-0 w-full h-[25vh]">
        <div className={`absolute top-0 w-full h-[10vh] bg-gradient-to-b transition-colors duration-1000 ${isDay ? "from-[#e2e8f0] to-[#cbd5e1]" : "from-[#38356a] to-[#252248]"}`} />
        <div className={`absolute bottom-0 w-full h-[15vh] z-0 shadow-[inset_0_10px_15px_-5px_rgba(0,0,0,0.2)] transition-colors duration-1000 ${isDay ? "bg-[#64748b]" : "bg-[#141420]"}`}>
          <div
            className="absolute top-[50%] w-full h-[6px] opacity-70"
            style={{ background: `repeating-linear-gradient(90deg, ${isDay ? "#e2e8f0" : "#3a3a5e"} 0, ${isDay ? "#e2e8f0" : "#3a3a5e"} 80px, transparent 80px, transparent 180px)` }}
          />
        </div>
      </div>

      {/* ── Car ── */}
      <motion.div
        initial={false}
        animate={{ left: carX }}
        transition={{ duration: animDuration, ease: "linear" }}
        className="absolute z-40 transform -translate-x-1/2 w-[22vw] min-w-[200px] max-w-[320px]"
        style={{ bottom: "6vh" }}
      >
        <div className="relative w-full h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={carImgSrc}
            className={`w-full h-auto drop-shadow-xl transition-opacity duration-1000 ${isDay ? "opacity-100" : "opacity-90"}`}
            alt="Car"
          />
          <SmokeParticles trigger={smokeTrigger} theme={theme} />
          <div
            className="absolute pointer-events-none"
            style={{ width: "27.06%", aspectRatio: "1", left: "27.45%", top: "81.34%", transform: "translate(-50%, -50%)" }}
          >
            <Wheel isSpinning={isSpinning} className="w-full h-full" />
          </div>
          <div
            className="absolute pointer-events-none"
            style={{ width: "26.9%", aspectRatio: "1", left: "68.78%", top: "81.42%", transform: "translate(-50%, -50%)" }}
          >
            <Wheel isSpinning={isSpinning} className="w-full h-full" />
          </div>
        </div>
      </motion.div>

      {/* ── UI Controls ── */}
      <AnimatePresence>
        {carPhase === "idle" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-[20%] inset-x-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <button
              onClick={handleStart}
              className={`pointer-events-auto flex items-center gap-3 px-10 py-4 font-black text-4xl rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] transform transition-all hover:scale-105 active:scale-95 tracking-widest cursor-pointer ${isDay ? "bg-[#22c55e] hover:bg-[#16a34a] text-white border-4 border-white" : "bg-gradient-to-r from-[#00e676] to-[#00b35c] text-white border border-white/40 shadow-[0_0_30px_rgba(0,230,118,0.5)]"}`}
            >
              <Play fill="currentColor" size={32} />
              START
            </button>
          </motion.div>
        )}

        {carPhase === "stopped" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-[8%] inset-x-0 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <button
              onClick={handleReset}
              className={`pointer-events-auto flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border ${isDay ? "bg-white hover:bg-gray-100 text-gray-800 border-gray-200" : "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/20"}`}
            >
              <RotateCcw size={18} />
              REPLAY JOURNEY
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Learning Modal (from Page.tsx) ── */}
      <AnimatePresence>
        {isModalOpen && (
          <LearningModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedModule={selectedModule}
            onStartLearning={startLearningHandler}
          />
        )}
      </AnimatePresence>
    </div>
  );
}