"use client";
import { useGetSettingContentWithTypeQuery } from "@/redux/features/allcontent/allcontent";
import parse from 'html-react-parser';

const Page = () => {
  const {data, } = useGetSettingContentWithTypeQuery('privacy_policy');
  
 return (
 <div className="w-full xxl:container  mx-auto py-20 px-5 md:py-[130px]">
      {/* Title */}
        <div className=" flex items-center gap-3 mb-8 justify-center">
          <h2 className="text-xl md:text-3xl lg:text-[48px]  font-bold text-gray-900">
             Personvern<span className="font-bold" style={{ color: '#FF9E1C' }}> erklæring</span>
          </h2>
          <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
        </div>
      {/* Content Sections */}
      <div className="space-y-10 w-full md:max-w-5xl mx-auto">
        {/* <p className="text-sm text-gray-600 mb-8 text-left">
      Effective Date: {currentDate}
    </p> */}
        {/* API HTML Content */}
        <div className="w-full md:max-w-7xl mx-auto prose prose-lg">
            {parse(data?.content || "<p>Ingen innhold tilgjengelig</p>")}
         </div>
        </div>
 </div>
 );
};

export default Page;