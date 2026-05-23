"use client";
import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/champion.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { QuizOption } from "@/types/moduleOne.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import NavigateButton from "@/utils/NavigateButton";
import Link from "next/link";

const QuizApp = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();

  const router = useRouter()
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
   const startLeaningHanlder = async () => {
  try {
    const introBody = {
      moduleNumber: 1,
      checkpoint: "quiz",
      childProfileId: childId,
      data: {
          score:correctAnswers,
          passed:true,
      }
    };
    await updateCheckPoints({ updatesBody: introBody }).unwrap();
    const learningBody = {
      moduleNumber: 2,
      checkpoint: "intro_page",
      childProfileId: childId,
    };
    const response = await updateCheckPoints({
      updatesBody: learningBody,
    }).unwrap();
    if (response?.code === 200) {
      router.push(`/modulestow?childId=${childId}`);
    }
  } catch (error) {
    console.log(error)
  }
};

  // Check if selectedModule has data, if not fetch from API
  const { data } = useGetModulesByIdQuery("695b946312423eb787bb458d", {
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
      dispatch(setSelectedModule(data.data));
    }
  }, [selectedModule, data, dispatch]);

  const quizData = selectedModule?.quiz?.questions || [];

  const currentQuestion = quizData[currentModule - 1];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    // Reset explanation when a new answer is selected
    setShowExplanation(false);
    setIsCorrect(null);
  };

  const handleNext = () => {
    if (currentQuestion && selectedAnswer !== null) {
      const selectedOption = currentQuestion.options[selectedAnswer];
      const isAnswerCorrect = selectedOption.isCorrect;

      setIsCorrect(isAnswerCorrect);
      setShowExplanation(true);
      setAnswers({ ...answers, [currentModule]: selectedAnswer });

      if (currentModule === quizData.length) {
        setShowResult(true);
        setShowExplanation(false);
      } else {
        // Move to next question after showing explanation (longer delay for wrong answers)
        setTimeout(() => {
          setCurrentModule(currentModule + 1);
          setSelectedAnswer(null);
          setShowExplanation(false);
          setIsCorrect(null);
        }, isAnswerCorrect ? 200 : 1500);
      }
    }
  };

  const checkResults = () => {
    let correct = 0;
    Object.keys(answers).forEach((module) => {
      const idx = parseInt(module) - 1;
      if (quizData[idx]) {
        const selectedOption = quizData[idx].options[answers[module]];
        if (selectedOption && selectedOption.isCorrect) correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentModule(1);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResult(false);
  };

  const correctAnswers = checkResults();
  // console.log(correctAnswers)
  const totalQuestions = quizData.length;
  const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  // console.log(scorePercentage)
  const passingScore = selectedModule?.quiz?.passingScore; // Default to 75% if not specified
  // console.log(passingScore)
  const passed = scorePercentage >= passingScore;

  return (
    <div className="relative min-h-screen w-full xxl:container  mx-auto px-2 xl:px-0">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/Interacivegame?childId=${childId}`}>
        <button className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Tilbake til moduler
        </button>
        </Link>
      </div>

      {/* Quiz Card (Always visible) */}
      <div className="mx-auto bg-white rounded-2xl md:shadow-lg md:p-4 relative z-10">
        <div className="bg-orange-100 rounded-2xl p-4 flex w-fit items-center mb-3">
          <ArrowLeft size={20} className="text-orange-600 mr-3" />
          <span className="text-orange-800 font-medium">
            {selectedModule?.quiz?.title ||
              "Grunnleggende regler for oppførsel og sikkerhet på nett."}
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-4 py-2 mb-4">
            <span className="font-semibold text-gray-700">
              Svar {currentModule}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-600">Framgang</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentModule / quizData.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {currentModule}/{quizData.length}
            </span>
          </div>
        </div>

        <hr className="mb-6 border-gray-200" />

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentModule}. {currentQuestion?.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion?.options.map(
              (option: QuizOption, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-gray-700">{option.text}</span>
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          {selectedAnswer !== null && (
            <div className="flex-1 mr-4">
              {showExplanation && currentQuestion && (
                <p
                  className={`text-sm ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "✓ Riktig! " : "✗ Feil! "}
                  {currentQuestion.explanation}
                </p>
              )}
            </div>
          )}
          {selectedAnswer !== null && (
            <button
              onClick={handleNext}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors flex items-center gap-2"
            >
              Neste
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M6 3l5 5-5 5V3z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ✅ Overlay Modals */}
      {showResult && (
        <>
          {passed ? (
            // Success Modal
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                <button
                  onClick={resetQuiz}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3l font-bold text-orange-500 mb-2">
                  Modul fullført!
                </h2>
                <p className="text-gray-600 mb-6">
                  Du scoret {Math.round(scorePercentage)}% ({correctAnswers}/
                  {totalQuestions})!
                </p>
                {selectedModule?.parentTip?.content}
                <Image src={success} alt="success" />
                <div className="flex justify-between items-center">
                  <div>
                    <NavigateButton/>
                  </div>
                  <div onClick={startLeaningHanlder}>
                    <button className="mt-6 bg-[#FF9E1C] text-white px-3 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium">
                      Neste modul
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          ) : (
            // Error Modal
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                <button
                  onClick={resetQuiz}
                  className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
                >
                  Prøv igjen
                </button>
                <p className="text-gray-600 -mb-6 mt-5">
                  Du scoret {Math.round(scorePercentage)}% ({correctAnswers}/
                  {totalQuestions}). Trenger {passingScore}% for å bestå.
                </p>
                <Image src={error} alt="error" className="mx-auto mb-4" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizApp;
