"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaUser,
  FaLock,
  FaStar,
} from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";

const Page = () => {
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/Learningtow?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 02</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              {" "}
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" /> Venn, bekjent eller fremmed?
            </p>
          </div>

          {/* Main Card */}
          <div className=" md:max-w-lg mx-auto p-4 ">
            {/* Shield Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 rounded-full p-4">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-lg md:text-xl xl:text-3xl font-bold  text-gray-900 text-center mb-3">
              Personvern- og sikkerhetsutfordring!
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600  text-center mb-8">
              Dette spillet har to deler for å hjelpe deg å holde deg trygg på nettet:
            </p>

            {/* Challenge Parts */}
            <div className="space-y-6 mb-8 md:px-10">
              {/* Part 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-gray-100 rounded-full p-3">
                    <FaUser className="text-gray-700 text-lg hidden md:block" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Del 1: Hvem kan du stole på?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sorter personer i Venn, Bekjent eller Fremmed
                  </p>
                </div>
              </div>

              {/* Part 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-gray-100 rounded-full p-3">
                    <FaLock className="text-gray-700 text-lg hidden md:block" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Del 2: Personverninnstillinger
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ta de riktige valgene for å beskytte deg selv på nettet
                  </p>
                </div>
              </div>
            </div>


            {/* Start Button */}
            <Link href={`/InternetSafetyWellbeing?childId=${childId}`}>
              <button className="w-full bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                <FaStar className="text-white" />
                Start utfordring
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
