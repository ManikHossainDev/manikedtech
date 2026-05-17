/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { FaArrowLeft, FaStar, FaGamepad } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/success.png";
import errorgame from "@/assets/ParentTips/errorgame.png";
import succesgame from "@/assets/ParentTips/succesgame.png";
import { CgClose } from "react-icons/cg";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

const Page = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

               const router = useRouter()
                const [updateCheckPoints] = useUpdateCheckPointsMutation();
                 const startLeaningHanlder = async () => {
                try {
                  const introBody = {
                    moduleNumber:6,
                    checkpoint: "interactive_task",
                    childProfileId: childId,
                  };
                  await updateCheckPoints({ updatesBody: introBody }).unwrap();
                  const learningBody = {
                    moduleNumber:6,
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
                    router.push(`/modulesSixContinueQuizzes?childId=${childId}`);
                  }
                } catch (error) {
                  console.log(error)
                }
              };

  // module id six
  const id = "69366f0df4d0d2d1e21e1d67";
  const { data, isLoading, isError } = useGetModulesByIdQuery(id);
  const scenariosData = data?.data?.interactiveTasks[0]?.config?.scenarios;

  // Transform API data to match UI expectations
  const scenarios =
    scenariosData?.map((scenario: any) => ({
      id: scenario.id,
      character: scenario.text || "Venn", // Using the scenario text as character name
      message: scenario.situation,
      question: scenario.text,
      options:
        scenario.responses?.map((response: any) => ({
          text: response.text,
          correct: response.isCorrect,
        })) || [],
      feedback: {
        correct:
          scenario.responses?.find((r: any) => r.isCorrect)?.feedback ||
          "Riktig svar!",
        incorrect:
          scenario.responses?.find((r: any) => !r.isCorrect)?.feedback ||
          "Feil svar.",
      },
      hint: scenario.hint,
    })) || [];

  const scenario = scenarios[currentCase];
  const progress =
    scenarios.length > 0 ? ((currentCase + 1) / scenarios.length) * 100 : 0;

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (scenario.options[index]?.correct) {
      setScore(score + 1);
    }
  };

  const resetGame = () => {
    setCurrentCase(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    if (currentCase < scenarios.length - 1) {
      setCurrentCase(currentCase + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const finalScore =
        score + (scenario.options[selectedOption!]?.correct ? 1 : 0);
      if (
        scenarios.length > 0 &&
        finalScore >= Math.ceil(scenarios.length * 0.7)
      )
        setShowSuccessModal(true);
      else setShowErrorModal(true);
    }
  };

  const isCorrect =
    selectedOption !== null && scenario.options[selectedOption]?.correct;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laster spill-scenarioer...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Feil ved lasting av spill
          </h2>
          <p className="text-gray-600 mb-4">
            Det oppsto et problem med lasting av spill-scenarioene. Vennligst prøv igjen
            senere.
          </p>
          <Link href={`/InteractiveGamesixemoji?childId=${childId}`}>
            <button className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-[#FF9E1C]">
              Tilbake til modul
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        <Link href={`/InteractiveGamesixemoji?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 06</span>
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-2xl p-2 md:p-5">
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              <FaGamepad size={26} className="text-orange-400 mr-2" />
              Chat Simulator
            </p>
          </div>

          <div className="md:max-w-2xl mx-auto p-4">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Sak {currentCase + 1}/{scenarios.length}
                </span>
                <span className="text-sm font-semibold text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
                  Poeng: {score} poeng
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Chat Message from Alex */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                  <FaGamepad size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1 text-xs">
                    {scenario.character}
                  </p>
                  <div className="bg-gray-200 rounded-2xl rounded-tl-none p-3 inline-block max-w-[80%]">
                    <p className="text-gray-900 text-sm">{scenario.message}</p>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 ml-1 italic">
                    {scenario.character} skriver...
                  </p>
                </div>
              </div>
            </div>

            {/* Question section */}
            <p className="text-center font-semibold text-gray-700 mb-4 text-sm">
              {!showFeedback && selectedOption === null
                ? "Velg ditt svar"
                : ""}
            </p>

            {/* Options - Uniform Chat Bubbles */}
            <div className="space-y-3 mb-6">
              {scenario.options.map((option: any, index: number) => (
                <div key={index}>
                  {/* Hide other options once one is selected */}
                  {!showFeedback &&
                    selectedOption !== null &&
                    selectedOption !== index && (
                      <div className="hidden"></div> // Hide the unselected options
                    )}

                  {/* Show options until one is selected */}
                  {!showFeedback && selectedOption === null && (
                    <button
                      onClick={() => handleOptionSelect(index)}
                      disabled={showFeedback}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all ${
                        selectedOption === index
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white border-2 border-gray-200 text-gray-800 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {option.text}
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Show selected answer as sent message below the selected option */}
                  {selectedOption === index && selectedOption !== null && (
                    <div className="mt-3 flex justify-end animate-fadeIn">
                      <div className=" bg-[#3090bde0] text-white rounded-2xl rounded-tr-none p-3 inline-block max-w-[80%] shadow-sm">
                        <p className="text-sm font-medium">{option.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Feedback - Displaying feedback next to the selected option */}
                  {selectedOption === index && showFeedback && (
                    <div className="mt-3 animate-fadeIn">
                      <div
                        className={` ${
                          isCorrect
                            ? "bg-[#12B347]/15 text-green-500"
                            : "bg-[#FFD1CA] text-red-500"
                        } rounded-b-2xl rounded-tr-2xl p-3 inline-block max-w-[80%] shadow-sm`}
                      >
                        <p className="font-semibold mb-1  text-sm">
                          {isCorrect ? (
                            <div>
                              <div className="flex justify-center py-2">
                                <Image
                                  width={40}
                                  height={40}
                                  src={succesgame}
                                  alt="game"
                                />
                              </div>
                              <div className="flex items-center ">
                                <span className="font-semibold">
                                  Flott svar!
                                </span>{" "}
                                🎉
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-center py-2">
                                <Image
                                  width={40}
                                  height={40}
                                  src={errorgame}
                                  alt="game"
                                />
                              </div>
                              <div className="flex items-center ">
                                {" "}
                                <span className="font-semibold">
                                  Ikke helt...
                                </span>{" "}
                                <CgClose size={20} className="text-red-500" />{" "}
                              </div>
                            </div>
                          )}
                        </p>
                        <p className=" text-sm ">
                          {isCorrect
                            ? scenario.feedback.correct
                            : scenario.feedback.incorrect}
                        </p>
                        <p className=" text-sm ">
                          {isCorrect ? (
                            <div className="">
                              {" "}
                              <span className="font-bold text-green-500">
                                Læring :{" "}
                              </span>{" "}
                              {scenario.hint ||
                                "Det er greit å være uenig på en respektfull måte"}
                            </div>
                          ) : (
                            <div className="">
                              <span className="font-bold text-red-500">
                                Læring :{" "}
                              </span>{" "}
                              {scenario.hint ||
                                "Det er greit å være uenig på en respektfull måte"}
                            </div>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* NEXT BUTTON */}
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                selectedOption === null
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-400 hover:bg-[#FF9E1C]"
              }`}
            >
              <FaStar className="w-4 h-4" />
              Neste
            </button>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-[#00000059] bg-opacity-95 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <IoMdClose size={24} />
                </button>

                <h2 className="text-3xl font-bold text-orange-500 mb-2">
                  Modul fullført!
                </h2>
                <p className="text-gray-600">Du lærte det veldig bra!</p>
                <p className="text-2xl font-bold text-green-600 mt-4">
                  poeng:{" "}
                  {score}
                  {" "}
                  / {scenarios.length}
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
                  poeng:{" "}
                  {score}
                  {" "}
                  / {scenarios.length}
                </p>

                <div className="my-6">
                  <Image src={error} alt="error" />
                </div>

                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    resetGame();
                  }}
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
  );
};

export default Page;
