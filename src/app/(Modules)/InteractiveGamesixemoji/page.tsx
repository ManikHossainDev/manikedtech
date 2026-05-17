/* eslint-disable react/no-unescaped-entities */
"use client"
import Link from "next/link";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import InteractiveGamefourprofile from "@/assets/Modules/InteractiveGamefourprofile1.png";
import succesmodal from "@/assets/Modules/succesmodal.png";
import midlevelmodal from "@/assets/Modules/midlevelmodal.png";
import errormodal from "@/assets/Modules/errormodal.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
const Page = () => {
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/InteractiveGamesix?childId=${childId}`}>
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
              Chat Simulator
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
              Emoji-humørmåler
            </h1>
            {/* Subtitle */}
            <p className="w-full md:w-[80%] mx-auto text-gray-600 text-base  text-center mb-2 ]">
              Hver chat-gruppe har en stemning. Valgene dine kan gjøre vennene:
            </p>
            <div className="flex items-center justify-center mb-5 md:mb-10">
              <div className="bg-[#FF9E1C]/50 rounded-2xl p-6 max-w-md w-full">
                <div className="flex justify-around items-center">
                  {/* Happy */}
                  <div className="flex flex-col items-center gap-2 md:gap-4">
                    <Image
                      src={succesmodal}
                      alt="Happy emotion"
                      className="w-20 h-20 object-contain transition-transform hover:scale-110 duration-300"
                      width={80}
                      height={80}
                    />
                    <span className="text-base font-medium text-gray-800">
                      Glad
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="text-2xl text-gray-700 -mt-6">→</div>

                  {/* Neutral */}
                  <div className="flex flex-col items-center gap-2 md:gap-4">
                    <Image
                      src={midlevelmodal}
                      alt="Neutral emotion"
                      className="w-20 h-20 object-contain transition-transform hover:scale-110 duration-300"
                      width={80}
                      height={80}
                    />
                    <span className="text-base font-medium text-gray-800">
                      Nøytral
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="text-2xl text-gray-700 -mt-6">→</div>

                  {/* Angry */}
                  <div className="flex flex-col items-center gap-2 md:gap-4">
                    <Image
                      src={errormodal}
                      alt="Angry emotion"
                      className="w-20 h-20 object-contain transition-transform hover:scale-110 duration-300"
                      width={80}
                      height={80}
                    />
                    <span className="text-base font-medium text-gray-800">
                      Sint
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Link href={`/modulesSixGame?childId=${childId}`}>
                <button className="px-2 md:px-5 bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                  <FaStar className="text-white" />
                  Start chat
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
