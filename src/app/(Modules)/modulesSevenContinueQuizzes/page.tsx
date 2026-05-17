"use client";
import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import error from "@/assets/Modules/error.png";
import success from "@/assets/Modules/champion.png";
import Image from "next/image";
import Link from "next/link";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { QuizOption } from "@/types/moduleOne.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import NavigateButton from "@/utils/NavigateButton";

const Page = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

              const router = useRouter()
              const [updateCheckPoints] = useUpdateCheckPointsMutation();
              const startLeaningHanlder = async () => {
              try {
                const introBody = {
                  moduleNumber: 7,
                  checkpoint: "quiz",
                  childProfileId: childId,
                  data: {
                      score:correctAnswers,
                      passed:true,
                  }
                };
                await updateCheckPoints({ updatesBody: introBody }).unwrap();
                const learningBody = {
                  moduleNumber: 8,
                  checkpoint: "intro_page",
                  childProfileId: childId,
                };
                const response = await updateCheckPoints({
                  updatesBody: learningBody,
                }).unwrap();
                if (response?.code === 200) {
                  router.push(`/moduleseight?childId=${childId}`);
                }
              } catch (error) {
                console.log(error)
              }
            };

  const childId = searchParams.get("childId");
  // Check if selectedModule has data, if not fetch from API
  const { data } = useGetModulesByIdQuery("693670abf4d0d2d1e21e1d6d", {
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

  const quizQuestions = selectedModule?.quiz?.questions || [];
  const currentQuestion = quizQuestions[currentModule - 1];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowWrongAnswer(false); // Clear wrong answer indicator when selecting a new answer
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const currentQuestion = quizQuestions[currentModule - 1];
      if (currentQuestion) {
        const selectedOptionId = currentQuestion.options[selectedAnswer]?.id;
        const correct = selectedOptionId === currentQuestion.correctAnswer;

        setIsCorrect(correct);

        if (correct) {
          // Show explanation for 300ms then move to next question
          setShowExplanation(true);

          setTimeout(() => {
            setAnswers({ ...answers, [currentModule]: selectedAnswer! });
            if (currentModule === quizQuestions.length) {
              setShowResult(true);
            } else {
              setCurrentModule(currentModule + 1);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setIsCorrect(null);
              setShowWrongAnswer(false);
            }
          }, 300); // 300 milliseconds as requested
        } else {
          // Show wrong answer indicator and move to next question after a short delay
          setShowWrongAnswer(true);

          setTimeout(() => {
            setAnswers({ ...answers, [currentModule]: selectedAnswer! });
            if (currentModule === quizQuestions.length) {
              setShowResult(true);
            } else {
              setCurrentModule(currentModule + 1);
              setSelectedAnswer(null);
              setShowWrongAnswer(false);
              setIsCorrect(null);
            }
          }, 1000); // Show wrong answer for 1 second before moving to next question
        }
      }
    }
  };

  const checkResults = () => {
    let correct = 0;
    Object.keys(answers).forEach((module) => {
      const idx = parseInt(module) - 1;
      const question = quizQuestions[idx];
      if (question) {
        // Get the option ID that was selected
        const selectedOptionId = question.options[answers[module]]?.id;
        // Compare with the correct answer ID
        if (selectedOptionId === question.correctAnswer) correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentModule(1);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResult(false);
    setShowExplanation(false);
    setIsCorrect(null);
    setShowWrongAnswer(false);
  };

  const correctAnswers = checkResults();
  const allCorrect = correctAnswers === quizQuestions.length;

  return (
    <div className="relative min-h-screen w-full xxl:container  mx-auto px-2 xl:px-0">
      {/* Header */}
      <div className="mx-auto mb-6 mt-3">
        <Link href={`/modulesfiveGame?childId=${childId}`}>
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
            {selectedModule?.quiz?.description ||
              "Grunnleggende regler for oppførsel og sikkerhet på nett."}
          </span>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg px-4 py-2 mb-4">
            <span className="font-semibold text-gray-700">
              {selectedModule?.quiz?.title || `Quiz ${currentModule}`}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-600">Framgang</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentModule / quizQuestions.length) * 100}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {currentModule}/{quizQuestions.length}
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
                  key={option.id}
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
          {/* Show explanation for correct answer or wrong answer text */}
          {showExplanation && isCorrect && currentQuestion?.explanation && (
            <div className="text-green-600 font-medium bg-green-50 p-3 rounded-lg flex-1 mr-4">
              ✓ {currentQuestion.explanation}
            </div>
          )}

          {/* Show wrong answer indicator */}
          {showWrongAnswer && !isCorrect && (
            <div className="text-red-600 font-medium bg-red-50 p-3 rounded-lg flex-1 mr-4">
              ✗ Feil svar! Prøv igjen.
            </div>
          )}
        </div>
        <div className="flex justify-end">
            {selectedAnswer !== null && !showExplanation && (
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
          {allCorrect ? (
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
                <h1>{selectedModule?.parentTip?.content}</h1>
                <p className="text-2xl font-bold text-green-600 mt-4">
                  Poengsum: {correctAnswers}/{quizQuestions.length}
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
                <button
                  onClick={resetQuiz}
                  className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
                >
                  Prøv igjen
                </button>
                <p className="text-gray-600 -mb-6 mt-5">
                  Noen svar var feil.
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-4">
                  Poengsum: {correctAnswers}/{quizQuestions.length}
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
