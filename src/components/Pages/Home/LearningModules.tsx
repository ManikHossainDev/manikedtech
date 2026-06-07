// "use client";
// import { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// import React from 'react';
// import Phonebasics from "@/assets/svg/Phonebasics.png"
// import PrivacyPasswords from "@/assets/svg/PrivacyPasswords.png"
// import Cyberbullying from "@/assets/svg/Cyberbullying.png"
// import Socialmedia from "@/assets/svg/Socialmedia.png"
// import Onlinesafety from "@/assets/svg/Onlinesafety.png"
// import Screentime from "@/assets/svg/Screentime.png"
// import Sharingphotos from "@/assets/svg/Sharingphotos.png"
// import Digitaljudgment from "@/assets/svg/Digitaljudgment.png"
// import Image from 'next/image';

// const LearningModules = () => {
//     useEffect(() => {
//     // Initialize AOS
//     AOS.init({
//       duration: 1000, // Animation duration in milliseconds
//       once: false, // Whether animation should happen only once
//       mirror: true, // Whether elements should animate out while scrolling past them
//       offset: 100, // Offset (in px) from the original trigger point
//       easing: 'ease-in-out', // Easing function
//     });

//     // Refresh AOS on component mount
//     return () => {
//       AOS.refresh();
//     };
//   }, []);

//   const modules = [
//     {
//       id: 1,
//       image: Phonebasics,
//       title: "Phone basics",
//       description: "Learn what to do when it doesn't work and how to use it safely",
//       duration: "15min"
//     },
//     {
//       id: 2,
//       image: PrivacyPasswords,
//       title: "Privacy & passwords",
//       description: "Understand the importance of strong passwords and privacy",
//       duration: "20min"
//     },
//     {
//       id: 3,
//       image: Cyberbullying,
//       title: "Cyberbullying",
//       description: "What is cyberbullying and what do you do if it happens?",
//       duration: "25min"
//     },
//     {
//       id: 4,
//       image: Socialmedia,
//       title: "Social media",
//       description: "Use social media safely and responsibly",
//       duration: "20min"
//     },
//     {
//       id: 5,
//       image: Onlinesafety,
//       title: "Online safety",
//       description: "Recognize online dangers and protect yourself",
//       duration: "20min"
//     },
//     {
//       id: 6,
//       image: Screentime,
//       title: "Screen time & balance",
//       description: "Find a healthy balance between screen time and other activities",
//       duration: "20min"
//     },
//     {
//       id: 7,
//       image: Sharingphotos,
//       title: "Sharing photos",
//       description: "Think before you share - learn about safe photo sharing",
//       duration: "15min"
//     },
//     {
//       id: 8,
//       image: Digitaljudgment,
//       title: "Digital judgment",
//       description: "Make smart choices online and be a good digital citizen",
//       duration: "20min"
//     }
//   ];

//   return (
//     <div id='Features' className="w-full xxl:container  mx-auto md:pt-[130px] pt-10 px-4 xl:px-0">
//       <div className='mb-8 xl:mb-12'>
//         <div className="flex items-center gap-1  justify-center">
//         <h2 className="text-md sm:text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
//           8 Exciting Learning Modules  
//         </h2>
//         <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
//       </div>
//       <h1 className='text-center md:pt-5 text-xs md:text-base lg:text-lg'>Each module contains videos, interactive activities, and quizzes tailored for children</h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//         {modules.map((module) => (
//           <div
//             data-aos="zoom-in-up"
//             key={module.id}
//             className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col"
//           >
//             <div className="w-14 h-14 mx-auto bg-gradient-to-br from-cyan-100 to-blue-100  rounded-xl flex items-center justify-center mb-4">
//               <Image src={module.image} alt={module.title} className="w-12 h-12" />
//             </div>
            
//             <h3 className="text-center text-base md:text-lg font-bold text-gray-900 mb-2">
//               {module.title}
//             </h3>
            
//             <p className="text-center text-xs md:text-[16px] text-gray-600 mb-4 flex-grow">
//               {module.description}
//             </p>

//             <div className="flex items-center justify-between pt-2">
//               <div className="flex items-center gap-1 text-gray-500">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span className="text-xs">{module.duration}</span>
//               </div>
              
//               <button className="bg-orange-400 hover:bg-[#FF9E1C] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
//                 {module.id} Module
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LearningModules;





"use client";
import { useEffect, useState } from 'react';
import AOS from 'aos';
// import 'aos/dist/aos.css';

import React from 'react';
import Phonebasics from "@/assets/svg/Phonebasics.png"
import PrivacyPasswords from "@/assets/svg/PrivacyPasswords.png"
import Cyberbullying from "@/assets/svg/Cyberbullying.png"
import Socialmedia from "@/assets/svg/Socialmedia.png"
import Onlinesafety from "@/assets/svg/Onlinesafety.png"
import Screentime from "@/assets/svg/Screentime.png"
import Sharingphotos from "@/assets/svg/Sharingphotos.png"
import Digitaljudgment from "@/assets/svg/Digitaljudgment.png"
import Image, { StaticImageData } from 'next/image';
import { LandingFeaturesSection } from '@/types/landing.types';

// Static images aligned with module index (moduleNo 1–8)
const staticImages: StaticImageData[] = [
  Phonebasics, PrivacyPasswords, Cyberbullying, Socialmedia,
  Onlinesafety, Screentime, Sharingphotos, Digitaljudgment,
];

// Hardcoded fallback module data
const hardcodedModules = [
  { id: 1, title: "Telefongrunnleggende", description: "Lær hva du gjør når den ikke fungerer, og hvordan du bruker den trygt", duration: "15min", longDescription: "I denne modulen skal barn lære grunnleggende smarttelefon-bruk. Vi dekker viktige emner som å starte telefonen på nytt når den fryser, batteristyring, tilkobling til Wi-Fi på en trygg måte og enkel feilsøking. Elevene lærer også om riktig telefonbruk, når de skal be om hjelp, og hvordan navigere enhetens innstillinger." },
  { id: 2, title: "Personvern og passord", description: "Forstå viktigheten av sterke passord og personvern", duration: "20min", longDescription: "Personvern er avgjørende i en digital verden. Denne modulen lærer barn å lage sterke, minnerike passord ved hjelp av teknikker som passordfraser. Elevene lærer hva slags informasjon som aldri skal deles på nett, inkludert adresser, telefonnumre og skolenavn." },
  { id: 3, title: "Nettmobbing", description: "Hva er nettmobbing og hva gjør du hvis det skjer?", duration: "25min", longDescription: "Nettmobbing er et alvorlig problem som påvirker mange unge. Denne modulen hjelper barn å gjenkjenne ulike former for nettmobbing, blant annet stygge meldinger, rykter, utestengelse og identitetstyveri. Vi gir konkrete tiltak for hva de kan gjøre om de opplever eller er vitne til nettmobbing." },
  { id: 4, title: "Sosiale medier", description: "Bruk sosiale medier trygt og ansvarlig", duration: "20min", longDescription: "Sosiale medier kan være morsomt og samlende, men krever ansvar. Denne modulen dekker alderstilpassede plattformer, personverninnstillinger og viktigheten av å tenke seg om før man legger ut noe." },
  { id: 5, title: "Nettsikkerhet", description: "Gjenkjenn nettfarer og beskytt deg selv", duration: "20min", longDescription: "Internett gir fantastiske muligheter, men inneholder også risikoer. Denne modulen lærer barn å gjenkjenne vanlige nettfarer, inkludert phishing-forsøk, mistenkelige lenker og upassende innhold." },
  { id: 6, title: "Skjermtid og balanse", description: "Finn en sunn balanse mellom skjermtid og andre aktiviteter", duration: "20min", longDescription: "Å finne balanse i det digitale livet er avgjørende for trivsel. Denne modulen hjelper barn å forstå hvordan for mye skjermtid kan påvirke søvn, humør, fysisk helse og relasjoner." },
  { id: 7, title: "Deling av bilder", description: "Tenk før du deler – lær om trygg bildedeling", duration: "15min", longDescription: "Bildedeling er en normal del av det digitale livet, men krever nøye ettertanke. Denne modulen lærer barn en «pause og tenk»-tilnærming før de legger ut eller sender bilder." },
  { id: 8, title: "Digitalt skjønn", description: "Ta smarte valg på nett og vær en god digital borger", duration: "20min", longDescription: "Å være en god digital borger betyr å ta ansvarlige valg på nett. Denne modulen hjelper barn å utvikle kritisk tenkning for å navigere den digitale verden." },
];

interface DisplayModule {
  id: number;
  image: StaticImageData;
  icon?: string;
  title: string;
  description: string;
  duration: string;
  longDescription: string;
}

interface LearningModulesProps {
  featuresData?: LandingFeaturesSection;
}

const LearningModules: React.FC<LearningModulesProps> = ({ featuresData }) => {
  const [selectedModule, setSelectedModule] = useState<DisplayModule | null>(null);

  const truncateDescription = (text: string, maxLength: number = 220) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}.....`;
  };

  const sectionTitle = featuresData?.sectionTitle || '8 spennende læringsmoduler';
  const sectionDescription = featuresData?.description || 'Hver modul inneholder videoer, interaktive aktiviteter og quizer tilpasset barn';

  // Build display modules from either API data or hardcoded fallback
  const modules: DisplayModule[] = (
    Array.isArray(featuresData?.items) && featuresData.items.length > 0
      ? featuresData.items.map((item) => ({
          id: item.moduleNo,
          image: staticImages[(item.moduleNo - 1) % 8] || Phonebasics,
          icon: item.icon || undefined,
          title: item.title,
          description: item.description,
          duration: item.time,
          longDescription: item.description, // API has single description field
        }))
      : hardcodedModules.map((m, i) => ({
          ...m,
          image: staticImages[i],
          icon: undefined,
        }))
  ).sort((a, b) => a.id - b.id);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true, offset: 100, easing: 'ease-in-out' });
    return () => { AOS.refresh(); };
  }, []);

  return (
    <div id='Features' className="w-full xxl:container mx-auto md:pt-[130px] pt-10 px-4 xl:px-0">
      <div className='mb-8 xl:mb-12'>
        <div className="flex items-center gap-1 justify-center">
          <h2 className="text-md sm:text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
            {sectionTitle}
          </h2>
        </div>
        <p className='text-center md:pt-5 text-xs md:text-base lg:text-lg'>{sectionDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {modules.map((module) => (
          <div
            data-aos="zoom-in-up"
            key={module.id}
            onClick={() => setSelectedModule(module)}
            className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
              {module.icon ? (
                <span className="text-3xl">{module.icon}</span>
              ) : (
                <Image src={module.image} alt={module.title} className="w-12 h-12" />
              )}
            </div>

            <h3 className="text-center text-base md:text-lg font-bold text-gray-900 mb-2">
              {module.title}
            </h3>

            <p className="text-center text-xs md:text-[16px] text-gray-600 mb-4 flex-grow">
              {truncateDescription(module.description)}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">{module.duration}</span>
              </div>
              <button className="bg-orange-400 hover:bg-[#FF9E1C] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                Modul {module.id}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedModule && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedModule(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-start justify-between rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {selectedModule.icon ? (
                    <span className="text-4xl">{selectedModule.icon}</span>
                  ) : (
                    <Image src={selectedModule.image} alt={selectedModule.title} className="w-10 h-10 sm:w-14 sm:h-14" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{selectedModule.duration}</span>
                    </div>
                    <span className="bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Modul {selectedModule.id}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Om denne modulen</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {selectedModule.longDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModules;
