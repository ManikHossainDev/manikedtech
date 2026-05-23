"use client";
import { useRouter } from "next/navigation";

const NavigateButton = () => {
  const router = useRouter();

  return (
    <button className="mt-6 bg-[#FF9E1C] text-white px-2 md:px-3 py-3 rounded-full hover:bg-[#FF9E1C] transition-colors font-medium" onClick={() => router.push("/AddChildren")}>
       Tilbake til Instrumentbord
    </button>
  );
};

export default NavigateButton;