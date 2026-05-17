"use client";
import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/champion.png";
import Image from "next/image";
import Link from "next/link";
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

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionNumber: number;
  type: string;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface Quiz {
  title: string;
  description: string;
  passingScore: number;
  questions: Question[];
  totalPoints: number;
  allowRetake: boolean;
  showCorrectAnswers: boolean;
}

const Page = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter()
      const [updateCheckPoints] = useUpdateCheckPointsMutation();
      const startLeaningHanlder = async () => {
      try {
        const introBody = {
          moduleNumber: 3,
          checkpoint: "quiz",
          childProfileId: childId,
          data: {
              score:correctAnswers,
              passed:true,
          }
        };
        await updateCheckPoints({ updatesBody: introBody }).unwrap();
        const learningBody = {
          moduleNumber: 4,
          checkpoint: "intro_page",
          childProfileId: childId,
        };
        const response = await updateCheckPoints({
          updatesBody: learningBody,
        }).unwrap();
        if (response?.code === 200) {
          router.push(`/modulesfour?childId=${childId}`);
        }
      } catch (error) {
        console.log(error)
      }
    };

  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
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

  // Get quiz from the API data
  const quiz: Quiz | null = selectedModule?.quiz || null;

  // If no quiz data is available, show a loading message
  if (!quiz) {
    return (
      <div className="relative min-h-screen px-2 xl:px-0 w-full xxl:container  mx-auto flex items-center justify-center">
        <p>Laster quiz...</p>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (!showExplanation) {
      setSelectedOptionId(optionId);
    }
  };

  const handleNext = () => {
    if (selectedOptionId) {
      // Store the selected answer
      setAnswers({
        ...answers,
        [currentQuestion.questionNumber]: selectedOptionId,
      });

      // Show explanation and correct/incorrect feedback
      setShowExplanation(true);

      // After a delay, move to the next question or show results
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOptionId(null);
          setShowExplanation(false);
        } else {
          // Last question - show results
          setShowResult(true);
        }
      }, 1000); // 2 second delay to show feedback
    }
  };

  const checkResults = () => {
    let correct = 0;
    questions.forEach((question) => {
      const userAnswer = answers[question.questionNumber.toString()];
      if (userAnswer && userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswers({});
    setShowResult(false);
    setShowExplanation(false);
  };

  const correctAnswers = checkResults();
  const scorePercentage = (correctAnswers / questions.length) * 100;
  const passed = scorePercentage >= quiz.passingScore;

  const getOptionStyle = (optionId: string) => {
    // Base style
    let style =
      "text-left p-4 rounded-xl border-2 transition-all duration-200 ";

    // If explanation is shown (after answering), highlight correct and incorrect answers
    if (showExplanation) {
      if (optionId === currentQuestion.correctAnswer) {
        // Correct answer gets green border
        style += "border-green-500 bg-green-50";
      } else if (
        optionId === selectedOptionId &&
        optionId !== currentQuestion.correctAnswer
      ) {
        // Selected wrong answer gets red border
        style += "border-red-500 bg-red-50";
      } else {
        // Other options get gray border and are disabled
        style += "border-gray-200 bg-gray-100 opacity-70";
      }
    } else {
      // Before answering, show selected option with orange border
      if (selectedOptionId === optionId) {
        style += "border-orange-400 bg-orange-50";
      } else {
        style += "border-gray-200 hover:border-gray-300 bg-white";
      }
    }

    return style;
  };

  return (
    <div className="relative min-h-screen px-2 xl:px-0 w-full xxl:container  mx-auto">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/modulesthreeGame?childId=${childId}`}>
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
            {quiz.description}
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-4 py-2 mb-4">
            <span className="font-semibold text-gray-700">
              Quiz {currentQuestion.questionNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-600">Framgang</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        <hr className="mb-6 border-gray-200" />

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.questionNumber}. {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showExplanation}
                className={getOptionStyle(option.id)}
              >
                <span className="text-gray-700">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Explanation/Feedback display */}
          {showExplanation && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                selectedOptionId === currentQuestion.correctAnswer
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {selectedOptionId === currentQuestion.correctAnswer
                ? "Riktig! "
                : "Feil! "}
              {currentQuestion.explanation}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          {selectedOptionId !== null && !showExplanation && (
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
                <h2 className="text-3xl font-bold text-orange-500 mb-2">
                  Quiz bestått!
                </h2>
                <p className="text-gray-600 mb-2">
                  Du scoret {scorePercentage.toFixed(1)}%
                </p>
                <p className="text-gray-600 mb-6">Godt gjort!</p>
                {selectedModule?.parentTip?.content}
                <Image src={success} alt="success" />
                <div className="flex justify-between items-center">
                  <div>
                    <NavigateButton />
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
                <button
                  onClick={resetQuiz}
                  className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
                >
                  Prøv igjen
                </button>
                <p className="text-gray-600 -mb-6 mt-5">
                  Du scoret {scorePercentage.toFixed(1)}%. Minimum nødvendig:{" "}
                  {quiz.passingScore}%.
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

export default Page;
