"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useGetFamilyAgreementsByChildrenQuery } from "@/redux/features/aggrements/familyAggrements";

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

type SafetyCommunicationResponse = {
  _id: string;
  childName: string;
  sections: Section[];
};

type FormData = Record<string, string>;

/* ================= COMPONENT ================= */

const SafetyCommunicationClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childrenId = searchParams.get("childId");

  const { data: safetyCommunications } = useGetFamilyAgreementsByChildrenQuery({
    childrenId,
    step: 3,
  }) as { data?: SafetyCommunicationResponse };

  const [formData, setFormData] = useState<FormData>({});

  /* ================= INIT FORM ================= */

  useEffect(() => {
    if (!safetyCommunications) return;

    const section = safetyCommunications.sections.find(
      (section) => section.step === 3
    );

    if (!section) return;

    const initialData: FormData = {};
    section.questions.forEach((q) => {
      initialData[q.questionId] = "";
    });

    setFormData(initialData);
  }, [safetyCommunications]);

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

    const section = safetyCommunications?.sections.find(
      (section) => section.step === 3
    );

    if (!section) return;

    const stepData = Object.entries(formData).map(([qId, answer]) => {
      const question = section.questions.find((q) => q.questionId === qId);

      return {
        q_name: question?.questionText ?? "",
        q_ans: answer,
        step: 3,
      };
    });

    const existingData = JSON.parse(
      localStorage.getItem("familyAgreementData") || "{}"
    );
    existingData.step3 = stepData;
    localStorage.setItem("familyAgreementData", JSON.stringify(existingData));

    const params = new URLSearchParams();
    if (childrenId) params.set("childId", childrenId);

    router.push(`/familyagreement/Activityconsequences?${params.toString()}`);
  };

  const handlePrevious = () => {
    const params = new URLSearchParams();
    if (childrenId) params.set("childId", childrenId);

    router.push(`/familyagreement/contentrules?${params.toString()}`);
  };

  /* ================= DATA ================= */

  const safetySection = safetyCommunications?.sections.find(
    (section) => section.step === 3
  );

  /* ================= UI ================= */

  return (
    <div className="flex flex-col items-center pt-2 md:p-4">
      <Toaster position="top-center" />

      <div className="bg-white rounded-2xl shadow-lg w-full p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            {safetySection?.sectionType}
          </h1>
          <span className="text-sm text-gray-500">
            {safetySection?.progress}%
          </span>
        </div>

        {/* Progress */}
          <div className="mb-8">
          <span className="text-sm text-gray-600">
            Trinn {safetySection?.step} av 4
          </span>

          <div className="w-full bg-orange-100 rounded-full h-3 mt-2">
            <div
              className="bg-[#FF9E1C] h-3 rounded-full"
              style={{ width: `${safetySection?.progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {safetySection?.questions.map((question) => (
            <div key={question.questionId}>
              <h2 className="font-semibold mb-3">{question.questionText}</h2>
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

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handlePrevious}
            className="border px-6 py-3 rounded-full font-semibold"
          >
            Forrige
          </button>

          <button
            onClick={handleNext}
            className="bg-[#FF9E1C] text-white px-6 py-3 rounded-full font-semibold"
          >
            Neste
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyCommunicationClient;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import { useGetFamilyAgreementsByChildrenQuery } from "@/redux/features/aggrements/familyAggrements";

// // Define types based on the data structure
// type Option = {
//   text: string;
//   value: string;
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
//   [key: string]: string | string[];
// };

// const SafetyCommunicationClient = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const childrenId = searchParams.get("childId");

//   const { data: safetyCommunications } = useGetFamilyAgreementsByChildrenQuery({
//     childrenId,
//     step: 3,
//   });
//   console.log(safetyCommunications);

//   // Initialize formData based on the questions from the API
//   const [formData, setFormData] = useState<FormData>({});

//   // Update formData when safetyCommunications data changes
//   useEffect(() => {
//     if (safetyCommunications?.length > 0) {
//       const initialFormData: FormData = {};

//       // Find the section with step 3 (Safety & Communication)
//       const safetyCommunicationSection = safetyCommunications[0].sections.find(
//         (section: Section) => section.step === 3
//       );

//       if (safetyCommunicationSection) {
//         safetyCommunicationSection.questions.forEach((question: Question) => {
//           // Set initial value to the selected answer if it exists, otherwise empty string/array
//           if (question.allowMultiple) {
//             initialFormData[question.questionId] = question.selectedAnswer
//               ? [question.selectedAnswer]
//               : [];
//           } else {
//             initialFormData[question.questionId] =
//               question.selectedAnswer || "";
//           }
//         });

//         setFormData(initialFormData);
//       }
//     }
//   }, [safetyCommunications]);

//   const handleOptionChange = (questionId: string, value: string | string[]) => {
//     setFormData((prev) => ({ ...prev, [questionId]: value }));
//   };

//   const isFormValid = () => {
//     if (safetyCommunications?.length === 0) return false;

//     const safetyCommunicationSection = safetyCommunications[0].sections.find(
//       (section: Section) => section.step === 3
//     );

//     if (!safetyCommunicationSection) return false;

//     // Check if all questions have answers
//     for (const question of safetyCommunicationSection.questions) {
//       if (
//         !formData[question.questionId] ||
//         (Array.isArray(formData[question.questionId]) &&
//           (formData[question.questionId] as string[]).length === 0)
//       ) {
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleNext = () => {
//     if (!isFormValid()) {
//       toast.error("Please answer all questions before proceeding.");
//       return;
//     }

//     // Store form data in localStorage in the requested format
//     const stepData: any = [];

//     // Add each question and its answer to the array
//     if (safetyCommunications?.length > 0) {
//       const safetyCommunicationSection = safetyCommunications[0].sections.find(
//         (section: Section) => section.step === 3
//       );

//       if (safetyCommunicationSection) {
//         safetyCommunicationSection.questions.forEach((question: Question) => {
//           const answer = formData[question.questionId];

//           stepData.push({
//             q_name: question.questionText,
//             q_ans: answer ? String(answer) : "",
//             step: 3,
//           });
//         });
//       }
//     }

//     // Save to localStorage
//     const existingData = JSON.parse(
//       localStorage.getItem("familyAgreementData") || "{}"
//     );
//     existingData["step3"] = stepData;
//     localStorage.setItem("familyAgreementData", JSON.stringify(existingData));

//     // Navigate to next step with only childId
//     const params = new URLSearchParams();
//     if (childrenId) {
//       params.set("childId", childrenId);
//     }

//     router.push(`/familyagreement/Activityconsequences?${params.toString()}`);
//   };

//   const handlePrevious = () => {
//     // Navigate to previous step with only childId
//     const params = new URLSearchParams();
//     if (childrenId) {
//       params.set("childId", childrenId);
//     }

//     router.push(`/familyagreement/contentrules?${params.toString()}`);
//   };

//   // Get the current section data
//   const safetyCommunicationSection = safetyCommunications?.[0]?.sections?.find(
//     (section: Section) => section.step === 3
//   );

//   return (
//     <div className=" flex flex-col items-center justify-start mt-2 md:p-4">
//       <Toaster position="top-center" />
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-full p-2 md:p-8">
//         {/* Header */}
//         <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
//           {safetyCommunicationSection?.sectionType || "Safety & Communication"}
//         </h1>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm text-gray-600">
//               Step {safetyCommunicationSection?.step || 3} of 4
//             </span>
//             <span className="text-sm text-gray-600">
//               {safetyCommunicationSection?.progress || 75}%
//             </span>
//           </div>
//           <div className="w-full bg-orange-100 rounded-full h-3">
//             <div
//               className="bg-[#FF9E1C] h-3 rounded-full transition-all duration-300"
//               style={{
//                 width: `${safetyCommunicationSection?.progress || 75}%`,
//               }}
//             ></div>
//           </div>
//         </div>

//         {/* Form Questions */}
//         <div className="space-y-8">
//           {safetyCommunicationSection?.questions.map((question: Question) => (
//             <div key={question.questionId}>
//               <h2 className="text-base font-semibold text-gray-900 mb-4">
//                 {question.questionText}
//               </h2>
//               <div className="space-y-3">
//                 {question.options.map((option: Option) => (
//                   <label
//                     key={option.value}
//                     className="flex items-center cursor-pointer group"
//                   >
//                     <input
//                       type="radio"
//                       required
//                       name={question.questionId}
//                       value={option.value}
//                       checked={
//                         String(formData[question.questionId]) === option.value
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
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex gap-4 mt-8 items-center justify-between">
//           <button
//             onClick={handlePrevious}
//             className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-full border-2 border-gray-300 transition-colors duration-200 max-w-[200px]"
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNext}
//             className="flex-1 bg-[#FF9E1C] hover:bg-[#FF9E1C] text-white font-semibold py-3.5 px-6 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg max-w-[200px]"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SafetyCommunicationClient;
