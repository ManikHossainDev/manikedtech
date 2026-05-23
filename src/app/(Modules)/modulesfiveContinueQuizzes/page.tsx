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

const Page = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter();
  const [updateCheckPoints] = useUpdateCheckPointsMutation();

  const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 5,
        checkpoint: "quiz",
        childProfileId: childId,
        data: { score: results, passed: true },
      };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();
      const learningBody = {
        moduleNumber: 6,
        checkpoint: "intro_page",
        childProfileId: childId,
      };
      const response = await updateCheckPoints({ updatesBody: learningBody }).unwrap();
      if (response?.code === 200) {
        router.push(`/modulessix?childId=${childId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useGetModulesByIdQuery("69366d40f4d0d2d1e21e1d61");
  const { parentTip } = data?.data || {};
  const quiz = data?.data?.quiz || {};
  const quizQuestions = quiz.questions || [];
  const quizDescription = quiz.description || "";
  const passingScore = quiz.passingScore || 70;

  const quizData = quizQuestions.map((q: any) => ({
    module: q.questionNumber,
    question: q.question,
    options: q.options.map((opt: any) => `${opt.id}) ${opt.text}`),
    correct: q.correctAnswer,
    explanation: q.explanation,
    points: q.points,
  }));

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full xxl:container mx-auto px-2 xl:px-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster quiz...</p>
        </div>
      </div>
    );
  }

  if (isError || quizData.length === 0) {
    return (
      <div className="relative min-h-screen w-full xxl:container mx-auto px-2 xl:px-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Kunne ikke laste quiz</p>
          <Link href={`/modulesfiveGame?childId=${childId}`}>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg">
              Tilbake til moduler
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentModule - 1];

  // ✅ Step 1: শুধু option select করবে
  const handleAnswerSelect = (optionId: string) => {
    if (showFeedback) return; // feedback দেখানোর সময় change করা যাবে না
    const letter = optionId.split(")")[0];
    const text = optionId.split(")")[1]?.trim();
    setSelectedAnswer(letter);
    setSelectedText(text);
  };

  // ✅ Step 2: Next click এ দুটো কাজ
  // - যদি feedback না দেখানো হয় → feedback দেখাও
  // - যদি feedback দেখানো হয় → পরের question এ যাও
  const handleNext = () => {
  // ✅ Feedback দেখাও
  setShowFeedback(true);
  setAnswers({ ...answers, [currentModule]: selectedAnswer! });

  // ✅ 1 সেকেন্ড পরে পরের question এ যাও
  setTimeout(() => {
    if (currentModule === quizData.length) {
      setShowResult(true);
    } else {
      setCurrentModule(currentModule + 1);
      setSelectedAnswer(null);
      setSelectedText(null);
      setShowFeedback(false);
    }
  }, 1000);
};

  const checkResults = () => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    Object.keys(answers).forEach((module) => {
      const idx = parseInt(module) - 1;
      const question = quizData[idx];
      totalPoints += question.points;
      if (answers[module] === question.correct) {
        correctCount++;
        earnedPoints += question.points;
      }
    });
    const percentage = (earnedPoints / totalPoints) * 100;
    return { correctCount, percentage, earnedPoints, totalPoints };
  };

  const resetQuiz = () => {
    setCurrentModule(1);
    setSelectedAnswer(null);
    setSelectedText(null);
    setShowFeedback(false);
    setAnswers({});
    setShowResult(false);
  };

  const results = checkResults();
  const allCorrect = results.percentage >= passingScore;

  return (
    <div className="relative min-h-screen w-full xxl:container mx-auto px-2 xl:px-0">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/modulesfiveGame?childId=${childId}`}>
          <button className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Tilbake til moduler
          </button>
        </Link>
      </div>

      {/* Quiz Card */}
      <div className="mx-auto bg-white rounded-2xl shadow-lg md:p-4 relative z-10">
        <div className="bg-orange-100 rounded-2xl p-4 flex w-fit items-center mb-3">
          <ArrowLeft size={20} className="text-orange-600 mr-3" />
          <span className="text-orange-800 font-medium">
            {quizDescription || "Grunnleggende regler for oppførsel og sikkerhet på nett."}
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-4 py-2 mb-4">
            <span className="font-semibold text-gray-700">Quiz {currentModule}</span>
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
            {currentQuestion.options.map((option: string, index: number) => {
              const optionLetter = option.split(")")[0];
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = optionLetter === currentQuestion.correct;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${showFeedback
                      ? isCorrect
                        ? "border-green-500 bg-green-50"       // সঠিক উত্তর সবুজ
                        : isSelected
                        ? "border-red-400 bg-red-50"           // ভুল উত্তর লাল
                        : "border-gray-200 bg-white opacity-50" // বাকিগুলো dim
                      : isSelected
                      ? "border-orange-400 bg-orange-50"       // selected হলে orange
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }
                  `}
                >
                  <span className="text-gray-700">{option}</span>
                </button>
              );
            })}
          </div>

          {/* ✅ Feedback - Next click এর পরে দেখাবে */}
          {showFeedback && (
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

        {/* ✅ Next Button */}
        <div className="flex justify-end">
            {selectedAnswer !== null && (
              <button
                onClick={handleNext}
                disabled={showFeedback} // ✅ একবার click এর পর disable
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                Neste
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 3l5 5-5 5V3z" />
                </svg>
              </button>
            )}
          </div>
      </div>

      {/* Overlay Modals */}
      {showResult && (
        <>
          {allCorrect ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                <button onClick={resetQuiz} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-orange-500 mb-2">Modul fullført!</h2>
                <p className="text-gray-600 mb-2">Du lærte det veldig bra!</p>
                <p className="text-gray-600 mb-6">
                  Poeng: {results.percentage.toFixed(1)}% ({results.correctCount}/{quizData.length})
                </p>
                <p>{parentTip?.content}</p>
                <Image src={success} alt="success" />
                <div className="flex justify-between items-center">
                  <div><NavigateButton /></div>
                  <div onClick={startLeaningHanlder}>
                    <button className="mt-6 bg-[#FF9E1C] text-white px-2 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium">
                      Neste modul
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
                <button
                  onClick={resetQuiz}
                  className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
                >
                  Prøv igjen
                </button>
                <p className="text-gray-600 mb-6 mt-5">
                  Noen svar var feil. Poengsum: {results.percentage.toFixed(1)}%
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