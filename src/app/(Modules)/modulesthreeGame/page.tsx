"use client";
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { LuGamepad2 } from "react-icons/lu";
import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/success.png";
import { useSelector } from "react-redux";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useDispatch } from "react-redux";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

interface Option {
  id: string;
  text: string;
  feedback: string;
  isCorrect: boolean;
}

interface Scenario {
  id: string;
  text: string;
  situation: string;
  options: Option[];
}

const Page = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedOptionFeedback, setSelectedOptionFeedback] = useState<
    string | null
  >(null);

  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const router = useRouter()
          const [updateCheckPoints] = useUpdateCheckPointsMutation();
           const startLeaningHanlder = async () => {
          try {
            const introBody = {
              moduleNumber: 3,
              checkpoint: "interactive_task",
              childProfileId: childId,
            };
            await updateCheckPoints({ updatesBody: introBody }).unwrap();
            const learningBody = {
              moduleNumber: 3,
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
              router.push(`/modulesthreeContinueQuizzes?childId=${childId}`);
            }
          } catch (error) {
            console.log(error)
          }
        };

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

  // Get scenarios from the API data
  const scenarios: Scenario[] =
    selectedModule?.interactiveTasks?.[0]?.config?.scenarios || [];

  const currentScenario = scenarios[currentScenarioIndex];

  const resetGame = () => {
    setCurrentScenarioIndex(0);
    setSelectedOptionId(null);
    setTotalPoints(0);
    setShowResult(false);
    setShowErrorModal(false);
    setShowSuccessModal(false);
    setSelectedOptionFeedback(null);
  };

  const handleOptionClick = (optionId: string) => {
    if (!showResult) {
      setSelectedOptionId(optionId);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;

    // Show result immediately
    setShowResult(true);

    // Find the selected option
    const selectedOption = currentScenario.options.find(
      (opt) => opt.id === selectedOptionId
    );

    // Set the feedback for the selected option
    if (selectedOption) {
      setSelectedOptionFeedback(selectedOption.feedback);
    }

    // Update points if correct
    let newPoints = totalPoints;
    if (selectedOption?.isCorrect) {
      newPoints = totalPoints + 1;
      setTotalPoints(newPoints);
    }

    // Wait 1.5 seconds then move to next or show modal
    setTimeout(() => {
      if (currentScenarioIndex < scenarios.length - 1) {
        // Move to next scenario
        setCurrentScenarioIndex(currentScenarioIndex + 1);
        setSelectedOptionId(null);
        setShowResult(false);
        setSelectedOptionFeedback(null);
      } else {
        // Last scenario - show final modal
        setShowResult(false);
        setSelectedOptionFeedback(null);
        if (newPoints >= Math.ceil(scenarios.length * 0.6)) {
          // 60% threshold for success
          setShowSuccessModal(true);
        } else {
          setShowErrorModal(true);
        }
      }
    }, 1500);
  };

  const getOptionStyle = (optionId: string) => {
    const baseStyle =
      "w-full p-3 text-left border-2 rounded-lg transition-all duration-200 text-sm font-medium";
    const option = currentScenario.options.find((opt) => opt.id === optionId);

    // If result is showing
    if (showResult) {
      // Show correct answer in green
      if (option?.isCorrect) {
        return `${baseStyle} border-green-500 bg-green-100 text-green-800 cursor-default`;
      }
      // Show selected wrong answer in red
      if (selectedOptionId === optionId && !option?.isCorrect) {
        return `${baseStyle} border-red-500 bg-red-100 text-red-800 cursor-default`;
      }
      // Other options grayed out
      return `${baseStyle} border-gray-300 bg-gray-100 text-gray-500 cursor-default opacity-50`;
    }

    // Before showing result
    if (selectedOptionId === optionId) {
      return `${baseStyle} border-orange-500 bg-orange-100 text-orange-900 cursor-pointer`;
    }
    return `${baseStyle} border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50 cursor-pointer`;
  };

  const progressPercentage =
    ((currentScenarioIndex + 1) / scenarios.length) * 100;

  // If no scenarios are available, show a loading or error message
  if (scenarios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laster scenarioer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-5">
        {/* Back Button */}
        <Link href={`/InteractiveGamethree?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 03</span>
          </button>
        </Link>

        <div className="bg-[#FFFFFF] rounded-lg shadow-2xl p-2 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              <LuGamepad2 size={26} className="text-orange-400 mr-2" />
              {selectedModule?.interactiveTasks?.[0]?.title ||
                "Interaktivt spill"}
            </p>
          </div>

          {/* Main Card */}
          <div className="md:max-w-2xl mx-auto p-4">
            {/* Lock Icon */}
            <div className="flex justify-center mb-2">
              <div className="bg-orange-400 p-2 rounded">
                <FaLock className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-1">
              {selectedModule?.interactiveTasks?.[0]?.title ||
                "Interaktivt spill"}
            </h1>
            <p className="text-orange-400 text-center text-xs md:text-sm mb-6">
              {selectedModule?.interactiveTasks?.[0]?.description ||
                "Test kunnskapene dine"}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>
                  Scenario {currentScenarioIndex + 1} om {scenarios.length}
                </span>
                <button className="bg-orange-400 hover:bg-[#FF9E1C] text-white px-4 py-1.5 rounded-full text-xs font-medium">
                  Poeng: {totalPoints}
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-bold text-gray-800 mb-1 text-sm md:text-base">
                    {currentScenario.text}
                  </h2>
                  <p className="text-gray-700 text-xs md:text-sm">
                    {currentScenario.situation}
                  </p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {currentScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={showResult}
                  className={getOptionStyle(option.id)}
                >
                  {option.text}
                </button>
              ))}
            </div>

            {/* Feedback and Next Button */}
            <div className="flex flex-col items-center">
              {showResult && selectedOptionFeedback && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm w-full text-center ${
                    currentScenario.options.find(
                      (opt) => opt.id === selectedOptionId
                    )?.isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedOptionFeedback}
                </div>
              )}
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOptionId || showResult}
                className={`px-8 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  selectedOptionId && !showResult
                    ? "bg-orange-400 hover:bg-[#FF9E1C] text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentScenarioIndex < scenarios.length - 1
                  ? "⭐ Neste"
                  : "⭐ Sjekk svar"}
              </button>
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
              <p className="text-2xl font-bold text-green-600 mt-4">
                Poengsum: {totalPoints}/{scenarios.length}
              </p>
            </div>
            <div className="mb-6">
              <Image src={success} alt="success" />
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
              <h2 className="text-3xl font-bold text-red-500 mb-2">
                Trenger mer øvelse!
              </h2>
              <p className="text-gray-600">Ikke bekymre deg, prøv igjen!</p>
              <p className="text-2xl font-bold text-orange-600 mt-4">
                Poengsum: {totalPoints}/{scenarios.length}
              </p>
            </div>
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
