/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import Link from "next/link";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/success.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useDispatch } from "react-redux";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

const Page = () => {
  const [currentPart, setCurrentPart] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredParts, setAnsweredParts] = useState<Record<number, boolean>>(
    {}
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter()
        const [updateCheckPoints] = useUpdateCheckPointsMutation();
         const startLeaningHanlder = async () => {
        try {
          const introBody = {
            moduleNumber: 2,
            checkpoint: "interactive_task",
            childProfileId: childId,
          };
          await updateCheckPoints({ updatesBody: introBody }).unwrap();
          const learningBody = {
            moduleNumber: 2,
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
            router.push(`/modulestowContinueQuizzes?childId=${childId}`);
          }
        } catch (error) {
          console.log(error)
        }
      };

  // Define types based on API structure
  type Option = {
    id: string;
    text: string;
    feedback: string;
    isCorrect: boolean;
  };

  type Scenario = {
    id: string;
    text: string;
    situation: string;
    responses: any[];
    options: Option[];
  };

  type InteractiveTask = {
    config: {
      moodMeter: {
        states: any[];
      };
      categories: any[];
      scenarios: Scenario[];
      items: any[];
      friends: any[];
      components: any[];
      validationRules: any[];
      activityToolbox: any[];
      balanceTips: any[];
      badges: any[];
    };
    type: string;
    title: string;
    description: string;
    instructions: string;
    points: number;
  };

  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  // Check if selectedModule has data, if not fetch from API
  const { data } = useGetModulesByIdQuery("695e2fe8eaf052fd70aa958a", {
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

  // Extract the scenario-choice task from API data
  const interactiveTasks = selectedModule?.interactiveTasks || [];
  const scenarioTask = interactiveTasks.find(
    (task: any) => task.type === "scenario-choice"
  ) as InteractiveTask;
  const scenarios = scenarioTask?.config.scenarios || [];

  const currentScenario = scenarios[currentPart - 1];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    setShowFeedback(true);

    // Find the selected option to determine if it's correct
    const selectedOption = currentScenario?.options.find(
      (opt: any) => opt.text === selectedAnswer
    );
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect && !answeredParts[currentPart]) {
      const newScore = score + 1;
      setScore(newScore);
      setAnsweredParts({ ...answeredParts, [currentPart]: true });

      // Check if this is the last question and all are correct
      if (currentPart === scenarios.length && newScore === scenarios.length) {
        setTimeout(() => setShowSuccessModal(true), 1000);
      }
    } else if (!isCorrect && currentPart === scenarios.length) {
      // If last question is wrong, show error modal
      setTimeout(() => setShowErrorModal(true), 1000);
    }
  };

  const handleNext = () => {
    if (currentPart < scenarios.length) {
      setCurrentPart(currentPart + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      // Check final score when trying to go past last question
      if (score === scenarios.length) {
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    }
  };

  const handleBack = () => {
    if (currentPart > 1) {
      setCurrentPart(currentPart - 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    }
  };

  const resetGame = () => {
    setCurrentPart(1);
    setSelectedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setAnsweredParts({});
  };

  // const selectedOption = currentScenario?.options.find(
  //   (opt: any) => opt.text === selectedAnswer
  // );
  // const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/InternetSafetyWellbeingSuccess?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 02</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-8">
            <p className="text-md md:text-xl text-orange-800 flex items-center space-x-3">
              <LuGamepad2 size={26} className="text-orange-400 mr-2" />
              {scenarioTask?.title || "Personverninnstillinger - utfordring"}
            </p>
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full shadow">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-gray-700">
                Poeng: {score}/{scenarios.length || 3}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {scenarios.map((_, index) => {
              const part = index + 1;
              return (
                <div
                  key={part}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    part === currentPart
                      ? "bg-[#FF9E1C] text-white scale-110"
                      : part < currentPart
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {part < currentPart ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    part
                  )}
                </div>
              );
            })}
          </div>

          {/* Main Card */}
          <div className="md:max-w-lg mx-auto p-4 bg-[#ffdfd246] rounded-md border border-orange-300 mb-10">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm md:text-xl font-medium text-orange-600">
                  Del {currentPart}:{" "}
                  {scenarioTask?.title || "Personverninnstillinger - utfordring"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {currentScenario?.text || currentScenario?.situation}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentScenario?.options.map((option, index: number) => (
                <button
                  key={option.id || index}
                  onClick={() => handleAnswerSelect(option.text)}
                  disabled={showFeedback}
                  className={`w-full  text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === option.text
                      ? showFeedback
                        ? option.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                  } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      {option.text}
                    </span>
                    {showFeedback &&
                      selectedAnswer === option.text &&
                      (option.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {currentPart > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Tilbake
                </button>
              )}

              {!showFeedback ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    selectedAnswer
                      ? "bg-[#FF9E1C] text-white hover:bg-[#FF9E1C]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Send svar
                </button>
              ) : currentPart <= scenarios?.length ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-[#FF9E1C] text-white rounded-lg font-semibold hover:bg-[#FF9E1C] transition-colors"
                >
                  Neste utfordring
                </button>
              ) : (
                <div className="flex-1 text-center">
                  <button
                    onClick={() => setShowSuccessModal(true)}
                    className="bg-gradient-to-r bg-[#FF9E1C] text-white rounded-lg px-4 py-3"
                  >
                    <h3 className="text-xl font-bold">
                      Utfordring fullført! 🎉
                    </h3>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-orange-500 mb-2">
                Modul fullført!
              </h2>
              <p className="text-gray-600">Du lærte det veldig bra!</p>
               <p>{selectedModule?.parentTip?.content}</p>
            </div>
            <div className="mb-6">
              <Image src={success} alt="img" />
            </div>
            <div onClick={startLeaningHanlder}>
              <button className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium">
                Fortsett Quizzer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
            <div className="mb-6">
              <Image src={error} alt="error" />
            </div>
            <button
              onClick={() => {
                setShowErrorModal(false);
                resetGame();
              }}
              className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
            >
              Prøv igjen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
