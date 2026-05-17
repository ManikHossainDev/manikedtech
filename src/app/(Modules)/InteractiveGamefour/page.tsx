"use client"
import Link from "next/link";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import InteractiveGamefourprofile from "@/assets/Modules/InteractiveGamefourprofile.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
const Page = () => {
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");
  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/Learningfour?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 04</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              {" "}
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" />
              Nyhetsdetektiv
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
              Velkommen, detektiv!
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600  text-center mb-8 ]">
              Internett er fullt av forskjellige typer innhold. Ditt oppdrag
              er å bli en{" "}
              <span className="text-orange-400">Nyhetsdetektiv</span> og lære
              å skille dem fra hverandre!
            </p>

            <div className="bg-orange-100 rounded-2xl p-4 mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ditt oppdrag:
              </h2>
              <p className="text-gray-700 text-lg">
                Sorter gjennom 8 innholdsbiter på nettet ved å stemple hver enkelt
                riktig!
              </p>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Link href={`/modulesfourGame?childId=${childId}`}>
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
