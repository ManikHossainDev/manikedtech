/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";

// Assets
import childProfile from "@/assets/svg/Child.png";
import downloadImg from "@/assets/Certificate/downloard.png";
import notFoundImg from "@/assets/Certificate/imagenotfound.png";

// Certificate images
import m1 from "@/assets/Certificate/m1.png";
import m2 from "@/assets/Certificate/m2.png";
import m3 from "@/assets/Certificate/m3.png";
import m4 from "@/assets/Certificate/m4.png";
import m5 from "@/assets/Certificate/m5.png";
import m6 from "@/assets/Certificate/m6.png";
import m7 from "@/assets/Certificate/m7.png";
import m8 from "@/assets/Certificate/m8.png";
import m22 from "@/assets/Certificate/m22.png";
import m33 from "@/assets/Certificate/m33.png";
import m44 from "@/assets/Certificate/m44.png";
import m55 from "@/assets/Certificate/m55.png";
import m66 from "@/assets/Certificate/m66.png";
import m77 from "@/assets/Certificate/m77.png";
import m88 from "@/assets/Certificate/m88.png";

// API hooks
import { useGetChildQuery } from "@/redux/features/childprofiles/childprofiles";
import { useCertificatesLockQuery, useCreateReviewsMutation } from "@/redux/features/certificates/certificates";
import { PlusIcon } from "lucide-react";
import { Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FaStar } from "react-icons/fa";
import { useGetProfileQuery } from "@/redux/features/Profile/Profile";

/* =======================
   Types
======================= */

type TrophyType = "locked" | "unlocked" | "completed";

type Child = {
  _id: string;
  fullName: string;
  age: number;
  profileImage?: string;
  progress?: {
    modules?: { status: string }[];
  };
};

type ModuleTrophy = {
  moduleNumber: number;
  moduleName: string;
  trophyType: TrophyType;
  completedAt?: string;
  score?: number;
};

type CertificateItem = {
  id: number;
  moduleName: string;
  trophyType: TrophyType;
  image: StaticImageData;
  completedAt?: string;
  score?: number;
};

/* =======================
   Constants
======================= */

const certificateImages: Record<number, Record<TrophyType, StaticImageData>> = {
  1: { locked: m1, unlocked: m1, completed: m1 },
  2: { locked: m22, unlocked: m2, completed: m22 },
  3: { locked: m33, unlocked: m3, completed: m33 },
  4: { locked: m44, unlocked: m4, completed: m44 },
  5: { locked: m55, unlocked: m5, completed: m55 },
  6: { locked: m66, unlocked: m6, completed: m66 },
  7: { locked: m77, unlocked: m7, completed: m77 },
  8: { locked: m88, unlocked: m8, completed: m88 },
};

/* =======================
   Component
======================= */

const Page = () => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
   const [comment, setComment] = useState("");
   const [errorMessage, setErrorMessage] = useState('');

  const {data} = useGetProfileQuery([])
  const usrId = data?.data?._id;
  const { data: childrenData } = useGetChildQuery({});
  const childId = selectedChild?._id ?? "";
  const { data:certificatesData } = useCertificatesLockQuery(childId, {skip: !childId,});

  const [createReview] = useCreateReviewsMutation();

  /* =======================
     Derived Data (Optimistic)
  ======================= */

  const certificates: CertificateItem[] = useMemo(() => {
    if (!certificatesData?.moduleTrophies) return [];
    return certificatesData.moduleTrophies.map((mod: ModuleTrophy) => ({
      id: mod.moduleNumber,
      moduleName: mod.moduleName,
      trophyType: mod.trophyType,
      image:
        certificateImages[mod.moduleNumber]?.[mod.trophyType] ?? notFoundImg,
      completedAt: mod.completedAt,
      score: mod.score,
    }));
  }, [certificatesData]);

  /* =======================
     Render
  ======================= */


  /* =======================
     Handlers
  ======================= */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setHoverRating(0);
    setComment("");
  };
  
  const handleSubmitReview = async () => {
  setErrorMessage(''); // Clear previous error
  
  if (rating === 0) {
    message.warning("Vennligst velg en vurdering");
    return;
  }
  if (!comment.trim()) {
    message.warning("Vennligst skriv en anmeldelse");
    return;
  }
  
  const reviewData = {
    userId: usrId,
    rating,
    comment,
    overallRating: rating.toFixed(1),
  };
  
  const res = await createReview(reviewData);
  
  if (res.error) {
    // Validation error check
    const validationError = 'data' in res.error 
      ? (res.error.data as any)?.data?.[0]?.message 
      : null;
    
    // General error check  
    const generalError = 'data' in res.error 
      ? (res.error.data as any)?.message 
      : (res.error as any)?.message;
    
    setErrorMessage(validationError || generalError || 'Something went wrong');
    return;
  }
  
  if (res?.data?.code === 200) {
    message.success("Anmeldelse sendt inn!");
    handleCloseModal();
  }
};

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold mt-2">
        Feir barnets læringsreise!
      </h2>
      <p className="text-gray-600">
        Se og last ned sertifikater fra hver fullført modul.
      </p>

      {/* Certificate Download show hobe if  isUnlocked: true, hoi 8 ta modules ar na holeNo Certificates Yet ata dekhabe*/}
      {certificatesData && certificatesData.moduleTrophies &&
       certificatesData.moduleTrophies.length >= 6 &&
       certificatesData.moduleTrophies.every((module: any) => module.isUnlocked) ? (
        <div className="flex flex-col items-center mt-10">
          <Image src={downloadImg} width={234} height={234} alt="Download" />
          <h1 className="font-semibold mt-4">
            Last ned sertifikatene til barna dine
          </h1>
          <div className="flex justify-betwee space-x-1">
            <button  onClick={handleOpenModal} className="mt-3 flex items-center gap-1 bg-[#FF9E1C] text-white px-4 py-2 rounded-md">
              <PlusIcon /> Legg til anmeldelse
            </button>
            <Link href={`/CertificateDownloard?childId=${childId}`}>
            <button className="mt-3 flex items-center gap-1 bg-[#FF9E1C] text-white px-4 py-2 rounded-md">
              <FiDownload /> Last ned
            </button>
          </Link>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10">
          <Image
            src={notFoundImg}
            width={234}
            height={234}
            alt="No Certificates"
            className="mx-auto"
          />
          <h1 className="font-semibold mt-2">Ingen sertifikater ennå</h1>
          <p className="text-gray-500">
            Sertifikater vises når moduler er låst opp.
          </p>
        </div>
      )}

      {/* Children Selection */}
      <div className="pt-10">
        {childrenData?.data && (
          <h2 className="text-lg font-semibold mb-4">Velg ditt barn</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {childrenData?.data?.map((child: Child) => {
            const completed =
              child.progress?.modules?.filter((m) => m.status === "completed")
                .length ?? 0;

            const total = child.progress?.modules?.length ?? 0;

            return (
              <div
                key={child._id}
                onClick={() => setSelectedChild(child)}
                className={`cursor-pointer rounded-3xl p-4 bg-gradient-to-br from-[#FF9E1C] to-[#FFA726] ${
                  selectedChild?._id === child._id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <Image
                      src={child.profileImage || childProfile}
                      width={64}
                      height={64}
                      alt={child.fullName}
                      className=" w-[64px] h-[64px] rounded-full border-2 border-white"
                    />
                    <div>
                      <p className="text-white font-semibold">
                        {child.fullName}
                      </p>
                      <p className="text-white/80 text-sm">{child.age} år</p>
                    </div>
                  </div>

                  <div className="text-white text-xs text-right">
                      <p className="font-bold">Fremgang</p>
                    <p>
                      {completed}/{total} moduler
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Certificates */}
      {!!certificates.length && (
        <div className="mt-12 pb-20">
          <h2 className="text-lg font-semibold mb-4">Modulframgang</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {certificates.map((item) => (
              <div key={item.id} className="flex justify-center items-center">
                <Image
                  src={item.image}
                  width={120}
                  height={150}
                  alt={item.moduleName}
                  className={`transition ${
                    item.trophyType === "locked"
                      ? "h-[140px] "
                      : "grayscale-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Ant Design Review Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-gray-800">Skriv en anmeldelse</span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        destroyOnClose
      >
        <div className="space-y-5 pt-4">
          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Din vurdering <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={28}
                  className="cursor-pointer transition-all hover:scale-110"
                  color={star <= (hoverRating || rating) ? "#FF9E1C" : "#E5E7EB"}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              {rating > 0 && (
                <span className="ml-2 text-orange-500 font-semibold">
                  {rating}.0
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Din anmeldelse <span className="text-red-500">*</span>
            </label>
            <TextArea
              value={comment}
              onChange={(e:any) => setComment(e.target.value)}
              placeholder="Del din opplevelse..."
              rows={4}
              className="!resize-none"
            />
            {/* <p className="text-red-500 pt-2"></p> */}
            <p className="text-red-500 pt-2">{errorMessage}</p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            className="w-full bg-[#FF9E1C] text-white font-semibold py-3 rounded-lg hover:bg-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Send inn anmeldelse
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
