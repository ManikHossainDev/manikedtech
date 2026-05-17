/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { ArrowLeft, Gamepad2, X, Star } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import Link from "next/link";

type Option = {
  text: string;
  value?: string;
  feedback?: string;
  isCorrect?: boolean;
};

const Page = () => {
  const [stage, setStage] = useState("training");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentCase, setCurrentCase] = useState(1);
  const [score, setScore] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter()
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
  const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 5,
        checkpoint: "interactive_task",
        childProfileId: childId,
      };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();
      const learningBody = {
        moduleNumber: 5,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
          score: 0,
          passed: false
        }
      };
      const response = await updateCheckPoints({
        updatesBody: learningBody,
      }).unwrap();
      if (response?.code === 200) {
        router.push(`/modulesfiveContinueQuizzes?childId=${childId}`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const { data } = useGetModulesByIdQuery("69366d40f4d0d2d1e21e1d61");
  const scenarios = data?.data?.interactiveTasks[0]?.config?.scenarios || [];

  const totalCases = scenarios.length;
  const currentScenario = scenarios[currentCase - 1];

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    const selectedOption = currentScenario?.options?.find(
      (opt: Option) => opt.text === selectedCategory
    );

    if (selectedOption?.isCorrect) {
      setScore(score + 1);
      setStage("correct");
    } else {
      setStage("incorrect");
    }
  };

  const handleCheckAnswer = () => {
    if (currentCase < totalCases) {
      setCurrentCase(currentCase + 1);
      setSelectedCategory("");
      setStage("challenge");
      setShowClue(false);
    } else {
      if (score >= 4) {
        setStage("success");
      } else {
        setStage("failure");
      }
    }
  };

  const resetGame = () => {
    setCurrentCase(1);
    setScore(0);
    setSelectedCategory("");
    setStage("challenge");
    setShowClue(false);
  };

  const startChallenge = () => {
    setStage("challenge");
  };

  const toggleClue = () => {
    setShowClue(!showClue);
  };

  const getSelectedFeedback = () => {
    const selectedOption = currentScenario?.options?.find(
      (opt: Option) => opt.text === selectedCategory
    );
    return selectedOption?.feedback || "";
  };

  if (!scenarios.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Laster spilldata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto px-2 xl:px-0 py-8">
        {/* Back Button */}
        <Link href={`/InteractiveGamefive?childId=${childId}`}>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Tilbake til Modul 05</span>
          </button>
        </Link>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <Gamepad2 size={26} className="text-orange-400" />
            <p className="text-lg text-orange-800 font-medium">
              Finn lureriet
            </p>
          </div>

          {/* Main Card */}
          <div className="max-w-2xl mx-auto">
            {/* Training Stage */}
            {stage === "training" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="mx-auto mb-2 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🕵️</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Detektivtrening
                  </h2>
                </div>

                {/* EDITED Card */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">❌</span>
                    <h3 className="font-bold text-red-700 text-lg">REDIGERT</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bildet er endret, manipulert eller falskt
                  </p>
                </div>

                {/* REAL Card */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">✅</span>
                    <h3 className="font-bold text-green-700 text-lg">EKTE</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bildet er autentisk og har ikke blitt manipulert
                  </p>
                </div>

                {/* NOT SURE Card */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🤔</span>
                    <h3 className="font-bold text-yellow-700 text-lg">
                      IKKE SIKKER
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Du er ikke sikker - det er greit! Det er lurt å være ærlig
                  </p>
                  <p className="text-xs text-yellow-700">
                    → Å velge dette alternativet gir ikke poeng.
                  </p>
                </div>

                {/* Detective Tips */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                  <h3 className="font-bold text-orange-800 mb-3 text-lg">
                    Detektivtips:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Bruk &#39;ledetråd&#39;-knappen hvis du trenger hjelp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>
                        Se etter ting som virker &#39;for godt til å være sant!&#39;
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>
                        Sjekk priser, datoer og andre detaljer opp mot virkeligheten
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>
                        Det er LURT å si &quot;IKKE SIKKER&quot; når du ikke vet!
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={startChallenge}
                    className="px-4 md:px-8 bg-[#FF9E1C] text-white py-4 rounded-xl hover:bg-[#e88d19] transition-colors font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Star className="w-5 h-5 fill-white" />
                    Start etterforskning
                  </button>
                </div>
              </div>
            )}

            {/* Challenge Stage */}
            {stage === "challenge" && currentScenario && (
              <div className="space-y-5">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Saken {currentCase} om {totalCases}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentCase / totalCases) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <span className="bg-orange-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow">
                      Poeng: {score} poeng
                    </span>
                  </div>
                </div>

                {/* Image Display (if exists) */}


                {/* Situation Card */}
                <div className="border-2 border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="p-6 flex flex-col md:flex-row gap-4 items-center">

                    {/* IMAGE */}
                    {currentScenario.image?.url && (
                      <div className="relative w-[300px] h-[200px] flex-shrink-0">
                        <Image
                          src={currentScenario.image.url}
                          alt={`Case ${currentCase}`}
                          fill
                          className="object-contain rounded-lg"
                          priority
                        />
                      </div>
                    )}

                    {/* TEXT */}
                    <div className="whitespace-pre-line text-gray-800 text-lg text-center md:text-left">
                      {currentScenario.situation}
                    </div>

                  </div>
                </div>

                {/* Need A Clue Section */}
                <div
                  onClick={toggleClue}
                  className="border-2 border-orange-300 rounded-xl p-4 bg-white flex items-center justify-center gap-2 cursor-pointer hover:bg-orange-50 transition-colors"
                >
                  <span className="text-orange-600 text-xl">💡</span>
                  <span className="text-orange-700 font-semibold">
                    Trenger du et hint?
                  </span>
                </div>

                {/* Clue Content */}
                {showClue && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔍</span>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-2">
                          Detektivens hint:
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {currentScenario.hint}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Options */}
                <div className="space-y-3">
                  {currentScenario.options?.map((option: any) => (
                    <button
                      key={option.id}
                      onClick={() => handleCategorySelect(option.text)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedCategory === option.text
                          ? option.text === "EDITED"
                            ? "border-red-400 bg-red-50 shadow-md"
                            : option.text === "REAL"
                              ? "border-green-400 bg-green-50 shadow-md"
                              : "border-yellow-400 bg-yellow-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-lg ${option.text === "EDITED"
                              ? "text-red-600"
                              : option.text === "REAL"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                        >
                          {option.text === "EDITED"
                            ? "❌"
                            : option.text === "REAL"
                              ? "✅"
                              : "🤔"}
                        </span>
                        <span className="font-bold text-gray-800">
                          {option.text}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {option.text === "EDITED"
                          ? "Dette er endret"
                          : option.text === "REAL"
                            ? "Dette er autentisk"
                            : "Må sjekkes"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleNext}
                    disabled={!selectedCategory}
                    className="px-4 md:px-8 bg-[#FF9E1C] text-white py-4 rounded-xl hover:bg-[#e88d19] transition-colors font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FiStar className="text-xl" /> Neste
                  </button>
                </div>
              </div>
            )}

            {/* Correct Answer Stage */}
            {stage === "correct" && currentScenario && (
              <div className="space-y-5">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Saken {currentCase} om {totalCases}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentCase / totalCases) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <span className="bg-orange-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow">
                      Poeng: {score} poeng
                    </span>
                  </div>
                </div>

                {/* Situation Card */}
                <div className="border-2 border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="p-6 flex flex-col md:flex-row gap-4 items-center">

                    {/* IMAGE */}
                    {currentScenario.image?.url && (
                      <div className="relative w-[300px] h-[200px] flex-shrink-0">
                        <Image
                          src={currentScenario.image.url}
                          alt={`Case ${currentCase}`}
                          fill
                          className="object-contain rounded-lg"
                          priority
                        />
                      </div>
                    )}

                    {/* TEXT */}
                    <div className="whitespace-pre-line text-gray-800 text-lg text-center md:text-left">
                      {currentScenario.situation}
                    </div>

                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white">✓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    Flott øye! 🎉
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    Du oppdaget lureriet!
                  </p>
                  <p className="text-sm text-gray-600">
                    {getSelectedFeedback()}
                  </p>
                </div>

                {/* Check Answer Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCheckAnswer}
                    className="px-4 md:px-8 bg-[#FF9E1C] text-white py-4 rounded-xl hover:bg-[#e88d19] transition-colors font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Star className="w-5 h-5 fill-white" />
                    Sjekk svar
                  </button>
                </div>
              </div>
            )}

            {/* Incorrect Answer Stage */}
            {stage === "incorrect" && currentScenario && (
              <div className="space-y-5">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Saken {currentCase} om {totalCases}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentCase / totalCases) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <span className="bg-orange-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow">
                      Poeng: {score} poeng
                    </span>
                  </div>
                </div>



                {/* Situation Card Small */}
                <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="p-4 text-center">
                    <div className="whitespace-pre-line text-gray-800 text-sm">
                      {currentScenario.situation}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-red-400">
                    <span className="text-3xl text-red-500">✕</span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-3">
                    Ikke helt...
                  </h3>
                  <p className="text-sm text-gray-700">
                    {getSelectedFeedback()}
                  </p>
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCheckAnswer}
                    className="px-4 md:px-8 bg-[#FF9E1C] text-white py-4 rounded-xl hover:bg-[#e88d19] transition-colors font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Star className="w-5 h-5 fill-white" />
                    Fortsett
                  </button>
                </div>
              </div>
            )}

            {/* Success Modal */}
            {stage === "success" && (
              <div className="fixed inset-0 bg-[#00000059] bg-opacity-95 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl">
                  <button
                    onClick={() => setStage("challenge")}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>

                  <div className="mb-6 relative">
                    <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-5xl">🎉</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      Gratulerer!!
                    </h2>
                    <p className="text-xl font-semibold text-green-600">
                      Poeng: {score}/{totalCases}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 mb-6 text-left border border-orange-200">
                    <h3 className="text-base font-bold text-orange-800 mb-4 flex items-center gap-2">
                      📋 Detektivregler å huske:
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-800">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold text-lg">•</span>
                        <span className="leading-relaxed">
                          Bekreft alltid kilden og sjekk om den er bevist sann
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold text-lg">•</span>
                        <span className="leading-relaxed">
                          Still spørsmål ved tilbud med &quot;100%&quot; eller &quot;rask&quot;-garantier
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold text-lg">•</span>
                        <span className="leading-relaxed">
                          Sjekk om velkjente organisasjoner faktisk har sendt dette
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div onClick={startLeaningHanlder}>
                    <button className="bg-[#FF9E1C] text-white px-8 py-3.5 rounded-full hover:bg-[#e88d19] transition-colors font-bold w-full shadow-lg text-base flex items-center justify-center gap-2">
                      <FaStar className="text-xl" /> Fortsett Quizzer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Failure Modal */}
            {stage === "failure" && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl">
                  <button
                    onClick={() => setStage("challenge")}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>

                  <div className="mb-6">
                    <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-5xl">😔</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Fortsett å øve!
                    </h2>
                    <p className="text-2xl font-bold text-orange-600 mt-4">
                      Poeng: {score}/{totalCases}
                    </p>
                  </div>

                  <button
                    onClick={resetGame}
                    className="bg-[#FF9E1C] text-white px-8 py-3.5 rounded-full hover:bg-[#e88d19] transition-colors font-bold w-full shadow-lg text-base"
                  >
                    Prøv igjen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;