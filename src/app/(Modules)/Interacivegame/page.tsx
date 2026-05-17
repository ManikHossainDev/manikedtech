/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { X, XIcon } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import game from "@/assets/Modules/game.png";
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
import {
  Boxes,
  Category,
  InteractiveTask,
  Item,
  Question,
} from "@/types/moduleOne.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
  const [draggedItem, setDraggedItem] = useState<Question | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [dragOverBox, setDragOverBox] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Boxes>({});
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
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
      dispatch(setSelectedModule(data.data)); // Set the data.data object into selectedModule
    }
  }, [selectedModule, data, dispatch]);
  // Extract interactive tasks from selectedModule
  const interactiveTasks = selectedModule?.interactiveTasks || [];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const currentTask: InteractiveTask | null =
    interactiveTasks[currentTaskIndex] || null;

  // Check if there are more tasks to complete
  const hasNextTask = currentTaskIndex < interactiveTasks.length - 1;
  const hasPrevTask = currentTaskIndex > 0;
  // Initialize state after we have the currentTask
  useEffect(() => {
    if (currentTask) {
      // Create questions from the interactive task data
      const questions: Question[] = currentTask.config.items.map(
        (item: Item) => ({
          id: item.id,
          text: item.text,
          image: item.image,
          correctBox: currentTask.config.correctMapping[item.id],
        }),
      );

      // Create boxes from categories
      const boxesConfig = currentTask.config.categories.reduce(
        (acc: Boxes, category: Category) => {
          acc[category.id] = {
            items: [],
            label: category.name,
            description: category.description,
            image: category.image, // Add the category image to the box
          };
          return acc;
        },
        {},
      );

      setBoxes(boxesConfig);
      setAvailableQuestions(questions);
    }
  }, [currentTask]);

  // Navigate to next task
  const goToNextTask = () => {
    if (hasNextTask) {
      setCurrentTaskIndex((prev) => prev + 1);
    }
  };

  // Navigate to previous task
  const goToPrevTask = () => {
    if (hasPrevTask) {
      setCurrentTaskIndex((prev) => prev - 1);
    }
  };

  // If no task is available, show a loading state or error
  if (!currentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Laster aktivitet...</p>
        </div>
      </div>
    );
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    question: Question,
  ) => {
    setDraggedItem(question);
    e.dataTransfer.setData("text/plain", question.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    boxKey: string,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverBox(boxKey);
  };

  const handleDragLeave = () => {
    setDragOverBox(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, boxKey: string) => {
    e.preventDefault();
    setDragOverBox(null);

    if (draggedItem) {
      // Check if item already exists in any box
      let itemAlreadyPlaced = false;
      Object.keys(boxes).forEach((key) => {
        if (boxes[key].items.some((item) => item.id === draggedItem.id)) {
          itemAlreadyPlaced = true;
        }
      });

      // Only add if not already placed
      if (!itemAlreadyPlaced) {
        setBoxes((prev) => ({
          ...prev,
          [boxKey]: {
            ...prev[boxKey],
            items: [...prev[boxKey].items, draggedItem],
          },
        }));
        setAvailableQuestions((prev) =>
          prev.filter((q) => q.id !== draggedItem.id),
        );
      }
      setDraggedItem(null);
    }
  };

  const handleRemoveFromBox = (boxKey: string, itemId: string) => {
    const itemToRemove = boxes[boxKey].items.find((item) => item.id === itemId);
    if (itemToRemove) {
      setBoxes((prev) => ({
        ...prev,
        [boxKey]: {
          ...prev[boxKey],
          items: prev[boxKey].items.filter((item) => item.id !== itemId),
        },
      }));
      setAvailableQuestions((prev) => [...prev, itemToRemove]);
    }
  };

  const getTotalPlaced = () => {
    return Object.keys(boxes).reduce(
      (total, key) => total + boxes[key].items.length,
      0,
    );
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const totalPlaced = getTotalPlaced();

    // Count correct answers
    Object.keys(boxes).forEach((boxKey) => {
      boxes[boxKey].items.forEach((item) => {
        if (item.correctBox === boxKey) {
          correctCount++;
        }
      });
    });

    // Calculate percentage of correct answers
    const percentage = (correctCount / totalPlaced) * 100;

    // Show success if at least 66% are correct (2 out of 3, or 4 out of 6, etc.)
    if (percentage >= 66) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const resetGame = () => {
    if (currentTask) {
      // Reset boxes to initial state
      const resetBoxes: Boxes = {};
      currentTask.config.categories.forEach((category: Category) => {
        resetBoxes[category.id] = {
          items: [],
          label: category.name,
          description: category.description,
          image: category.image, // Add the category image to the box
        };
      });

      // Recreate questions from the interactive task data
      const questions: Question[] = currentTask.config.items.map(
        (item: Item) => ({
          id: item.id,
          text: item.text,
          image: item.image,
          correctBox: currentTask.config.correctMapping[item.id],
        }),
      );

      setBoxes(resetBoxes);
      setAvailableQuestions(questions);
      setShowErrorModal(false);
      setShowSuccessModal(false);
    }
  };

  const allPlaced = getTotalPlaced() >= (currentTask?.config.items.length || 0);
  console.log(allPlaced);

  const startLeaningHanlder = async () => {
    try {
      // 1️⃣ Intro Page Update
      const introBody = {
        moduleNumber: 1,
        checkpoint: "learning_content",
        childProfileId: childId,
      };

      await updateCheckPoints({ updatesBody: introBody }).unwrap();

      // 2️⃣  quiz Update
      const learningBody = {
        moduleNumber: 1,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
          score: 0,
          passed: false,
        },
      };

      const response = await updateCheckPoints({
        updatesBody: learningBody,
      }).unwrap();
      if (response?.code === 200) {
        router.push(`/ContinueQuizzes?childId=${childId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full xxl:container  mx-auto p-8">
      <div className="">
        {/* Header */}
        <div className="mb-8"> 
          <Link href={`/LearningOne?childId=${childId}`}>
          <button className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2">
            <FaArrowLeft className="w-4 h-4" /> <h1>Tilbake til Modul 01</h1>
          </button>
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Image alt="" src={game} /> {currentTask.title}
            </h1>
          </div>

          {interactiveTasks.length > 1 && (
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={goToPrevTask}
                disabled={!hasPrevTask}
                className={`px-3 py-1 rounded ${hasPrevTask ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 text-gray-400"} disabled:cursor-not-allowed`}
              >
                Forrige
              </button>
              <button
                onClick={goToNextTask}
                disabled={!hasNextTask}
                className={`px-3 py-1 rounded ${hasNextTask ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 text-gray-400"} disabled:cursor-not-allowed`}
              >
                Neste
              </button>
            </div>
          )}

          {/* Available Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 md:mt-10">
            {availableQuestions.map((question) => {
              return (
                <div
                  key={question.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, question)}
                  className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 cursor-move hover:shadow-lg transition-shadow flex flex-col items-center"
                >
                  {question.image && (
                    <div className="mb-2">
                      <Image
                        src={question.image.url}
                        alt={question.text}
                        width={100}
                        height={100}
                        className="object-contain max-h-24"
                      />
                    </div>
                  )}
                  <span className="text-orange-800 font-medium text-center">
                    {question.text} 
                  </span>
                </div>
              );
            })}
          </div>
          {/* Drop Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 md:my-10">
            {Object.keys(boxes).map((boxKey) => (
              <div
                key={boxKey}
                onDragOver={(e) => handleDragOver(e, boxKey)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, boxKey)}
                className={`border-4 ${
                  dragOverBox === boxKey
                    ? "border-green-500 bg-green-50"
                    : "border-dashed border-gray-300"
                } rounded-xl p-6 min-h-64 bg-white`}
              >
                <h3 className="text-xl font-bold text-center mb-2 text-gray-700">
                  {boxes[boxKey].label}
                </h3>
                <p className="text-sm text-center text-gray-500 mb-4">
                  {boxes[boxKey].description}
                </p>
                <div className="flex justify-center mb-4">
                  {/* Dynamically show the category image from the API response */}
                  <div className="flex items-center justify-center">
                    {boxes[boxKey].image?.url && (
                      <Image
                        src={boxes[boxKey].image.url}
                        alt={boxes[boxKey].label}
                        width={100}
                        height={100}
                        className="object-contain max-h-24"
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {boxes[boxKey].items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-orange-100 border border-orange-300 rounded p-3 text-sm flex flex-col items-center relative"
                    >
                      <button
                        onClick={() => handleRemoveFromBox(boxKey, item.id)}
                        className="absolute -top-2 -right-2 bg-red-400 text-gray-100 rounded-full w-3 h-3 flex items-center justify-center text-xs"
                        aria-label="Remove item"
                      >
                        <XIcon className="h-2" />
                      </button>
                      {item.image && (
                        <div className="mb-1">
                          <Image
                            src={item.image.url}
                            alt={item.text}
                            width={60}
                            height={60}
                            className="object-contain max-h-16"
                          />
                        </div>
                      )}
                      <span className="text-center">{item.text}</span>
                    </div>
                  ))}

                  {boxes[boxKey].items.length === 0 && (
                    <div className="flex items-center justify-center h-16 text-gray-400 italic">
                      Slipp elementer her
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h1 className="text-xl text-center -mt-3 mb-5">
            {currentTask.instructions ||
              "Dra scenariene til riktig kategori"}
          </h1>

          {/* Action Buttons */}
          <div
            className={`flex items-center ${
              getTotalPlaced() > 0 ? "justify-between" : "justify-center"
            }`}
          >
            {getTotalPlaced() > 0 && (
              <button
                onClick={resetGame}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Reset
              </button>
            )}
            {allPlaced ? (
              <button
                onClick={checkAnswers}
                className="bg-[#FF9E1C] text-white px-8 py-3 rounded-lg hover:bg-[#FF9E1C] transition-colors font-medium shadow-lg"
              >
                ✓ Sjekk svar
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-black px-8 py-3 rounded-lg font-medium cursor-not-allowed"
              >
                📋 Plasser alle elementer
              </button>
            )}
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
                {hasNextTask ? "Task Complete!" : "Modul fullført!"}
              </h2>
              <p className="text-gray-600">
                {hasNextTask
                  ? "Godt jobbet! Gå til neste oppgave."
                  : "Du fullførte alle interaktive oppgaver!"}
              </p>
            </div>
            <div className="mb-6">
              <Image src={success} alt="img" />
            </div>
            {hasNextTask ? (
              <button
                onClick={() => {
                  goToNextTask();
                  setShowSuccessModal(false);
                }}
                className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium"
              >
                Next Task
              </button>
            ) : (
              <div onClick={startLeaningHanlder}>
                <button className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium">
                  Fortsett Quizzer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center relative">
            <div className="mb-4">
              <Image src={error} alt="error" />
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowErrorModal(false);
                  resetGame();
                }}
                className="bg-[#FF9E1C] text-white px-8 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium w-full"
              >
                Prøv igjen
              </button>
              {hasNextTask && (
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    goToNextTask();
                  }}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-400 transition-colors font-medium w-full"
                >
                  Hopp over oppgave
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
