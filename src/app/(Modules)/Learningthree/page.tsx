"use client";

import { FaArrowLeft, FaStar } from "react-icons/fa";
import tirProint from "@/assets/Modules/tirProint.png";
import Group from "@/assets/Modules/Group.png";
import LearningThree from "@/assets/Modules/LearningThree.png";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

const Page = () => {
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter()
        const [updateCheckPoints] = useUpdateCheckPointsMutation();
         const startLeaningHanlder = async () => {
        try {
          const introBody = {
            moduleNumber: 3,
            checkpoint: "learning_content",
            childProfileId: childId,
          };
          await updateCheckPoints({ updatesBody: introBody }).unwrap();
          const learningBody = {
            moduleNumber: 3,
            checkpoint: "interactive_task",
            childProfileId: childId,
          };
          const response = await updateCheckPoints({
            updatesBody: learningBody,
          }).unwrap();
          if (response?.code === 200) {
            router.push(`/InteractiveGamethree?childId=${childId}`);
          }
        } catch (error) {
          console.log(error)
        }
      };

  // Fetch module only if redux is empty
  const { data } = useGetModulesByIdQuery("6936619e511d202f50100576", {
    skip:
      selectedModule &&
      Object.keys(selectedModule).length > 0,
  });

  useEffect(() => {
    if (
      (!selectedModule || Object.keys(selectedModule).length === 0) &&
      data?.data
    ) {
      dispatch(setSelectedModule(data.data));
    }
  }, [selectedModule, data, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto mx-auto px-4 sm:px-4 lg:px-6">

        {/* Header */}
        <div className="py-3 sm:py-4">
          <Link href={`/modulesthree?childId=${childId}`}>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Tilbake til Modul 03
              </span>
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-2 lg:p-4 bg-white shadow-md rounded-2xl sm:rounded-3xl lg:rounded-[50px]">

          {/* Læringsinnhold Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Image
              alt="Learning icon"
              src={tirProint}
              className="w-6 h-6 sm:w-8 sm:h-8"
              width={32}
              height={32}
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              Læringsinnhold
            </h1>
          </div>

          {/* First Info Box */}
          <div className="bg-[#FFDFD280] p-3 sm:p-4 lg:p-6 mb-6 rounded-lg">
            <div className="flex gap-3">
              <Image
                alt="Character icon"
                src={Group}
                width={30}
                height={30}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {selectedModule?.learningContent?.[0]?.content?.text || ""}
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex justify-center mb-6">
            <Image
              className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-[625px] h-auto"
              width={625}
              height={445}
              src={
                selectedModule?.learningContent?.[1]?.image?.url
                  ? selectedModule.learningContent[1].image.url
                  : LearningThree
              }
              alt="Learning illustration"
              priority
            />
          </div>

          {/* Second Info Box */}
          <div className="bg-[#FFDFD280] p-3 sm:p-4 lg:p-6 mb-6 rounded-lg">
            <div className="flex gap-3">
              <Image
                alt="Character icon"
                src={Group}
                width={30}
                height={30}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {selectedModule?.learningContent?.[1]?.content || ""}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <div onClick={startLeaningHanlder}>
              <button className="bg-[#FF9E1C] text-white font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg flex items-center gap-2 shadow-md">
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
