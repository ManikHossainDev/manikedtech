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

type ActivityConsequenceResponse = {
  _id: string;
  childName: string;
  sections: Section[];
};

type FormData = Record<string, string>;

/* ================= COMPONENT ================= */

const ActivityConsequencesClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childrenId = searchParams.get("childId");

  const { data: activityConsequence } = useGetFamilyAgreementsByChildrenQuery({
    childrenId,
    step: 4,
  }) as { data?: ActivityConsequenceResponse };

  const [formData, setFormData] = useState<FormData>({});

  /* ================= INIT FORM ================= */

  useEffect(() => {
    if (!activityConsequence) return;

    const section = activityConsequence.sections.find(
      (section) => section.step === 4
    );

    if (!section) return;

    const initialData: FormData = {};
    section.questions.forEach((q) => {
      initialData[q.questionId] = "";
    });

    setFormData(initialData);
  }, [activityConsequence]);

  /* ================= HANDLERS ================= */

  const handleChange = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value !== "");
  };

  const handleGenerateAgreement = () => {
    if (!isFormValid()) {
      toast.error("Vennligst svar på alle spørsmål før du går videre.");
      return;
    }

    const section = activityConsequence?.sections.find(
      (section) => section.step === 4
    );
    if (!section) return;

    const stepData = Object.entries(formData).map(([qId, answer]) => {
      const question = section.questions.find((q) => q.questionId === qId);
      return {
        q_name: question?.questionText ?? "",
        q_ans: answer,
        step: 4,
      };
    });

    const existingData = JSON.parse(
      localStorage.getItem("familyAgreementData") || "{}"
    );
    existingData.step4 = stepData;
    localStorage.setItem("familyAgreementData", JSON.stringify(existingData));

    // Pass childName and _id (as agreementId) in URL
    const params = new URLSearchParams();
    if (childrenId) params.set("childId", childrenId);
    if (activityConsequence?.childName)
      params.set("childName", activityConsequence.childName);
    if (activityConsequence?._id)
      params.set("agreementId", activityConsequence._id);

    router.push(`/createfamilyagreement?${params.toString()}`);
  };

  const handlePrevious = () => {
    const params = new URLSearchParams();
    if (childrenId) params.set("childId", childrenId);
    if (activityConsequence?.childName)
      params.set("childName", activityConsequence.childName);
    if (activityConsequence?._id)
      params.set("agreementId", activityConsequence._id);

    router.push(`/familyagreement/safetycommunication?${params.toString()}`);
  };

  /* ================= DATA ================= */

  const activitySection = activityConsequence?.sections.find(
    (section) => section.step === 4
  );

  /* ================= UI ================= */

  return (
    <div className="flex flex-col items-center pt-2 md:p-4">
      <Toaster position="top-center" />

      <div className="bg-white rounded-2xl shadow-lg w-full p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            {activitySection?.sectionType}
          </h1>
          <span className="text-sm text-gray-500">
            {activitySection?.progress}%
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <span className="text-sm text-gray-600">
            Trinn {activitySection?.step} av 4
          </span>

          <div className="w-full bg-orange-100 rounded-full h-3 mt-2">
            <div
              className="bg-[#FF9E1C] h-3 rounded-full"
              style={{ width: `${activitySection?.progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {activitySection?.questions.map((question) => (
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
            onClick={handleGenerateAgreement}
            className="bg-[#FF9E1C] text-white px-6 py-3 rounded-full font-semibold"
          >
            Opprett avtale
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityConsequencesClient;

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

// const ActivityConsequencesClient = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const childrenId = searchParams.get("childId");

//   const { data: activityConsequence } = useGetFamilyAgreementsByChildrenQuery({
//     childrenId,
//     step: 4,
//   });

//   console.log(activityConsequence);

//   // Initialize formData based on the questions from the API
//   const [formData, setFormData] = useState<FormData>({});

//   // Update formData when activityConsequence data changes
//   useEffect(() => {
//     if (activityConsequence?.length > 0) {
//       const initialFormData: FormData = {};

//       // Find the section with step 4 (Activity & Consequences)
//       const activityConsequencesSection = activityConsequence[0].sections.find(
//         (section: Section) => section.step === 4
//       );

//       if (activityConsequencesSection) {
//         activityConsequencesSection.questions.forEach((question: Question) => {
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
//   }, [activityConsequence]);

//   const handleOptionChange = (questionId: string, value: string | string[]) => {
//     setFormData((prev) => ({ ...prev, [questionId]: value }));
//   };

//   const isFormValid = () => {
//     if (activityConsequence?.length === 0) return false;

//     const activityConsequencesSection = activityConsequence[0].sections.find(
//       (section: Section) => section.step === 4
//     );

//     if (!activityConsequencesSection) return false;

//     // Check if all questions have answers
//     for (const question of activityConsequencesSection.questions) {
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

//   const handleGenerateAgreement = () => {
//     if (!isFormValid()) {
//       toast.error("Please answer all questions before proceeding.");
//       return;
//     }

//     // Store form data in localStorage in the requested format
//     const stepData: any = [];

//     // Add each question and its answer to the array
//     if (activityConsequence?.length > 0) {
//       const activityConsequencesSection = activityConsequence[0].sections.find(
//         (section: Section) => section.step === 4
//       );

//       if (activityConsequencesSection) {
//         activityConsequencesSection.questions.forEach((question: Question) => {
//           const answer = formData[question.questionId];

//           stepData.push({
//             q_name: question.questionText,
//             q_ans: answer ? String(answer) : "",
//             step: 4,
//           });
//         });
//       }
//     }

//     // Save to localStorage
//     const existingData = JSON.parse(
//       localStorage.getItem("familyAgreementData") || "{}"
//     );
//     existingData["step4"] = stepData;
//     localStorage.setItem("familyAgreementData", JSON.stringify(existingData));

//     // Navigate to final agreement page with only childId
//     const params = new URLSearchParams();
//     if (childrenId) {
//       params.set("childId", childrenId);
//     }

//     router.push(`/createfamilyagreement?${params.toString()}`);
//   };

//   const handlePrevious = () => {
//     // Navigate to previous step with only childId
//     const params = new URLSearchParams();
//     if (childrenId) {
//       params.set("childId", childrenId);
//     }

//     router.push(`/familyagreement/safetycommunication?${params.toString()}`);
//   };

//   // Get the current section data
//   const activityConsequencesSection = activityConsequence?.[0]?.sections?.find(
//     (section: Section) => section.step === 4
//   );

//   return (
//     <div className=" flex flex-col items-center justify-start mt-2 md:p-4">
//       <Toaster position="top-center" />
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-full p-2 md:p-8">
//         {/* Header */}
//         <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-6">
//           {activityConsequencesSection?.sectionType ||
//             "Activity & Consequences"}
//         </h1>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm text-gray-600">
//               Step {activityConsequencesSection?.step || 4} of 4
//             </span>
//             <span className="text-sm text-gray-600">
//               {activityConsequencesSection?.progress || 100}%
//             </span>
//           </div>
//           <div className="w-full bg-orange-100 rounded-full h-2">
//             <div
//               className="bg-[#FF9E1C] h-2 rounded-full transition-all duration-300"
//               style={{
//                 width: `${activityConsequencesSection?.progress || 100}%`,
//               }}
//             ></div>
//           </div>
//         </div>

//         {/* Form Questions */}
//         <div className="space-y-8">
//           {activityConsequencesSection?.questions.map((question: Question) => (
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
//         <div className=" w-full flex gap-1 md:gap-4 mt-8 items-center justify-between">
//           <button
//             onClick={handlePrevious}
//             className="flex-1  bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 md:px-3 rounded-full border-2 border-gray-300 transition-colors duration-200 max-w-[200px]"
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleGenerateAgreement}
//             className="flex-1 flex items-center space-x-2 justify-center bg-[#FF9E1C] hover:bg-[#FF9E1C] text-white font-semibold py-2 md:px-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg max-w-[200px]"
//           >
//             Generate{" "}
//             <span className="font-semibold hidden md:block md:ml-2">
//               Agreement
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivityConsequencesClient;
