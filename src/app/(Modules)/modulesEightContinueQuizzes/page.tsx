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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter();
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
  const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 8,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
          score: correctAnswers,
          passed: true,
        },
      };
      const response = await updateCheckPoints({ updatesBody: introBody }).unwrap();
      console.log(response);
      if (response?.code === 200) {
        router.push(`/CertificateDownloard?childId=${childId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const id = "6936776976dca28d7e43e6c7";
  const { data, isLoading } = useGetModulesByIdQuery(id);
  const { parentTip } = data?.data || {};
  const quiz = data?.data?.quiz;

  // Show loading state
  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentModule - 1];

  const handleAnswerSelect = (optionId: string, optionText: string) => {
    setSelectedAnswer(optionId);
    setSelectedText(optionText);
  };

  const handleNext = () => {
    setAnswers({ ...answers, [currentModule]: selectedAnswer! });
    if (currentModule === questions.length) {
      setShowResult(true);
    } else {
      setCurrentModule(currentModule + 1);
      setSelectedAnswer(null);
      setSelectedText(null);
    }
  };

  const checkResults = () => {
    let correct = 0;
    Object.keys(answers).forEach((moduleNum) => {
      const idx = parseInt(moduleNum) - 1;
      if (answers[moduleNum] === questions[idx].correctAnswer) correct++;
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
  const totalQuestions = questions.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;
  const passingScore = quiz.passingScore || 70;
  const passed = scorePercentage >= passingScore;

  return (
    <div className="relative min-h-screen w-full xxl:container mx-auto px-2 xl:px-0">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/modulesEightTime?childId=${childId}`}>
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
            {quiz.description || "Grunnleggende regler for oppførsel og sikkerhet på nett."}
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
                style={{ width: `${(currentModule / totalQuestions) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {currentModule}/{totalQuestions}
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
            {currentQuestion.options.map((option: any) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id, option.text)}
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

          {/* Feedback Text */}
          {selectedAnswer !== null && (
            <p
              className={`mt-4 text-base font-semibold ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {selectedAnswer === currentQuestion.correctAnswer
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
              Next
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

      {/* Overlay Modals */}
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
                <p className="text-gray-700 font-semibold mb-6">
                  Score: {correctAnswers}/{totalQuestions} (
                  {scorePercentage.toFixed(0)}%)
                </p>
                <p>{parentTip?.content}</p>
                <Image src={success} alt="success" />
                <div className="flex justify-between items-center">
                  <div>
                    <NavigateButton />
                  </div>
                  <div onClick={startLeaningHanlder}>
                    <button className="mt-6 bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium">
                      Get Certificate
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
                  Score: {correctAnswers}/{totalQuestions} (
                  {scorePercentage.toFixed(0)}%)
                  <br />
                  You need {passingScore}% to pass.
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