"use client"
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
const Page = () => {
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");
  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/LearningSeven?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 07</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              {" "}
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" />
              Hva gjør du nå?
            </p>
          </div>

          {/* Main Card */}
          <div className=" md:max-w-2xl mx-auto p-4 ">
            {/* Title */}
            <h1 className="text-lg md:text-xl xl:text-3xl font-bold  text-gray-900 text-center mb-3">
              Velkommen til Safety Hero-akademiet!
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600  text-center mb-8 ]">
              Du er i ferd med å bli en sikkerhetshelt! Ditt oppdrag er å hjelpe 4
              venner med å navigere i nettbaserte kriser ved å bruke din Sikkerhetsverktøykasse.
            </p>

            <div className="flex items-center justify-center mb-5 md:mb-10">
              <div className="bg-orange-100 rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Ditt oppdrag:
                </h3>
                <div className="">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <p className="text-gray-800 font-medium">
                        Hjelp venner gjennom 5 krisescenarioer
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💚</span>
                      <p className="text-gray-800 font-medium">
                        Hold hjelpemåleren høy (trygge og glade venner!)
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🧰</span>
                      <p className="text-gray-800 font-medium">
                        Bruk sikkerhetsverktøykassen din med omhu
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⭐</span>
                      <p className="text-gray-800 font-medium">
                        Få 420+ poeng for å låse opp quizen (60%)
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🏆</span>
                      <p className="text-gray-800 font-medium">
                        Nå Safety Champion-nivå (560+ poeng)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Link href={`/modulesSevenGame?childId=${childId}`}>
                <button className="px-2 md:px-5 bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                  <FaStar className="text-white" />
                  Start helttrening
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
