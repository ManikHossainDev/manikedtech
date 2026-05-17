/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Certificate from "@/assets/Certificate/Certificate.png";
import Profile from "@/assets/Certificate/Profile.png";
import { Button } from "antd";
import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { useRef } from "react";
import { toPng } from 'html-to-image';
import { useGetSingleChildQuery } from "@/redux/features/childprofiles/childprofiles";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const certificateRef = useRef(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("childId");
  const {data} = useGetSingleChildQuery(id)
  const certificateNumber = data?.data?.certificateNumber;
  const dateAtissu = new Date(data?.data?.issuedAt)
  const childInfo = data?.data?.childInfo;
  
  const Profiles = data?.data?.childInfo?.profilePicture;
  console.log(Profiles)
  const topics = data?.data?.modulesCompleted;

  const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  

  const certificateData = {
    name: childInfo?.fullName || '',
    parentName:childInfo?.parentName || '',
    dateOfBirth: childInfo?.dateOfBirth || '',
    certificateNumber: certificateNumber || '',
    age:childInfo?.age || '',
    dateOfIssue: dateAtissu || '',
  };

  const handleDownload = async () => {
    if (certificateRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2, // Higher quality image
        backgroundColor: '#ffffff', // White background
        skipFonts: false, // Include fonts
        includeQueryParams: true, // Include query params for images
      });

      // Create a link and trigger download
      const link = document.createElement('a');
      link.download = `certificate-${certificateData.name.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate:', err);
    }
  };

  return (
    <div>
     <div className="w-full md:max-w-3xl mx-auto my-5">
        <div className="flex justify-between items-center my-1">
         <Button 
          className="bg-[#FF9E1C] text-white font-semibold py-3"
        >
          <Link href="/AddChildren" className=" flex items-center ">
              <ChevronLeft className="font-bold" /> Tilbake til dashbord
          </Link>
        </Button>
        <Button 
          onClick={handleDownload}
          className="bg-[#FF9E1C] text-white flex items-center font-semibold py-3"
        >
          <FiDownload className="font-bold" /> Last ned
        </Button>
      </div>
      {/* ================================this section download hobe =========================== */}
      <div ref={certificateRef} className="relative rounded-md mb-10 bg-white">
        <Image 
          src={Certificate} 
          width={800} 
          height={500} 
          alt="Certificate" 
          className="mx-auto object-fill w-full h-auto" 
        />
        <div className=" absolute top-[121px] sm:top-[185px] md:top-[310px] left-1 ">
          <Image 
            src={Profiles ? Profiles : Profile} 
            width={182} 
            height={226} 
            alt="Profile" 
            className=" w-[52px] sm:w-[70px] h-[75px] md:w-[138px] md:h-[160px] rounded-md" 
          />
        </div>
        <div className="w-[185px] md:w-full absolute top-[175px] sm:top-[240px] md:top-[425px] 
                right-[14px] sm:right-[19px] md:right-[28px] 
                max-w-md grid grid-cols-2 gap-1">

        {topics?.map((module: any) => (
  <button
    key={module.moduleNumber}
    className="bg-orange-100  w-full hover:shadow-lg text-left 
               transition-all duration-300 px-4 p-[2px] sm:p-[1px] md:p-1 
               rounded-md border-2 border-transparent 
               hover:border-orange-300 transform hover:scale-105"
  >
    <h2 className="text-[6px] sm:text-[9px] md:text-[15px] 
                   font-semibold text-gray-800">

      {/* 📱 Mobile (default) → 5 characters */}
      <span className="block sm:hidden">
        {truncate(module.moduleName, 15)}
      </span>

      {/* 💻 Tablet & Desktop → 20 characters */}
      <span className="hidden sm:block">
        {truncate(module.moduleName, 20)}
      </span>

    </h2>
  </button>
))}

      </div>
        <div className=" bg-[#FFFFFF] rounded-lg absolute top-[118px] sm:top-[160px] md:top-[290px] right-[14px] md:right-[32px] w-[185px] md:w-[450px] grid grid-cols-3 sm:gap-1 md:gap-3 p-1 md:p-2 px-1">
          {/* Name/Surname */}
          <div>
            <p className="text-[5px] sm:text-[7px] md:text-xs text-gray-500 mb-2">Navn/ Etternavn</p>
            <p className="text-[5px] sm:text-[7pxl] md:text-sm text-gray-800">
              {certificateData.name}
            </p>
          </div>

          {/* Parent Name/Surname */}
          <div>
            <p className="text-[5px] sm:text-[7px] md:text-xs text-gray-500 mb-2">Foreldrenavn</p>
            <p className="text-[5px] sm:text-[7pxl] md:text-sm text-gray-800">
              {certificateData.parentName}
            </p>
          </div>

          {/* Date of Birth */}
          <div className="lg:flex lg:justify-center">
            <div>
              <p className="text-[5px] sm:text-[7px] md:text-xs text-gray-500 mb-2">Fødselsdato</p>
              <p className="text-[5px] sm:text-[7pxl] md:text-sm text-gray-800">
              {certificateData.dateOfBirth}
              </p>
            </div>
          </div>

          {/* age  */}
          <div>
            <p className="text-[5px] sm:text-[7px] md:text-xs text-gray-500 mb-2">Barnets alder</p>
            <p className="text-[5px] sm:text-[7pxl] md:text-sm text-gray-800">
              {certificateData.age}
            </p>
          </div>

          {/* Certificate Number */}
          <div className="">
            <p className="text-[5px] sm:text-[7px] md:text-xs text-gray-500 mb-2">SERTIFIKATNUMMER</p>
            <p className="text-[5px] sm:text-[7pxl] md:text-sm text-gray-800">
              {String(certificateData.certificateNumber).slice(0, 15)}
            </p>
          </div>

          {/* Date of Issue */}
          <div className="lg:flex lg:justify-center">
            <div className="">
               <p className="text-[5px] sm:text-[7px] md:text-xs text-gray-500 mb-2">UTSTEDELSESDATO</p>
               <p className="text-[5px] sm:text-[7pxl] md:text-sm text-gray-800">
              {certificateData.dateOfIssue instanceof Date ? certificateData.dateOfIssue.toLocaleDateString() : certificateData.dateOfIssue}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ================================this section download hobe =========================== */}
    </div>
    </div>
  );
};

export default Page;




