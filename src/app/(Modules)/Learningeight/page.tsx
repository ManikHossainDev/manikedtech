/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import tirProint from "@/assets/Modules/tirProint.png";
import Group from "@/assets/Modules/Group.png";
import Image from "next/image";
import Link from "next/link";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

const Page = () => {
  const id = "6936776976dca28d7e43e6c7";
  const { data, isLoading, isError } = useGetModulesByIdQuery(id);
  const { learningContent } = data?.data || {};
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

                const router = useRouter()
                const [updateCheckPoints] = useUpdateCheckPointsMutation();
                   const startLeaningHanlder = async () => {
                  try {
                    const introBody = {
                      moduleNumber: 8,
                      checkpoint: "learning_content",
                      childProfileId: childId,
                    };
                    await updateCheckPoints({ updatesBody: introBody }).unwrap();
                    const learningBody = {
                      moduleNumber: 8,
                      checkpoint: "interactive_task",
                      childProfileId: childId,
                    };
                    const response = await updateCheckPoints({
                      updatesBody: learningBody,
                    }).unwrap();
                    if (response?.code === 200) {
                      router.push(`/InteractiveGameEight?childId=${childId}`);
                    }
                  } catch (error) {
                    console.log(error)
                  }
                };
  

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Laster...</div>
      </div>
    );
  }

  // Handle error state
  if (isError || !learningContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Feil ved lasting av innhold</div>
      </div>
    );
  }

  // Get content blocks
  const textBlock = learningContent.find((block: any) => block.type === "text");
  const imageBlock = learningContent.find(
    (block: any) => block.type === "image"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto mx-auto px-4 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="py-3 sm:py-4">
          <Link href={`/moduleseight?childId=${childId}`}>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Tilbake til Modul 08
              </span>
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-2 lg:p-4 md:bg-white md:shadow-md rounded-2xl sm:rounded-3xl lg:rounded-[50px]">
          {/* Læringsinnhold Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex-shrink-0">
              <Image
                alt="Learning icon"
                src={tirProint}
                className="w-6 h-6 sm:w-8 sm:h-8"
                width={32}
                height={32}
              />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              Læringsinnhold
            </h1>
          </div>

          {/* First Info Box - Text Content */}
          {textBlock && (
            <div className="bg-[#FFDFD280] p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8 rounded-lg">
              <div className="flex gap-2 sm:gap-3 lg:gap-4">
                <div className="flex-shrink-0">
                  <Image
                    alt="Character icon"
                    src={Group}
                    width={30}
                    height={30}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  {textBlock.content.text}
                </p>
              </div>
            </div>
          )}

          {/* Illustration - Dynamic from API */}
          {imageBlock?.image?.url && (
            <div className="flex justify-center">
              <Image
                className="w-full max-w-xs sm:max-w-md mb-4 md:mb-8 h-auto"
                width={525}
                height={400}
                src={imageBlock.image.url}
                alt={imageBlock.image.alt || "Module illustration"}
                priority
              />
            </div>
          )}

          {/* Second Info Box - Image Block Content */}
          {imageBlock?.content && (
            <div className="bg-[#FFDFD280] p-3 sm:p-2 lg:p-4 mb-6 rounded-lg">
              <div className="flex gap-2 sm:gap-3 lg:gap-4">
                <div className="flex-shrink-0">
                  <Image
                    alt="Character icon"
                    src={Group}
                    width={30}
                    height={30}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  {imageBlock.content}
                </p>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center">
            <div onClick={startLeaningHanlder} >
              <button className="bg-[#FF9E1C] hover:bg-[#FF9E1C] active:bg-orange-700 text-white font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg flex items-center gap-2 shadow-md transition-colors text-sm sm:text-base">
                <FaStar className="w-4 h-4" />
                Fortsett
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Page;
