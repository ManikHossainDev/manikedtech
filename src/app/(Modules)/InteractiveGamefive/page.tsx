/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";

const Page = () => {
  const { data } = useGetModulesByIdQuery("69366d40f4d0d2d1e21e1d61");
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  const interactiveTasks = data?.data?.interactiveTasks || [];
  const config = interactiveTasks[0]?.config || {};
  const { title, description, instructions, points } =
    interactiveTasks[0] || {};
  const { categories = [] } = config;

  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/Learningfive?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 05</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              <LuGamepad2 size={26} className="text-orange-400 mr-2" />
              {title}
            </p>
          </div>

          {/* Main Card */}
          <div className="md:max-w-2xl mx-auto p-4">
            {/* Title */}
            <h1 className="text-lg md:text-xl xl:text-3xl font-bold text-gray-900 text-center mb-3">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-center mb-8">{description}</p>

            <div className="flex items-center justify-center mb-5 md:mb-10">
              <div className="bg-orange-100 rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Ditt oppdrag:
                </h3>

                <div className="space-y-3 text-gray-800">
                  <p className="text-sm text-center">{instructions}</p>

                  {categories.map((cat: any) => (
                    <p key={cat.id} className="text-sm flex items-start gap-2">
                      <span>👉</span>
                      <span>
                        <strong>{cat.name}</strong> — {cat.description}
                      </span>
                    </p>
                  ))}
                </div>

                <p className="text-sm text-center mt-4 font-semibold">
                  ⭐ Poeng: {points}
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Link href={`/modulesfiveGame?childId=${childId}`}>
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
