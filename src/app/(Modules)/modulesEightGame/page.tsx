/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable react/no-unescaped-entities */
import { FaArrowLeft, FaStar } from "react-icons/fa";
import tirProint from "@/assets/Modules/game.png";
import imageone from "@/assets/ParentTips/imageone.png";
import imagetow from "@/assets/ParentTips/imagetow.png";
import imagethree from "@/assets/ParentTips/imagethree.png";
import imagefour from "@/assets/ParentTips/imagefour.png";
import imagefive from "@/assets/ParentTips/imagefive.png";
import imagesix from "@/assets/ParentTips/Imagesix.png";
import Image from "next/image";
import Link from "next/link";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const id = "6936776976dca28d7e43e6c7";
  useGetModulesByIdQuery(id);

  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

const steps = [
    {
      number: 1,
      title: "Velg aktiviteter",
      description: "Velg aktivitetsikoner fra verktøykassen til klokken",
      borderColor: "border-orange-400",
    },
    {
      number: 2,
      title: "Fyll 24 timer",
      description:
        "Hver aktivitet tar opp et visst antall timer på klokken din",
      borderColor: "border-orange-400",
    },
    {
      number: 3,
      title: "Tjen merker",
      description: "Balanser dagen din godt for å tjene Helsehelt-merker!",
      borderColor: "border-orange-400",
    },
  ];

  const activities = [
    {
      icon: (
        <div className="w-19 h-16 flex items-center justify-center text-2xl">
          <Image src={imageone} alt="one" />
        </div>
      ),
      label: "10t",
    },
    {
      icon: (
        <div className="w-19 h-16 flex items-center justify-center text-2xl">
          <Image src={imagetow} alt="one" />
        </div>
      ),
      label: "6t",
    },
    {
      icon: (
        <div className="w-19 h-16 flex items-center justify-center text-2xl">
          <Image src={imagethree} alt="one" />
        </div>
      ),
      label: "3t",
    },
    {
      icon: (
        <div className="w-19 h-16 flex items-center justify-center text-2xl">
          <Image src={imagefour} alt="one" />
        </div>
      ),
      label: "3t",
    },
    {
      icon: (
        <div className="w-19 h-16 flex items-center justify-center text-2xl">
          <Image className="w-[70px] h-[90px]" src={imagefive} alt="one" />
        </div>
      ),
      label: "1t",
    },
    {
      icon: (
        <div className="w-19 h-16 flex items-center justify-center text-2xl">
          <Image src={imagesix} alt="one" />
        </div>
      ),
      label: "2t",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto mx-auto px-4 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="py-3 sm:py-4">
          <Link href={`/InteractiveGameEight?childId=${childId}`}>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Tilbake til Modul 08
              </span>
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-2 lg:p-4 md:bg-white md:shadow-md  md:rounded-3xl ">
          {/* Læringsinnhold Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex-shrink-0">
              <Image
                alt="Learning icon"
                src={tirProint}
                className="w-6 h-6 sm:w-8 sm:h-8"
                width={32}
                height={32}
              />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900">
              Hva gjør du nå?
            </h1>
          </div>

          <div className="md:max-w-3xl  mx-auto">
            {/* Title */}
            <h1 className="text-lg md:text-xl xl:text-3xl font-bold  text-gray-900 text-center mb-3">
              Slik spiller du
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600  text-center mb-8 ]">
              Følg disse enkle trinnene for å bygge din perfekte dag!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`bg-white rounded-lg border-2 border-[#383838] p-6`}
                >
                  <div className="text-center mb-4">
                    <span className="text-orange-500 font-bold text-4xl">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 mb-2 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-center text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Anbefalt daglig balanse
            </h2>

            <div className="bg-[#FFE7C8]/50 rounded-lg p-8 mb-5">
              <div className="grid grid-cols-3  gap-8">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center  justify-around gap-3 `}
                  >
                    <div className="flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <span className="text-base md:text-lg font-semibold text-gray-800">
                      {activity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Link href={`/modulesEightTime?childId=${childId}`}>
                <button className="bg-[#FF9E1C] hover:bg-[#FF9E1C] active:bg-orange-700 text-white font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors text-sm sm:text-base">
                  <FaStar className="w-4 h-4" />
                  La oss bygge dagen min
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Page;
