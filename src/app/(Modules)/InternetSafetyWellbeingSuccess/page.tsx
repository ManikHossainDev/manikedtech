"use client";
import { Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";

const Page = () => {
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");
  const childrenScore = searchParams.get("score");
  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/InternetSafetyWellbeing?childId=${childId}`}>
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
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" /> Venn,
              bekjent eller fremmed?
            </p>
          </div>

          {/* Main Card */}
          <div className=" md:max-w-lg mx-auto p-4 ">
            <div className="">
              <div className="w-full max-w-2xl bg-orange-50 rounded-3xl  p-3 md:p-12">
                {/* Shield Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500 rounded-full p-4 shadow-lg">
                    <FaShieldAlt className="text-white text-3xl" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Del 1 fullført! 🎉
                </h1>

                {/* Points */}
                <div className="text-center mb-8">
                  <p className="text-5xl md:text-6xl font-bold text-orange-400">
                    {(Number(childrenScore) as number) * 100}/800 poeng
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-pink-100 border-l-4 border-orange-300 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    💡 <strong>Husk:</strong> Del bare personlig
                    informasjon med nære venner og familie! Vær forsiktig med
                    bekjente, og del ALDRI private detaljer med
                    fremmede på nett!
                  </p>
                </div>

                {/* Start Button */}
                {Number(childrenScore) >= 6 ? (
                  <Link href={`/modulestowcorrectanswer?childId=${childId}`}>
                    <button className="w-full bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                      <Star className="text-white" fill="white" />
                      <span>Start utfordring del 2</span>
                    </button>
                  </Link>
                ) : (
                  <Link href={`/InternetSafetyWellbeing?childId=${childId}`}>
                    <button className="w-full bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                      <Star className="text-white" fill="white" />
                      <span>Fullfør del 1</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
