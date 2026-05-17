"use client";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import tirProint from "@/assets/Modules/tirProint.png";
import Group from "@/assets/Modules/Group.png";
import Stop from "@/assets/Modules/Stop.png";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  selectSelectedModule,
  setSelectedModule,
} from "@/redux/features/modules/moduleSlice";
import { useDispatch } from "react-redux";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter()
  const selectedModule = useSelector(selectSelectedModule);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const childId = searchParams.get("childId");

  // Check if selectedModule has data, if not fetch from API
  const { data } = useGetModulesByIdQuery("695b946312423eb787bb458d", {
    skip:
      selectedModule !== null &&
      selectedModule !== undefined &&
      Object.keys(selectedModule).length > 0,
  });

  /** ================ Mutaions============ */
  const [updateCheckPoints] = useUpdateCheckPointsMutation();

  const checkpointHanlder = async () => {
  try {
    // 1️⃣ Intro Page Update
    const introBody = {
      moduleNumber: 1,
      checkpoint: "learning_content",
      childProfileId: childId,
    };

    await updateCheckPoints({ updatesBody: introBody }).unwrap();

    // 2️⃣ Læringsinnhold Update
    const learningBody = {
      moduleNumber: 1,
      checkpoint: "interactive_task",
      childProfileId: childId,
    };

    const response = await updateCheckPoints({
      updatesBody: learningBody,
    }).unwrap();
    if (response?.code === 200) {
      router.push(`/Interacivegame?childId=${childId}`);
    }
  } catch (error) {
    toast.error("Feil ved oppdatering");
  }
};

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto mx-auto px-4 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="py-3 sm:py-4">
          <Link href={`/modulesone?childId=${childId}`}>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Tilbake til Modul 01
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

          {/* First Info Box */}
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
                {selectedModule?.learningContent[0]?.content?.text ||
                  `Hei! Internett er spennende, men du trenger noen enkle regler,
                akkurat som når du går ut. Personopplysninger er detaljer
                som identifiserer hvem du er og hvor du bor, som fullt navn,
                adresse, telefonnummer og hvilken skole du går på. Denne
                informasjonen tilhører deg, og det er du som bestemmer hvem som får vite den.`}
              </p>
            </div>
          </div>

          {/* Image Statics For now */}

          {/* Illustration */}
          <div className=" flex justify-center">
            <Image
              className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-[625px] h-auto"
              width={625}
              height={445}
              src={
                selectedModule?.learningContent?.[1]?.image?.url
                  ? selectedModule.learningContent[1].image.url
                  : Stop
              }
              alt="Stop sign illustration"
              priority
            />
          </div>

          {/* Second Info Box */}
          <div className="bg-[#FFDFD280] p-3 sm:p-2 lg:p-4 mb-6  rounded-lg">
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
                {selectedModule?.learningContent[1]?.content?.text ||
                  `Hvis noe på nettet får deg til å føle deg rar, sint, redd eller
                urolig, er det et tegn på at du bør stoppe. Det er VELDIG viktig å
                fortelle det til en trygg voksen. Det er aldri din feil, og den voksne vil hjelpe deg.`}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <div
              onClick={checkpointHanlder}
            >
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
