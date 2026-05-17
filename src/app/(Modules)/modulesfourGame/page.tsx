"use client";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Gamepad2, X } from "lucide-react";
import { FaStar } from "react-icons/fa";
import success from "@/assets/Modules/success.png";
import Image from "next/image";
import Link from "next/link";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ModuleFourCategory } from "@/types/moduleFour.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

const Page = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedStamps, setSelectedStamps] = useState<boolean[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showClue, setShowClue] = useState(false);
          const router = useRouter()
            const [updateCheckPoints] = useUpdateCheckPointsMutation();
             const startLeaningHanlder = async () => {
            try {
              const introBody = {
                moduleNumber:4,
                checkpoint: "interactive_task",
                childProfileId: childId,
              };
              await updateCheckPoints({ updatesBody: introBody }).unwrap();
              const learningBody = {
                moduleNumber:4,
                checkpoint: "quiz",
                childProfileId: childId,
                data:{
                  score:0,
                  passed:false
                }
              };
              const response = await updateCheckPoints({
                updatesBody: learningBody,
              }).unwrap();
              if (response?.code === 200) {
                router.push(`/modulesfourContinueQuizzes?childId=${childId}`);
              }
            } catch (error) {
              console.log(error)
            }
          };

  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();

  // Get scenarios from the API data
  const scenarios = useMemo(
    () => selectedModule?.interactiveTasks[0]?.config?.scenarios || [],
    [selectedModule]
  );
  const categories = useMemo(
    () => selectedModule?.interactiveTasks[0]?.config?.categories || [],
    [selectedModule]
  );
  const { data } = useGetModulesByIdQuery("69366b5cf4d0d2d1e21e1d5b", {
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

  // Initialize selectedStamps when categories change
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedStamps(Array(categories.length).fill(false));
    }
  }, [categories]);

  const handleSubmit = () => {
    const currentScenario = scenarios[currentCard];
    const selectedOptionIndex = selectedStamps.findIndex((stamp) => stamp);
    const selectedOption = currentScenario?.options[selectedOptionIndex];

    const correct = selectedOption?.isCorrect || false;

    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempts(totalAttempts + 1);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleStampClick = (index: number) => {
    // Create an array with the same length as categories
    const newStamps = Array(categories.length).fill(false);
    newStamps[index] = true;
    setSelectedStamps(newStamps);
  };

  const handleReset = () => {
    if (isCorrect) {
      const nextCard = currentCard + 1;
      if (nextCard < scenarios.length) {
        setCurrentCard(nextCard);
        setSelectedStamps(Array(categories.length).fill(false));
        setShowResult(false);
        setShowClue(false);
      } else {
        setShowSuccessModal(true);
      }
    } else {
      setSelectedStamps(Array(categories.length).fill(false));
      setShowResult(false);
      setShowClue(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const currentScenario = scenarios[currentCard];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-8">
        {/* Back Button */}
        <Link href={`/InteractiveGamefour?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 04</span>
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <Gamepad2 size={26} className="text-orange-400" />
            <p className="text-lg text-orange-800 font-medium">
              {selectedModule?.interactiveTasks[0]?.title || "Nyhetsdetektiv"}
            </p>
          </div>

          {/* Main Card */}
          <div className="max-w-2xl mx-auto">
            {!gameStarted ? (
              // Initial Screen with Stamps - Image 1
              <div className="space-y-6  mx-auto">
                <h2 className="text-lg font-semibold text-center  text-gray-800">
                  {selectedModule?.interactiveTasks[0]?.title ||
                    "Detektivstempel-sporing"}
                </h2>

                <p className="mb-6 text-center">
                  {selectedModule?.interactiveTasks[0]?.instructions ||
                    "Du har 4 spesielle stempler å bruke. Lær hva hvert enkelt betyr:"}
                </p>
                {/* Stamp Grid - Card style with borders */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {categories.map((category: ModuleFourCategory) => {
                    // Map category IDs to colors
                    const categoryColors: Record<string, string> = {
                      fact: "bg-green-500",
                      opinion: "bg-yellow-500",
                      ad: "bg-red-500",
                      check: "bg-blue-500",
                    };
                    const bgColor =
                      categoryColors[category.id] || "bg-gray-500";

                    return (
                      <div
                        key={category.id}
                        className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center"
                      >
                        <div
                          className={`${bgColor} text-white py-3 rounded-lg font-bold text-base mb-3`}
                        >
                          {category.name}
                        </div>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Timer Info - Peach/Light orange background */}
                <div className="bg-orange-50 border border-orange-300 rounded-md p-3 ">
                  <h1 className="font-bold">💡 Detektivtips :</h1>
                  Klikk på forstørrelsesglasset 🔍 på et hvilket som helst kort for å få ledetråder før du
                  stempler!
                </div>

                {/* Start Button - Bright orange */}
                <div className="flex justify-center">
                  <button
                    onClick={startGame}
                    className="px-2 flex items-center  md:px-5 bg-[#FF9E1C] text-white py-2.5 rounded-md font-medium hover:bg-[#FF9E1C] transition-colors text-sm"
                  >
                    <FaStar className="text-xl mr-1" /> Jeg er klar!
                    La oss detektere
                  </button>
                </div>
              </div>
            ) : !showResult ? (
              // Game Screen - Image 2
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Kort {currentCard + 1}/{scenarios.length}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${
                          ((currentCard + 1) / scenarios.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* News Card - Light mint/pale green */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {currentScenario?.situation}
                  </h3>
                </div>

                {/* Need A Clue Button */}
                <div className="text-center">
                  <button
                    onClick={() => setShowClue(!showClue)}
                    className="border border-[#6b6b6b67] w-full  text-black px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    🔍 Trenger du et hint?
                  </button>
                </div>

                {/* Clue Display - Shows below button when clicked */}
                {showClue && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentScenario?.hint}
                    </p>
                  </div>
                )}

                {/* Action Buttons - Same colors as initial screen */}
                <div
                  className={
                    categories.length === 4
                      ? "grid grid-cols-4 gap-3"
                      : categories.length === 3
                      ? "grid grid-cols-3 gap-3"
                      : categories.length === 2
                      ? "grid grid-cols-2 gap-3"
                      : "grid grid-cols-1 gap-3"
                  }
                >
                  {categories.map(
                    (category: ModuleFourCategory, index: number) => {
                      // Map category IDs to colors
                      const categoryColors: Record<string, string> = {
                        fact: "bg-green-500",
                        opinion: "bg-yellow-400",
                        ad: "bg-red-500",
                        check: "bg-blue-500",
                      };
                      const bgColor =
                        categoryColors[category.id] || "bg-gray-500";
                      const hoverColor =
                        category.id === "opinion"
                          ? "hover:bg-yellow-500"
                          : `hover:${bgColor.replace("bg-", "hover:bg-")}`;
                      const activeColor =
                        category.id === "opinion"
                          ? "bg-yellow-500"
                          : `${bgColor.replace("bg-", "bg-")}`;

                      return (
                        <button
                          key={category.id}
                          onClick={() => handleStampClick(index)}
                          className={`py-3 rounded-lg font-bold transition-all text-white ${
                            selectedStamps[index]
                              ? `${activeColor} shadow-lg scale-105`
                              : `${bgColor} ${hoverColor}`
                          }`}
                        >
                          {category.name}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedStamps.some((s) => s)}
                  className="w-full bg-[#FF9E1C] text-white py-3 rounded-lg font-bold hover:bg-[#FF9E1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Send et kort
                </button>
              </div>
            ) : (
              // Result Screen - Image 3 & 4
              <div className="space-y-6">
                {/* Progress Bar with Send Now button */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Kort {currentCard + 1}/{scenarios.length}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all"
                      style={{
                        width: `${
                          ((currentCard + 1) / scenarios.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <button className="bg-[#FF9E1C] text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-md">
                    Send nå
                  </button>
                </div>

                {/* News Card */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {currentScenario?.situation}
                  </h3>
                </div>

                {/* Result Message */}
                <div
                  className={`${
                    isCorrect
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  } border-2 rounded-lg p-6 text-center`}
                >
                  <h3
                    className={`text-2xl font-bold mb-3 ${
                      isCorrect ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? "Flott detektivarbeid!" : "Ikke helt..."}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isCorrect ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {(() => {
                      const selectedOptionIndex = selectedStamps.findIndex(
                        (stamp) => stamp
                      );
                      const selectedOption =
                        currentScenario?.options[selectedOptionIndex];
                      return (
                        selectedOption?.feedback ||
                        (isCorrect
                          ? "Du identifiserte nyheten riktig! Detektivferdighetene dine blir bedre. Fortsett for å tjene flere detektivpoeng!"
                          : "Denne slapp forbi deg, detektiv! Hver feil hjelper deg å lære. Prøv igjen for å skjerpe ferdighetene dine i å oppdage falske nyheter.")
                      );
                    })()}
                  </p>
                </div>

                {/* Reset/Next Button */}
                <button
                  onClick={handleReset}
                  className="w-full bg-[#FF9E1C] text-white py-3 rounded-lg font-bold hover:bg-[#FF9E1C] transition-colors shadow-md"
                >
                  {isCorrect
                    ? currentCard < scenarios.length - 1
                      ? "Neste kort"
                      : "Fullfør"
                    : "Tilbakestill"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal - Image 5 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            {/* Trophy/Truck Icon with confetti background */}
            <div className="mb-6 relative">
              <Image src={success} alt="success" />
              <p className="text-2xl font-bold text-green-600 mb-1">
                Endelig poengsum {score * 100} / {scenarios.length * 100}
              </p>
            </div>

            {/* Detective Rules Box - Peach/Light coral background */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 mb-6 text-left border border-orange-200">
              <h3 className="text-base font-bold text-orange-800 mb-4 flex items-center gap-2">
                📋 Detektivregler å huske:
              </h3>
              <ul className="space-y-3 text-sm text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold text-lg">•</span>
                  <span className="leading-relaxed">
                    Bekreft alltid kilden og at den er bevist sann
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold text-lg">•</span>
                  <span className="leading-relaxed">
                    Still spørsmål hvis vi ser 100 % eller raskt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold text-lg">•</span>
                  <span className="leading-relaxed">
                    Sjekk om en velrenommert organisasjon rapporterer om det (barnas valg)
                  </span>
                </li>
              </ul>
            </div>

            {/* Continue Button */}
            <div onClick={startLeaningHanlder}>
              <button className="bg-[#FF9E1C] flex items-center justify-center text-white px-8 py-3.5 rounded-full hover:bg-[#FF9E1C] transition-colors font-bold w-full shadow-lg text-base">
                <FaStar className="text-xl mr-2" /> Fortsett Quizzer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
