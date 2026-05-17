/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Certificate from "@/assets/Certificate/CreateFamilyAgreement.png";
import { Button } from "antd";
import Swal from "sweetalert2";
import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Suspense } from "react";
import { useDeleteAgreementMutation } from "@/redux/features/aggrements/familyAggrements";
import { useRouter, useSearchParams } from "next/navigation";
import { Delete } from "lucide-react";

// Define TypeScript interface for question data
interface QuestionData {
  q_name: string;
  q_ans: string;
  step: number;
}

interface LocalStorageData {
  step1?: QuestionData[];
  step2?: QuestionData[];
  step3?: QuestionData[];
  step4?: QuestionData[];
}

const AgreementContent = () => {
  const searchParams = useSearchParams();
  const childName = searchParams.get("childName");
  const agreementId = searchParams.get("agreementId");
  console.log(childName, agreementId);
  const [allQuestionsData, setAllQuestionsData] = useState<QuestionData[]>([]);
  const router = useRouter();

  const [deleteAgreementsByChildren] = useDeleteAgreementMutation();
  const handleDelete = async (childrenId: string) => {
    try {
      const res = await deleteAgreementsByChildren(childrenId);

      if (res?.data?.code === 200) {
        Swal.fire({
          title: "Slettet!",
          text: "Avtalen er slettet.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/familyagreement");
      }
    } catch (error) {
      Swal.fire({
        title: "Feil!",
        text: "Noe gikk galt.",
        icon: "error",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    // Retrieve data from localStorage
    const localStorageData: LocalStorageData = JSON.parse(
      localStorage.getItem("familyAgreementData") || "{}"
    );
    const allStepsData: QuestionData[] = [];

    // Add data from each step to the combined array
    if (localStorageData.step1) {
      allStepsData.push(...localStorageData.step1);
    }
    if (localStorageData.step2) {
      allStepsData.push(...localStorageData.step2);
    }
    if (localStorageData.step3) {
      allStepsData.push(...localStorageData.step3);
    }
    if (localStorageData.step4) {
      allStepsData.push(...localStorageData.step4);
    }

    console.log("All Steps Data:", allStepsData);
    setAllQuestionsData(allStepsData);
  }, []);

  const certificateRef = useRef<HTMLDivElement>(null);
  const certificateData = {
    name: "Manik",
    parentName: "Jesika",
    dateOfBirth: "1st July, 2004",
    certificateNumber: "MK-17597852B4096",
    dateOfIssue: "6.10.2025",
  };

  const handleDownload = async () => {
    if (certificateRef.current === null) {
      return;
    }
    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        skipFonts: false,
        includeQueryParams: true,
      });
      const link = document.createElement("a");
      link.download = `certificate-${certificateData.name.replace(
        /\s+/g,
        "-"
      )}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download certificate:", err);
    }
  };

  // Group questions by step
  const step1Questions = allQuestionsData.filter((q) => q.step === 1);
  const step2Questions = allQuestionsData.filter((q) => q.step === 2);
  const step3Questions = allQuestionsData.filter((q) => q.step === 3);
  const step4Questions = allQuestionsData.filter((q) => q.step === 4);

  return (
    <div>
      <div className="w-full md:max-w-3xl mx-auto my-5">
        <div className=" flex justify-between items-center my-1 px-4 pb-1">
          <Button
            onClick={handleDownload}
            className="bg-[#FF9E1C] text-white flex items-center font-medium py-3"
          >
            <FiDownload className="font-semibold" /> Last ned
          </Button>
          <Button
            onClick={() => handleDelete(agreementId as string)}
            className="bg-[#FF9E1C] text-red-500 flex items-center font-medium py-3"
          >
            <Delete className="font-semibold" /> Slett
          </Button>
        </div>

        <div
          ref={certificateRef}
          className="relative rounded-md mb-10 bg-white"
        >
          <Image
            src={Certificate}
            width={800}
            height={700}
            alt="Sertifikat"
            className="mx-auto object-fill w-full h-[50vh] md:h-[90vh]"
          />

          <div className="absolute top-[100px] left-[20px] md:top-[170px] text-center lg:top-[195px] xl:top-[198px] xxl:top-[180px] sm:left-[150px] md:left-[120px] w-fit mx-auto">
            <h1 className="font-[600] flex text-[#FF9E1C] text-[24px] md:text-[40px]">
              {childName?.slice(0, 10)}{" "}
              <div className="text-black font-[600] flex text-[24px] md:text-[40px] ml-1">
                Familieavtale
              </div>
            </h1>

            <p className="text-[9px] text-gray-500">
              Nå er det på tide å skrive avtalen din
            </p>
          </div>

          <div className="absolute top-[160px] md:top-[260px] lg:top-[295px] w-fit mx-auto xl:top-[290px] xxl:top-[280px] left-[20px] sm:left-[110px] md:left-[60px]">
            <div className="grid grid-cols-2 gap-3 md:gap-6 lg:gap-10">
              {/* Left Column - Step 1 & 2 */}
              <div className="space-y-0 lg:space-y-1 xl:md:space-y-2 xxl:space-y-6">
                {/* Step 1 Data */}
                {step1Questions.length > 0 && (
                  <div>
                    <h2 className="text-[12px] md:text-[22px] lg:text-[20px] xl:text-[22px] font-semibold text-gray-900">
                      Skjermtidsregler:
                    </h2>
                    <div className="md:space-y-2">
                      {step1Questions.map((item, index) => (
                        <div key={index}>
                          <p className="text-[10px] md:text-[17px] xl:text-[16px]">
                            {item.q_name}
                          </p>
                          <p className="text-[9px] text-gray-800 md:text-[13px]">
                            {item.q_ans === "true"
                              ? "Yes"
                              : item.q_ans === "false"
                              ? "No"
                              : item.q_ans}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 Data */}
                {step2Questions.length > 0 && (
                  <div>
                    <h2 className="text-[12px] md:text-[22px] lg:text-[20px] xl:text-[22px] font-semibold text-gray-900">
                      App- og innholdsregler:
                    </h2>
                    <div className="md:space-y-2">
                      {step2Questions.map((item, index) => (
                        <div key={index}>
                          <p className="text-[10px] md:text-[17px] xl:text-[16px]">
                            {item.q_name}
                          </p>
                          <p className="text-[9px] text-gray-800 md:text-[13px]">
                            {item.q_ans}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Step 3 & 4 */}
              <div className="space-y-0 lg:space-y-1 xl:md:space-y-2 xxl:space-y-6">
                {/* Step 3 Data */}
                {step3Questions.length > 0 && (
                  <div>
                    <h2 className="text-[12px] md:text-[22px] lg:text-[20px] xl:text-[22px] font-semibold text-gray-900">
                      Sikkerhet og kommunikasjon:
                    </h2>
                    <div className="md:space-y-2">
                      {step3Questions.map((item, index) => (
                        <div key={index}>
                          <p className="text-[10px] md:text-[17px] xl:text-[16px]">
                            {item.q_name}
                          </p>
                          <p className="text-[9px] text-gray-800 md:text-[13px]">
                            {item.q_ans === "screenshot_tell"
                              ? "Take screenshot and tell parents"
                              : item.q_ans}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4 Data */}
                {step4Questions.length > 0 && (
                  <div>
                    <h2 className="text-[12px] md:text-[22px] lg:text-[20px] xl:text-[22px] font-semibold text-gray-900">
                      Konsekvenser og gjennomgang:
                    </h2>
                    <div className="md:space-y-2">
                      {step4Questions.map((item, index) => (
                        <div key={index}>
                          <p className="text-[10px] md:text-[17px] xl:text-[16px]">
                            {item.q_name}
                          </p>
                          <p className="text-[9px] text-gray-800 md:text-[13px]">
                            {item.q_ans}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading agreement...</div>}>
      <AgreementContent />
    </Suspense>
  );
};

export default Page;
