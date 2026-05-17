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
  // module id five
  const { data, isLoading, isError } = useGetModulesByIdQuery(
    "69366d40f4d0d2d1e21e1d61"
  );
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
  const { learningContent } = data?.data || {};

      const router = useRouter()
          const [updateCheckPoints] = useUpdateCheckPointsMutation();
             const startLeaningHanlder = async () => {
            try {
              const introBody = {
                moduleNumber: 5,
                checkpoint: "learning_content",
                childProfileId: childId,
              };
              await updateCheckPoints({ updatesBody: introBody }).unwrap();
              const learningBody = {
                moduleNumber: 5,
                checkpoint: "interactive_task",
                childProfileId: childId,
              };
              const response = await updateCheckPoints({
                updatesBody: learningBody,
              }).unwrap();
              if (response?.code === 200) {
                router.push(`/InteractiveGamefive?childId=${childId}`);
              }
            } catch (error) {
              console.log(error)
            }
          };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9E1C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !learningContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading module content</p>
        </div>
      </div>
    );
  }

  // Sort content by order
  const sortedContent = [...learningContent].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto mx-auto px-4 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="py-3 sm:py-4">
          <Link href={`/modulesfive?childId=${childId}`}>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Tilbake til Modul 05
              </span>
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-2 lg:p-4 bg-white shadow-md rounded-2xl sm:rounded-3xl lg:rounded-[50px]">
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

          {/* Dynamic Content Blocks */}
          {sortedContent.map((block) => {
            // Handle text type blocks
            if (block.type === "text") {
              return (
                <div
                  key={block._id}
                  className="bg-[#FFDFD280] p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8 rounded-lg"
                >
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
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                        {block.content?.text}
                      </p>
                      {/* Render list items if they exist */}
                      {block.content?.listItems &&
                        block.content.listItems.length > 0 && (
                          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                            {block.content.listItems.map(
                              (item: any, idx: any) => (
                                <li key={idx}>{item}</li>
                              )
                            )}
                          </ul>
                        )}
                    </div>
                  </div>
                </div>
              );
            }

            // Handle image type blocks
            if (block.type === "image") {
              return (
                <div key={block._id} className="mb-6 sm:mb-8">
                  {/* Image */}
                  <div className="flex justify-center mb-5">
                    <Image
                      width={500}
                      height={500}
                      className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-[625px] h-auto rounded-lg"
                      src={block.image?.url}
                      alt={block.image?.alt || "Module illustration"}
                    />
                  </div>

                  {/* Caption/Content if exists */}
                  {block.content && (
                    <div className="bg-[#FFDFD280] p-3 sm:p-4 lg:p-6 rounded-lg">
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
                          {block.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image caption if exists */}
                  {block.image?.caption && (
                    <p className="text-center text-gray-600 text-sm mt-2">
                      {block.image.caption}
                    </p>
                  )}
                </div>
              );
            }

            return null;
          })}

          {/* Continue Button */}
          <div className="flex justify-center mt-8">
            <div onClick={startLeaningHanlder}>
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
