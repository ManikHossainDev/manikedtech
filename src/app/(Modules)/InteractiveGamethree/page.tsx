"use client";

import Link from "next/link";
import { FaArrowLeft, FaShieldAlt, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import { Target, Hand, BarChart3, Star } from "lucide-react";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useEffect } from "react";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
const Page = () => {
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  // Check if selectedModule has data, if not fetch from API
  const { data } = useGetModulesByIdQuery("6936619e511d202f50100576", {
    skip:
      selectedModule !== null &&
      selectedModule !== undefined &&
      Object.keys(selectedModule).length > 0,
  });
  useEffect(() => {
    if (
      (selectedModule === null ||
        selectedModule === undefined ||
        Object.keys(selectedModule).length === 0) &&
      data
    ) {
      dispatch(setSelectedModule(data.data)); // Set the data.data object into selectedModule
    }
  }, [selectedModule, data, dispatch]);

const steps = [
    {
      icon: Target,
      text: "Møt 6 virkelige nettmobbingscenarioer",
      color: "text-red-500",
    },
    {
      icon: Hand,
      text: "Velg det beste svaret for hver situasjon",
      color: "text-yellow-500",
    },
    {
      icon: BarChart3,
      text: "Tjen poeng for å utvikle skjoldet ditt fra 🥚 til 🛡️",
      color: "text-green-500",
    },
    {
      icon: Star,
      text: "Få 60%+ for å låse opp quizen og tjene stjerner!",
      color: "text-yellow-500",
    },
  ];
  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/Learningthree?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 03</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              {" "}
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" /> The
              Passordmonster
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
              Skjoldbyggeren
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600  text-center mb-8 ]">
              Bygg ditt ultimate beskyttelsesskjold ved å ta smarte valg i
              nettmobbingsituasjoner!
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Slik fungerer det
            </h2>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`${step.color} flex-shrink-0`}>
                    <step.icon size={20} />
                  </div>
                  <p className="text-gray-800 text-base">{step.text}</p>
                </div>
              ))}
            </div>

            <br />

            {/* Start Button */}
            <Link href={`/modulesthreeGame?childId=${childId}`}>
              <button className="w-full bg-[#FF9E1C] hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                <FaStar className="text-white" />
                Start å bygge skjoldet ditt
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
