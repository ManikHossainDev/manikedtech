"use client";
import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/champion.png";
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
import NavigateButton from "@/utils/NavigateButton";
import Link from "next/link";

// Define types based on API structure
type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  questionNumber: number;
  type: string;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
  points: number;
};

type Quiz = {
  title: string;
  description: string;
  passingScore: number;
  questions: Question[];
  totalPoints: number;
  allowRetake: boolean;
  showCorrectAnswers: boolean;
};

const Page = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter()
    const [updateCheckPoints] = useUpdateCheckPointsMutation();
    const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 2,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
            score: correctAnswers,
            passed: passed,
        }
      };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();
      const learningBody = {
        moduleNumber: 3,
        checkpoint: "intro_page",
        childProfileId: childId,
      };
      const response = await updateCheckPoints({
        updatesBody: learningBody,
      }).unwrap();
      if (response?.code === 200) {
        router.push(`/modulesthree?childId=${childId}`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  // Extract quiz data from API
  const quizData: Quiz | undefined = selectedModule?.quiz;
  const questions = quizData?.questions || [];

  const currentQuestion = questions[currentModule - 1];

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    // Don't set correctness until next button is clicked
  };

  const handleNext = () => {
    if (selectedAnswer) {
      // Determine if the selected answer is correct
      const selectedOption = currentQuestion?.options.find(
        (opt) => opt.id === selectedAnswer
      );
      setIsAnswerCorrect(selectedOption?.isCorrect ?? false);

      setAnswers({ ...answers, [currentModule]: selectedAnswer });
      setShowFeedback(true); // Show feedback immediately after clicking next

      // Set auto-advance to true to trigger the useEffect
      setAutoAdvance(true);
    }
  };

  const checkResults = () => {
    let correct = 0;
    Object.keys(answers).forEach((module) => {
      const idx = parseInt(module) - 1;
      const question = questions[idx];
      if (question && answers[module] === question.correctAnswer) correct++;
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentModule(1);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResult(false);
    setIsAnswerCorrect(null);
  };

  const correctAnswers = checkResults();
  const totalQuestions = questions.length;
  const passingPercentage = 80; // 80% required to pass
  const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const passed = scorePercentage >= passingPercentage;
  
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

  // Effect to handle auto-advancing after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let countdownTimer: NodeJS.Timeout | null = null;

    if (autoAdvance && showFeedback) {
      countdownTimer = setInterval(() => {}, 1000);

      // Set the main timer to advance after 3 seconds
      timer = setTimeout(() => {
        if (currentModule === questions.length) {
          setShowResult(true);
        } else {
          // Move to next question
          setCurrentModule(currentModule + 1);
          setSelectedAnswer(null);
          setIsAnswerCorrect(null);
          setShowFeedback(false);
        }
        setAutoAdvance(false); // Reset auto-advance
      }, 1000); // 3 seconds
    }

    // Cleanup function - always runs
    return () => {
      if (timer) clearTimeout(timer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [autoAdvance, showFeedback, currentModule, questions.length]);

  // Handle loading state
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Laster quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-2 xl:px-0 w-full xxl:container  mx-auto">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/modulestowcorrectanswer?childId=${childId}`}>
         <button className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
           <ArrowLeft size={20} className="mr-2" />
           Tilbake til moduler
         </button>
        </Link>
      </div>

      {/* Quiz Card (Always visible) */}
      <div className="mx-auto bg-white rounded-2xl shadow-lg md:p-4 relative z-10">
        <div className="bg-orange-100 rounded-2xl p-4 flex w-fit items-center mb-3">
          <ArrowLeft size={20} className="text-orange-600 mr-3" />
          <span className="text-orange-800 font-medium">
            {quizData?.description ||
              "Grunnleggende regler for oppførsel og sikkerhet på nett."}
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-4 py-2 mb-4">
            <span className="font-semibold text-gray-700">
              Spørsmål {currentModule}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-600">Framgang</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentModule / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {currentModule}/{questions.length}
            </span>
          </div>
        </div>

        <hr className="mb-6 border-gray-200" />

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion?.questionNumber}. {currentQuestion?.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === option.id
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-gray-700">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* Error/Success Message - only show after clicking next */}
          {showFeedback && isAnswerCorrect !== null && (
            <div
              className={`flex items-center ${
                isAnswerCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAnswerCorrect ? (
                <span className="font-medium">✓ Riktig!</span>
              ) : (
                <span className="font-medium">
                  ✗ Feil! Vennligst sjekk svaret ditt.
                </span>
              )}
            </div>
          )}

          <div className="ml-auto">
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
                <h2 className="text-3xl font-bold text-orange-500 mb-2">
                  Modul fullført!
                </h2>
                <p className="text-gray-600 mb-2">Du lærte det veldig bra!</p>
                <p className="text-gray-700 font-medium mb-4">
                  Poengsum: {correctAnswers}/{totalQuestions} ({Math.round(scorePercentage)}%)
                </p>
                {selectedModule?.parentTip?.content}
                <Image src={success} alt="success" />
                <div className="flex justify-between items-center">
                <div>
                  <NavigateButton/>
                  </div>
                  <div onClick={startLeaningHanlder}>
                  <button className="mt-6 bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium">
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
                <Image src={error} alt="error" className="mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Poengsum: {correctAnswers}/{totalQuestions} ({Math.round(scorePercentage)}%)
                </p>
                <p className="text-gray-600 mb-6">
                  Du trenger minst {passingPercentage}% for å bestå. Prøv igjen!
                </p>
                <button
                  onClick={resetQuiz}
                  className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
                >
                  Prøv igjen
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
