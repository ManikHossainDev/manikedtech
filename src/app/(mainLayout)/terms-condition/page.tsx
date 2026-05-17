"use client";
import { useGetSettingContentWithTypeQuery } from "@/redux/features/allcontent/allcontent";
import parse from "html-react-parser";
const Page = () => {
  const { data } = useGetSettingContentWithTypeQuery("terms_conditions");
  return (
    <div className="w-full xxl:container  mx-auto py-20 px-5 md:py-[130px]">
      {/* Title */}
      <div className=" flex items-center gap-3 mb-8 justify-center">
        <h2 className="text-xl md:text-3xl lg:text-[48px]  font-bold text-gray-900">
          Vilkår og{" "}
          <span className="font-bold" style={{ color: "#FF9E1C" }}>
            betingelser
          </span>
        </h2>
        <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
      </div>
      {/* Content Sections */}
      <div className="space-y-10 w-full md:max-w-5xl mx-auto">
        {parse(data?.content || "<p>Ingen innhold tilgjengelig</p>")}
      </div>
    </div>
  );
};

export default Page;
