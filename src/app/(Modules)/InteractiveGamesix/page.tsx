"use client";
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import InteractiveGamefourprofile from "@/assets/Modules/InteractiveGamefourprofile.png";
import mai from "@/assets/Modules/mai.png";
import gameicomsix from "@/assets/Modules/gameicomsix.png";
import futbolsix from "@/assets/Modules/futbolsix.png";
import editimage from "@/assets/Modules/editimage.png";
import Image from "next/image";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useSearchParams } from "next/navigation";
const Page = () => {
  // module id six
  const id = "69366f0df4d0d2d1e21e1d67";
  const { data } = useGetModulesByIdQuery(id);
  const interactiveTasks = data?.data?.interactiveTasks || [];
  const { title, description, instructions, points } =
    interactiveTasks[0] || {};

  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/Learningsix?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 06</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              {" "}
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" />
              {title}
            </p>
          </div>

          {/* Main Card */}
          <div className=" md:max-w-2xl mx-auto p-4 ">
            {/* Shield Icon */}
            <div className="flex justify-center mb-6">
              <Image
                src={InteractiveGamefourprofile}
                alt="Interactive game profile"
                width={80}
                height={80}
                className="w-16 h-16"
              />
            </div>

            {/* Title */}
            <h1 className="text-lg md:text-xl xl:text-3xl font-bold  text-gray-900 text-center mb-3">
              {title}
            </h1>

            <p className="w-full md:w-[80%] mx-auto text-gray-600 text-base  mb-2 ]">
              {description}
            </p>
            {/* Subtitle */}
            <p className="text-gray-600 text-xs text-center mb-2 ]">
              {instructions}
            </p>
            <p className="text-gray-600 text-xs text-center mb-8 ]">
              Møt vennene dine: {points} poeng hver
            </p>
            <div className="flex items-center justify-center mb-5 md:mb-10">
              <div className="bg-[#FF9E1C]/50 rounded-2xl p-6 max-w-md w-full">
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="flex items-center gap-2 bg-orange-300 p-4 rounded-lg">
                    <Image src={editimage} alt="Emma" width={24} height={24} />
                    <span>Emma</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-300 p-4 rounded-lg">
                    <Image src={futbolsix} alt="Noah" width={24} height={24} />
                    <span>Noah</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-300 p-4 rounded-lg">
                    <Image src={mai} alt="Mia" width={24} height={24} />
                    <span>Mia</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-300 p-4 rounded-lg">
                    <Image
                      src={gameicomsix}
                      alt="Alex"
                      width={24}
                      height={24}
                    />
                    <span>Alex</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Link href={`/InteractiveGamesixemoji?childId=${childId}`}>
                <button className="px-2 md:px-5 bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                  <FaStar className="text-white" />
                  Start detektivtrening
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
