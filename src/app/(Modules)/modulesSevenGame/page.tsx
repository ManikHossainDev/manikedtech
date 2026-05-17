/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import { X } from "lucide-react";
import ms from "@/assets/Modules/ms.png";
import fly from "@/assets/Modules/fly.png";
import Image from "next/image";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/success.png";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useSelector } from "react-redux";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

const Page = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [stage, setStage] = useState("start"); // start, problem, choice, result, completed
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [hideSituationText, setHideSituationText] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter();
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
  const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 7,
        checkpoint: "interactive_task",
        childProfileId: childId,
      };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();
      const learningBody = {
        moduleNumber: 7,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
          score: 0,
          passed: false,
        },
      };
      const response = await updateCheckPoints({
        updatesBody: learningBody,
      }).unwrap();
      if (response?.code === 200) {
        router.push(`/modulesSevenContinueQuizzes?childId=${childId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  // Get dynamic scenarios from API
  const scenarios =
    selectedModule?.interactiveTasks[0]?.config?.scenarios || [];

  // Check if selectedModule has data, if not fetch from API
  const { data } = useGetModulesByIdQuery("693670abf4d0d2d1e21e1d6d", {
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

  const handleStartGame = () => {
    setCurrentCase(0);
    setStage("problem");
    setSelectedChoice(null);
    setScore(0);
    setHideSituationText(false); // Reset the situation text visibility
  };

  const handleHelpClick = () => {
    setStage("choice");
    setHideSituationText(false);
  };

  const handleChoiceClick = (index: number) => {
    setSelectedChoice(index);

    // Check if choice is correct and update score
    const currentScenario = scenarios[currentCase];
    if (currentScenario && currentScenario.options[index]?.isCorrect) {
      setScore(score + 1);
    }

    setStage("result");
  };

  const handleNextCase = () => {
    if (currentCase < scenarios.length - 1) {
      setCurrentCase(currentCase + 1);
      setStage("problem");
      setSelectedChoice(null);
      setHideSituationText(false); // Reset the situation text visibility
    } else {
      // Game completed - show modal after a brief delay
      setTimeout(() => {
        // Calculate passing score based on 75% of total scenarios
        const passingScore = Math.ceil(scenarios.length * 0.75);
        if (score >= passingScore) {
          setShowSuccessModal(true);
        } else {
          setShowErrorModal(true);
        }
      }, 500);
      setStage("completed");
    }
  };

  const resetGame = () => {
    setCurrentCase(0);
    setStage("start");
    setSelectedChoice(null);
    setScore(0);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setHideSituationText(false); // Reset the situation text visibility
  };

  const currentData = scenarios[currentCase];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/InteractiveGameSeven?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors" translate="yes">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium" translate="yes">Tilbake til Modul 07</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3" translate="yes">
              <LuGamepad2 size={26} className="text-orange-400 mr-2" />
              {selectedModule?.interactiveTasks[0]?.title ||
                "Hva gjør du nå?"}
            </p>
          </div>

          {/* Main Card */}
          <div className="md:max-w-4xl mx-auto p-4">
            {stage === "start" && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800" translate="yes">
                  {selectedModule?.interactiveTasks[0]?.title ||
                    "Velkommen til Safety Hero-akademiet!"}
                </h2>
                <p className="text-gray-600 mb-8" translate="yes">
                  {selectedModule?.interactiveTasks[0]?.instructions ||
                    "Du er i ferd med å bli en sikkerhetshelt! Naviger i nettbaserte situasjoner for å bygge ferdighetene dine."}
                </p>

                {/* Icon Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-xs font-medium text-gray-700">
                      Skjermbilde
                    </p>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">🚫</div>
                    <p className="text-xs font-medium text-gray-700">
                      Blokker bruker
                    </p>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="text-xs font-medium text-gray-700">Rapporter</p>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2 flex justify-center">
                      <Image width={32} height={32} src={fly} alt="image" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Fortell voksen
                    </p>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2 flex justify-center">
                      <Image width={32} height={32} src={ms} alt="image" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      Svar vennlig
                    </p>
                  </div>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">🗑️</div>
                    <p className="text-xs font-medium text-gray-700">Slett</p>
                  </div>
                </div>

                {/* Safety Meter */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-left">
                    🎯 Hjelpemåler
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 text-left">
                    Dette viser hvor trygg vennen din føler seg. Valgene dine vil
                    få den til å gå opp eller ned!
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Mål: Hold måleren i det grønne! 😊
                  </p>
                </div>

                <button
                  onClick={handleStartGame}
                  className="px-8 bg-[#FF9E1C] hover:bg-yellow-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md mx-auto text-lg"
                  translate="yes"
                >
                  <FaStar className="text-white" />
                  Jeg er klar! La oss gå
                </button>
              </div>
            )}

            {stage === "problem" && (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600" translate="yes">
                    Saken {currentCase + 1} om {scenarios.length}
                  </span>
                  <button className="text-xs bg-[#FF9E1C] text-white px-4 py-1.5 rounded-full hover:bg-[#FF9E1C] font-medium" translate="yes">
                    Fullfør problem
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentCase + 1) / scenarios.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Character Alert */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded mb-6">
                  <p className="text-orange-800 font-semibold flex items-center text-sm" translate="yes">
                    <span className="mr-2">👤</span>
                    {currentData?.text ||
                      currentData?.situation?.substring(0, 30) + "..."}
                  </p>
                </div>

                {/* Three Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Problem Column */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base" translate="yes">
                      Problem
                    </h4>
                    <p className="text-sm text-gray-700" translate="yes">
                      {currentData?.situation}
                    </p>
                    {currentData?.hint && (
                      <p className="text-xs italic text-gray-600 mt-2" translate="yes">
                        {currentData?.hint}
                      </p>
                    )}
                    {stage === "problem" && (
                      <button
                        onClick={handleHelpClick}
                        className="w-full mt-5 bg-[#FF9E1C] hover:bg-yellow-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg text-sm"
                        translate="yes"
                      >
                        🤝 Hjelp {currentData?.text?.split(" ")[0] || "Friend"}
                      </button>
                    )}
                  </div>

                  {/* Choice Column - Empty */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h3 className="text-base font-bold text-gray-800 mb-3">
                      Valg
                    </h3>
                  </div>

                  {/* Result Column - Empty */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h3 className="text-base font-bold text-gray-800 mb-3">
                      Resultat
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {stage === "choice" && (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600" translate="yes">
                    Saken {currentCase + 1} om {scenarios.length}
                  </span>
                  <button className="text-xs bg-[#FF9E1C] text-white px-4 py-1.5 rounded-full hover:bg-[#FF9E1C] font-medium" translate="yes">
                    Fullfør problem
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentCase + 1) / scenarios.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Character Alert */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded mb-6">
                  <p className="text-orange-800 font-semibold flex items-center text-sm">
                    <span className="mr-2">👤</span>
                    {currentData?.text ||
                      currentData?.situation?.substring(0, 30) + "..."}
                  </p>
                </div>

                {/* Three Columns Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Problem Column */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Problem
                    </h4>
                    {!hideSituationText && (
                      <p className="text-sm text-gray-700">
                        {currentData?.situation}
                      </p>
                    )}
                    {currentData?.hint && !hideSituationText && (
                      <p className="text-xs italic text-gray-600 mt-2">
                        {currentData?.hint}
                      </p>
                    )}
                  </div>

                  {/* Choice Column */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base" translate="yes">
                      Ditt valg
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 font-medium" translate="yes">
                      Hva bør du gjøre?
                    </p>
                    <div className="space-y-2">
                      {currentData?.options?.map(
                        (option: any, index: number) => (
                          <button
                            key={option.id}
                            onClick={() => handleChoiceClick(index)}
                            className="w-full text-left px-3 py-2.5 bg-white border-2 border-gray-300 rounded-md hover:bg-orange-100 hover:border-orange-400 transition-colors text-sm font-medium"
                            translate="yes"
                          >
                            {option.text}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Result Column (Empty for now) */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Resultat
                    </h4>
                    <p className="text-sm text-gray-400 italic">
                      Gjør ditt valg for å se resultatet...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stage === "result" && (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600" translate="yes">
                    Saken {currentCase + 1} om {scenarios.length}
                  </span>
                  <button className="text-xs bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 font-medium" translate="yes">
                    Fortsett
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentCase + 1) / scenarios.length) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Character Alert */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded mb-6">
                  <p className="text-orange-800 font-semibold flex items-center text-sm">
                    <span className="mr-2">👤</span>
                    {currentData?.text ||
                      currentData?.situation?.substring(0, 30) + "..."}
                  </p>
                </div>

                {/* Three Columns Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Problem Column */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Problem
                    </h4>
                    {!hideSituationText && (
                      <p className="text-sm text-gray-700">
                        {currentData?.situation}
                      </p>
                    )}
                    {currentData?.hint && !hideSituationText && (
                      <p className="text-xs italic text-gray-600 mt-2">
                        {currentData?.hint}
                      </p>
                    )}
                  </div>

                  {/* Your Choice Column */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Ditt valg
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">
                      {selectedChoice !== null
                        ? currentData?.options?.[selectedChoice]?.text
                        : "Ingen valg valgt"}
                    </p>
                  </div>

                  {/* Result Column */}
                  <div
                    className={`bg-${
                      selectedChoice !== null &&
                      currentData?.options?.[selectedChoice]?.isCorrect
                        ? "green"
                        : "red"
                    }-50 border-2 ${
                      selectedChoice !== null &&
                      currentData?.options?.[selectedChoice]?.isCorrect
                        ? "border-green-300"
                        : "border-red-300"
                    } rounded-lg p-5`}
                  >
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Resultat
                    </h4>
                    <p
                      className={`text-sm font-bold ${
                        selectedChoice !== null &&
                        currentData?.options?.[selectedChoice]?.isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                      } mb-2`}
                    >
                      {selectedChoice !== null &&
                      currentData?.options?.[selectedChoice]?.isCorrect
                        ? "Godt valg!"
                        : "Ikke helt riktig"}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {selectedChoice !== null
                        ? currentData?.options?.[selectedChoice]?.feedback
                        : "Ingen valg valgt"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        ✅{" "}
                        {selectedChoice !== null &&
                        currentData?.options?.[selectedChoice]?.isCorrect
                          ? "Godt jobbet! Du tok et trygt valg."
                          : "Husk: Prioriter alltid sikkerhet og fortell det til en trygg voksen."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleNextCase}
                    className="px-8 bg-[#FF9E1C] hover:bg-yellow-600 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg text-base"
                    translate="yes"
                  >
                    ✅{" "}
                    {currentCase === scenarios.length - 1 ? "Fullfør" : "Neste"}
                  </button>
                </div>
              </div>
            )}

            {stage === "completed" && !showSuccessModal && !showErrorModal && (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600" translate="yes">
                    Saken {currentCase + 1} om {scenarios.length}
                  </span>
                  <button className="text-xs bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 font-medium" translate="yes">
                    Fullført
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: "100%" }}
                  ></div>
                </div>

                {/* Character Alert */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded mb-6">
                  <p className="text-orange-800 font-semibold flex items-center text-sm">
                    <span className="mr-2">👤</span>
                    {currentData?.text ||
                      currentData?.situation?.substring(0, 30) + "..."}
                  </p>
                </div>

                {/* Three Columns Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Problem Column */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Problem
                    </h4>
                    {!hideSituationText && (
                      <p className="text-sm text-gray-700">
                        {currentData?.situation}
                      </p>
                    )}
                    {currentData?.hint && !hideSituationText && (
                      <p className="text-xs italic text-gray-600 mt-2">
                        {currentData?.hint}
                      </p>
                    )}
                  </div>

                  {/* Your Choice Column */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Ditt valg
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">
                      {selectedChoice !== null
                        ? currentData?.options?.[selectedChoice]?.text
                        : "Ingen valg valgt"}
                    </p>
                  </div>

                  {/* Result Column */}
                  <div
                    className={`bg-${
                      selectedChoice !== null &&
                      currentData?.options?.[selectedChoice]?.isCorrect
                        ? "green"
                        : "red"
                    }-50 border-2 ${
                      selectedChoice !== null &&
                      currentData?.options?.[selectedChoice]?.isCorrect
                        ? "border-green-300"
                        : "border-red-300"
                    } rounded-lg p-5`}
                  >
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      Resultat
                    </h4>
                    <p
                      className={`text-sm font-bold ${
                        selectedChoice !== null &&
                        currentData?.options?.[selectedChoice]?.isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                      } mb-2`}
                    >
                      {selectedChoice !== null &&
                      currentData?.options?.[selectedChoice]?.isCorrect
                        ? "Godt valg!"
                        : "Ikke helt riktig!"}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {selectedChoice !== null
                        ? currentData?.options?.[selectedChoice]?.feedback
                        : "Ingen valg valgt"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        ✅{" "}
                        {selectedChoice !== null &&
                        currentData?.options?.[selectedChoice]?.isCorrect
                          ? "Godt jobbet! Du tok et trygt valg."
                          : "Husk: Prioriter alltid sikkerhet og fortell det til en trygg voksen."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 bg-[#0000008c]  flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>

                  <h2 className="text-3xl font-bold text-orange-500 mb-2">
                    Modul fullført!
                  </h2>
                  <p className="text-gray-600">Du lærte det veldig bra!</p>
                  <p className="text-2xl font-bold text-green-600 mt-4">
                    Poeng: {score}/{scenarios.length}
                  </p>

                  <div className="my-6">
                    <Image src={success} alt="success" />
                  </div>

                  <div onClick={startLeaningHanlder}>
                    <button className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C]">
                      Fortsett Quizzer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
              <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                  <h2 className="text-3xl font-bold text-red-500 mb-2">
                    Trenger mer øvelse!
                  </h2>
                  <p className="text-gray-600">Ikke bekymre deg, prøv igjen!</p>
                  <p className="text-2xl font-bold text-orange-600 mt-4">
                    Poeng: {score}/8
                  </p>

                  <div className="my-6">
                    <Image src={error} alt="error" />
                  </div>

                  <button
                    onClick={resetGame}
                    className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C]"
                  >
                    Prøv igjen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
