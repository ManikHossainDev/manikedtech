/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/champion.png";
import Image from "next/image";
import Link from "next/link";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import NavigateButton from "@/utils/NavigateButton";

// Type definitions
interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  module: number;
  question: string;
  options: string[];
  correct: number;
}

const Page = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter();
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
  const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 6,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
          score: correctAnswers,
          passed: true,
        },
      };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();
      const learningBody = {
        moduleNumber: 7,
        checkpoint: "intro_page",
        childProfileId: childId,
      };
      const response = await updateCheckPoints({
        updatesBody: learningBody,
      }).unwrap();
      if (response?.code === 200) {
        router.push(`/modulesseven?childId=${childId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // module id six
  const id = "69366f0df4d0d2d1e21e1d67";
  const { data, isLoading, isError } = useGetModulesByIdQuery(id);
  const quiz = data?.data?.quiz;
  const quizQuestions = quiz?.questions || [];
  const parentTip = data?.data?.parentTip?.content;

  // Transform API data to match UI expectations
  const quizData: QuizQuestion[] =
    quizQuestions?.map((question: any) => {
      const correctIndex = question.options?.findIndex(
        (option: QuizOption) => option.isCorrect
      );
      return {
        module: question.questionNumber,
        question: question.question,
        options:
          question.options?.map((option: QuizOption) => option.text) || [],
        correct:
          correctIndex !== undefined && correctIndex !== -1 ? correctIndex : 0,
      };
    }) || [];

  const currentQuestion = quizData[currentModule - 1];

  const handleAnswerSelect = (index: number, text: string) => {
    setSelectedAnswer(index);
    setSelectedText(text);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setAnswers({ ...answers, [currentModule]: selectedAnswer });
    if (currentModule === quizData.length) {
      setShowResult(true);
    } else {
      setCurrentModule(currentModule + 1);
      setSelectedAnswer(null);
      setSelectedText(null);
    }
  };

  const checkResults = () => {
    let correct = 0;
    Object.keys(answers).forEach((module) => {
      const idx = parseInt(module) - 1;
      if (
        idx >= 0 &&
        idx < quizData.length &&
        answers[module] === quizData[idx].correct
      ) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentModule(1);
    setSelectedAnswer(null);
    setSelectedText(null);
    setAnswers({});
    setShowResult(false);
  };

  const correctAnswers = checkResults();
  const passingScore =
    quizData.length > 0 ? Math.ceil(quizData.length * 0.75) : 0;
  const passed = correctAnswers >= passingScore;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laster quiz-spørsmål...</p>
        </div>
      </div>
    );
  }

  if (isError || !quizData.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Feil ved lasting av quiz
          </h2>
          <p className="text-gray-600 mb-4">
            Det oppsto et problem med lasting av quiz-spørsmålene. Vennligst
            prøv igjen senere.
          </p>
          <Link href={`/modulesSixGame?childId=${childId}`}>
            <button className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-[#FF9E1C]">
              Tilbake til modul
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Safety check for currentQuestion
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Quiz-feil</h2>
          <p className="text-gray-600 mb-4">
            Kunne ikke laste inn gjeldende spørsmål.
          </p>
          <Link href={`/modulesSixGame?childId=${childId}`}>
            <button className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-[#FF9E1C]">
              Tilbake til modul
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full xxl:container mx-auto px-2 xl:px-0">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/modulesSixGame?childId=${childId}`}>
          <button className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Tilbake til moduler
          </button>
        </Link>
      </div>

      {/* Quiz Card */}
      <div className="mx-auto bg-white rounded-2xl md:shadow-lg md:p-4 relative z-10">
        <div className="bg-orange-100 rounded-2xl p-4 flex w-fit items-center mb-3">
          <ArrowLeft size={20} className="text-orange-600 mr-3" />
          <span className="text-orange-800 font-medium">
            {quiz?.title || "Quiz"}
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-4 py-2 mb-4">
            <span className="font-semibold text-gray-700">
              Quiz {currentModule}
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
            {currentModule}. {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index, option)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-gray-700">{option}</span>
              </button>
            ))}
          </div>

          {/* Feedback Text */}
          {selectedAnswer !== null && (
            <p
              className={`mt-4 text-base font-semibold ${
                selectedAnswer === currentQuestion.correct
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {selectedAnswer === currentQuestion.correct
                ? `✓ Riktig: ${selectedText}`
                : `✗ Feil: ${selectedText}`}
            </p>
          )}
        </div>

        <div className="flex justify-end">
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

      {/* Result Modals */}
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
                <p className="text-gray-600 mb-6">Du lærte det veldig bra!</p>
                <p>{parentTip}</p>
                <p className="text-2xl font-bold text-green-600 mt-4">
                  poeng: {correctAnswers} / {quizData.length}
                </p>
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
                <p className="text-gray-600 mb-2">Noen svar var feil.</p>
                <p className="text-2xl font-bold text-red-600 mt-4">
                  poeng: {correctAnswers} / {quizData.length}
                </p>
                <Image src={error} alt="error" className="mx-auto mb-4" />
                <button
                  onClick={resetQuiz}
                  className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-orange-500 transition-colors font-medium"
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