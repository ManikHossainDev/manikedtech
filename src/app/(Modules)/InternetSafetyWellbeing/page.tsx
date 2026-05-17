/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Remaining Code
import React, { useEffect, useMemo, useState } from "react";
import { LuGamepad2 } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// Type definitions
interface Person {
  id: string;
  name: string;
  text: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  color: string;
  borderColor: string;
  hoverColor: string;
}

type CategoryType = string; // More flexible to handle dynamic category IDs from API

interface Assignments {
  [key: string]: string[];
}

const Page: React.FC = () => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignments>({});

  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  const moduleId = "695e2fe8eaf052fd70aa958a";

  // Check if selectedModule has data for THIS specific module, if not fetch from API
  const isCorrectModule = selectedModule?._id === moduleId;

  const { data, isLoading } = useGetModulesByIdQuery(moduleId, {
    skip: isCorrectModule,
  });

  useEffect(() => {
    if (!isCorrectModule && data) {
      dispatch(setSelectedModule(data.data)); // Set the data.data object into selectedModule
    }
  }, [isCorrectModule, data, dispatch]);

  // Extract interactive tasks from API data
  const interactiveTasks = selectedModule?.interactiveTasks || [];
  const sortTask = interactiveTasks.find(
    (task: any) => task.type === "sort-categories"
  );

  // Extract people and categories from API data
  const people: Person[] = sortTask?.config?.items || [];

  console.log(sortTask)

  const categories: Category[] = useMemo(() =>
    sortTask?.config?.categories?.map((cat: any) => ({
      ...cat,
      color:
        cat.id === "friend"
          ? "bg-orange-100"
          : cat.id === "acquaintance"
          ? "bg-blue-100"
          : "bg-pink-100",
      borderColor:
        cat.id === "friend"
          ? "ring-orange-500"
          : cat.id === "acquaintance"
          ? "ring-blue-500"
          : "ring-pink-500",
      hoverColor:
        cat.id === "friend"
          ? "hover:bg-orange-200"
          : cat.id === "acquaintance"
          ? "hover:bg-blue-200"
          : "hover:bg-pink-200",
    })) || [], [sortTask?.config?.categories]);

  // Initialize assignments state with empty arrays for each category
  useEffect(() => {
    if (
      categories &&
      categories.length > 0 &&
      Object.keys(assignments).length === 0
    ) {
      const initialAssignments: Assignments = {};
      categories.forEach((cat) => {
        initialAssignments[cat.id] = [];
      });
      setAssignments(initialAssignments);
    }
  }, [categories, assignments]);

  const handlePersonClick = (personId: string): void => {
    if (!selectedCategory) {
      toast("Velg en kategori først!");
      return;
    }

    // Check if person is already assigned somewhere
    const currentCategory = (Object.keys(assignments) as CategoryType[]).find(
      (cat) => assignments[cat].includes(personId)
    );

    if (currentCategory === selectedCategory) {
      // Remove from current category
      setAssignments((prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter(
          (id) => id !== personId
        ),
      }));
    } else if (currentCategory) {
      // Move from one category to another
      setAssignments((prev) => ({
        ...prev,
        [currentCategory]: prev[currentCategory].filter(
          (id) => id !== personId
        ),
        [selectedCategory]: [...prev[selectedCategory], personId],
      }));
    } else {
      // Add to selected category
      setAssignments((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], personId],
      }));
    }
  };

  const getPersonCategory = (personId: string): CategoryType | undefined => {
    if (!assignments) return undefined;
    return (Object.keys(assignments) as CategoryType[]).find((cat) =>
      assignments[cat]?.includes(personId)
    );
  };

  const getPersonBorderColor = (personId: string): string => {
    const category = getPersonCategory(personId);
    if (!category) return "";

    const cat = categories?.find((c) => c.id === category);
    return cat ? cat.borderColor : "";
  };

  const totalAssigned: number = assignments
    ? Object.values(assignments).flat().length
    : 0;
  const canCheckAnswers: boolean =
    totalAssigned === (people?.length || 0) && (people?.length || 0) > 0;

  // Calculate how many correct answers the user got
  const correctMapping: Record<string, string> = sortTask?.config?.correctMapping || {};

  const calculateScore = (): number => {
    let correctCount = 0;
    people.forEach((person) => {
      const userAssignedCategory = getPersonCategory(person.id);
      const correctCategory = correctMapping[person.id];
      if (userAssignedCategory === correctCategory) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleCheckAnswers = (): void => {
    const score = calculateScore();
    router.push(`/InternetSafetyWellbeingSuccess?childId=${childId}&score=${score}`);
  };

  return (
    <div className="min-h-screen w-full xxl:container  mx-auto p-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/Interacivegametow?childId=${childId}`}>
            <button className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2">
              <FaArrowLeft className="w-4 h-4" />
              Tilbake til Modul 02
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-xl p-4 xl:px-10 rounded-lg">
          <div className="">
            <p className="text-sm md:text-lg text-orange-800 flex items-center space-x-3">
              {" "}
              <LuGamepad2 size={26} className=" text-orange-400 mr-2" /> Venn, bekjent eller fremmed?
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <h1 className="text-lg md:text-3xl font-bold text-center mb-2">
              {sortTask?.title || "Del 1: Hvem kan du stole på?"}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {sortTask?.instructions
                ? sortTask.instructions.replace(
                    /\d+\s*people\s*left\s*to\s*sort/i,
                    `${people.length - totalAssigned} personer igjen å sortere`
                  )
                : `Klikk på en kategori først, og klikk deretter på personer for å tilordne dem. ${
                    people.length - totalAssigned
                  } personer igjen å sortere`}
            </p>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {isLoading ? (
                <p>Laster kategorier...</p>
              ) : categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`${cat.color} ${
                      selectedCategory === cat.id
                        ? `ring-2 ${cat.borderColor}`
                        : ""
                    } ${
                      cat.hoverColor
                    } rounded-2xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105`}
                  >
                    <h3 className="text-xl font-bold text-center mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-center text-gray-700 mb-4">
                      {cat.description}
                    </p>
                    <div className="flex justify-center mb-3">
                      <Image
                        src={ cat?.image?.url}
                        alt={cat.name}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    {assignments[cat.id] && assignments[cat.id].length > 0 && (
                      <div className="text-center">
                        <span className="bg-white px-3 py-1 rounded-full text-sm font-bold">
                          {assignments[cat.id].length} valgt
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : null}
            </div>

            {/* Instructions */}
            <p className="text-center text-gray-700 mb-4 font-medium">
              Klikk på en person for å velge:
            </p>

            {/* People Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {isLoading ? (
                <p>Laster personer...</p>
              ) : people && people.length > 0 ? (
                people.map((person) => {
                  const category = getPersonCategory(person.id);
                  const borderColor = getPersonBorderColor(person.id);

                  return (
                    <div
                      key={person.id}
                      onClick={() => handlePersonClick(person.id)}
                      className={`${
                        category
                          ? `bg-white ring-2 ${borderColor}`
                          : "bg-orange-50 hover:bg-orange-100"
                      } rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-105`}
                    >
                      <h4 className="font-bold text-gray-800 mb-1">
                        {person.name}
                      </h4>
                      <p className="text-sm text-gray-600">{person.text}</p>
                    </div>
                  );
                })
              ) : null}
            </div>

            {/* Check Button */}
            <div className="flex justify-center">
              <button
                onClick={handleCheckAnswers}
                disabled={!canCheckAnswers}
                className={`${
                  canCheckAnswers
                    ? "bg-orange-400 hover:bg-[#FF9E1C] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed opacity-50"
                } text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2`}
              >
                ★ Sjekk svarene mine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
