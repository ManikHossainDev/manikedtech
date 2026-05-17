"use client";

import { useGetFamilyAgreementsByChildrenQuery } from "@/redux/features/aggrements/familyAggrements";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/* ================= TYPES ================= */

type Option = {
  text: string;
};

type Question = {
  questionId: string;
  questionText: string;
  options: Option[];
};

type Section = {
  sectionType: string;
  step: number;
  progress: number;
  questions: Question[];
};

type ScreenTimeResponse = {
  _id: string;
  childName: string;
  sections: Section[];
};

type FormData = Record<string, string>;

/* ================= COMPONENT ================= */

export default function ScreenTimeRules() {
  const searchParams = useSearchParams();
  const childrenId = searchParams.get("childId");

  const { data: ScreenTimeSign } = useGetFamilyAgreementsByChildrenQuery({
    childrenId,
    step: 1,
  }) as { data?: ScreenTimeResponse };

  const [formData, setFormData] = useState<FormData>({});

  /* ================= INIT FORM ================= */

  useEffect(() => {
    if (!ScreenTimeSign) return;

    const screenTimeSection = ScreenTimeSign.sections.find(
      (section) => section.step === 1
    );

    if (!screenTimeSection) return;

    const initialData: FormData = {};
    screenTimeSection.questions.forEach((q) => {
      initialData[q.questionId] = "";
    });

    setFormData(initialData);
  }, [ScreenTimeSign]);

  /* ================= HANDLERS ================= */

  const handleChange = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value !== "");
  };

  const handleNext = () => {
    if (!isFormValid()) {
      toast.error("Vennligst svar på alle spørsmål før du går videre.");
      return;
    }

    const stepData = Object.entries(formData).map(([qId, answer]) => {
      const question = screenTimeSection?.questions.find(
        (q) => q.questionId === qId
      );

      return {
        q_name: question?.questionText ?? "",
        q_ans: answer,
        step: 1,
      };
    });

    const existingData = JSON.parse(
      localStorage.getItem("familyAgreementData") || "{}"
    );

    existingData.step1 = stepData;

    localStorage.setItem("familyAgreementData", JSON.stringify(existingData));

    const params = new URLSearchParams();
    if (childrenId) params.set("childId", childrenId);

    window.location.href = `/familyagreement/contentrules?${params.toString()}`;
  };

  /* ================= DATA ================= */

  const screenTimeSection = ScreenTimeSign?.sections.find(
    (section) => section.step === 1
  );

  /* ================= UI ================= */

  return (
    <div className="flex flex-col items-center pt-2 md:p-4">
      <Toaster position="top-center" />

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-full p-4 md:p-8">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-bold mb-4">
          {screenTimeSection?.sectionType}
        </h1>

        {/* Progress */}
          <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Trinn {screenTimeSection?.step} av 4</span>
            <span>{screenTimeSection?.progress}%</span>
          </div>

          <div className="w-full bg-orange-100 rounded-full h-3">
            <div
              className="bg-[#FF9E1C] h-3 rounded-full"
              style={{ width: `${screenTimeSection?.progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {screenTimeSection?.questions.map((question) => (
            <div key={question.questionId}>
              <h2 className="font-semibold mb-2">{question.questionText}</h2>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.text}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={question.questionId}
                      value={option.text}
                      checked={formData[question.questionId] === option.text}
                      onChange={(e) =>
                        handleChange(question.questionId, e.target.value)
                      }
                      className="w-5 h-5 text-orange-500"
                    />
                    <span className="ml-3">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Next */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="mt-8 bg-[#FF9E1C] text-white px-6 py-3 rounded-full font-semibold"
          >
            Neste
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useGetFamilyAgreementsByChildrenQuery } from "@/redux/features/aggrements/familyAggrements";
// import { useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";

// // Define types based on the data structure
// type Option = {
//   text: string;
// };

// type Question = {
//   questionId: string;
//   questionText: string;
//   options: Option[];
//   allowMultiple: boolean;
//   selectedAnswer: string | null;
// };

// type Section = {
//   sectionType: string;
//   step: number;
//   progress: number;
//   questions: Question[];
// };

// type FormData = {
//   [key: string]: string | boolean;
// };

// export default function ScreenTimeRules() {
//   const searchParams = useSearchParams();
//   const childrenId = searchParams.get("childId");

//   const { data: ScreenTimeSign } = useGetFamilyAgreementsByChildrenQuery({
//     childrenId,
//     step: 1,
//   });

//   console.log(ScreenTimeSign);

//   // Initialize formData based on the questions from the API
//   const [formData, setFormData] = useState<FormData>({});

//   // Update formData when ScreenTimeSign data changes
//   useEffect(() => {
//     if (ScreenTimeSign?.length > 0) {
//       const initialFormData: FormData = {};

//       // Find the section with step 1 (Screen Time Rules)
//       const screenTimeSection = ScreenTimeSign[0].sections.find(
//         (section: Section) => section.step === 1
//       );

//       if (screenTimeSection) {
//         screenTimeSection.questions.forEach((question: Question) => {
//           // Set initial value to the selected answer if it exists, otherwise empty string
//           initialFormData[question.questionId] = question.selectedAnswer || "";
//         });

//         // Also initialize the homeworkFirst checkbox
//         initialFormData["homeworkFirst"] = false;

//         setFormData(initialFormData);
//       }
//     }
//   }, [ScreenTimeSign]);

//   const handleOptionChange = (questionId: string, value: string | boolean) => {
//     setFormData((prev) => ({ ...prev, [questionId]: value }));
//   };

//   const isFormValid = () => {
//     if (ScreenTimeSign?.length === 0) return false;

//     const screenTimeSection = ScreenTimeSign[0].sections.find(
//       (section: Section) => section.step === 1
//     );

//     if (!screenTimeSection) return false;

//     // Check if all questions have answers
//     for (const question of screenTimeSection.questions) {
//       if (!formData[question.questionId]) {
//         return false;
//       }
//     }

//     // Check if homeworkFirst is checked
//     return Boolean(formData.homeworkFirst);
//   };

//   const handleNext = () => {
//     if (!isFormValid()) {
//       toast.error("Please answer all questions before proceeding.");
//       return;
//     }

//     // Store form data in localStorage in the requested format
//     const stepData = [];

//     // Add each question and its answer to the array
//     if (ScreenTimeSign?.length > 0) {
//       const screenTimeSection = ScreenTimeSign[0].sections.find(
//         (section: Section) => section.step === 1
//       );

//       if (screenTimeSection) {
//         screenTimeSection.questions.forEach((question: Question) => {
//           const answer = formData[question.questionId];

//           stepData.push({
//             q_name: question.questionText,
//             q_ans: answer ? String(answer) : "",
//             step: 1,
//           });
//         });

//         // Also add the homeworkFirst question
//         stepData.push({
//           q_name: "Homework must be done before phone time",
//           q_ans: String(formData["homeworkFirst"]) || "",
//           step: 1,
//         });
//       }
//     }

//     // Save to localStorage
//     const existingData = JSON.parse(
//       localStorage.getItem("familyAgreementData") || "{}"
//     );
//     existingData["step1"] = stepData;
//     localStorage.setItem("familyAgreementData", JSON.stringify(existingData));

//     // Navigate to next step with only childId
//     const params = new URLSearchParams();
//     if (childrenId) {
//       params.set("childId", childrenId);
//     }

//     window.location.href = `/familyagreement/contentrules?${params.toString()}`;
//   };

//   // Get the current section data
//   const screenTimeSection = ScreenTimeSign?.[0]?.sections?.find(
//     (section: Section) => section.step === 1
//   );

//   return (
//     <div className=" flex flex-col items-center justify-start pt-2 md:p-4">
//       <Toaster position="top-center" />
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-full p-2 md:p-8">
//         {/* Header */}
//         <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
//           {screenTimeSection?.sectionType || "Screen Time Rules"}
//         </h1>
//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center  b-2">
//             <span className="text-sm text-gray-600">
//               Step {screenTimeSection?.step || 1} of 4
//             </span>
//             <span className="text-sm text-gray-600">
//               {screenTimeSection?.progress || 25}%
//             </span>
//           </div>
//           <div className="w-full bg-orange-100 rounded-full h-3">
//             <div
//               className="bg-[#FF9E1C] h-3 rounded-full"
//               style={{ width: `${screenTimeSection?.progress || 25}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Form Questions */}
//         <div className="space-y-8">
//           {screenTimeSection?.questions.map((question: Question) => (
//             <div key={question.questionId}>
//               <h2 className="text-base font-semibold text-gray-900 mb-2">
//                 {question.questionText}
//               </h2>
//               <div className="space-y-3">
//                 {question.options.map((option: Option) => (
//                   <label
//                     key={option.text}
//                     className="flex items-center cursor-pointer group"
//                   >
//                     <input
//                       type="radio"
//                       name={question.questionId}
//                       required
//                       value={option.text}
//                       checked={
//                         String(formData[question.questionId]) === option.text
//                       }
//                       onChange={(e) =>
//                         handleOptionChange(question.questionId, e.target.value)
//                       }
//                       className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2 cursor-pointer"
//                     />
//                     <span className="ml-3 text-gray-700 group-hover:text-gray-900">
//                       {option.text}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {/* Additional Option - Static as requested */}
//           <div>
//             <label className="flex items-center cursor-pointer group">
//               <input
//                 type="checkbox"
//                 required
//                 checked={Boolean(formData.homeworkFirst)}
//                 onChange={(e) =>
//                   handleOptionChange("homeworkFirst", e.target.checked)
//                 }
//                 className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
//               />
//               <span className="ml-3 text-gray-700 group-hover:text-gray-900">
//                 Homework must be done before phone time
//               </span>
//             </label>
//           </div>
//         </div>

//         {/* Next Button */}
//         <div className="flex items-center justify-end">
//           <button
//             onClick={handleNext}
//             className="w-full max-w-[200px] mt-8 bg-[#FF9E1C] hover:bg-[#FF9E1C] text-white font-semibold py-3.5 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
