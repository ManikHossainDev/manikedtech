/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image"
import faq from "@/assets/HeroBannerSection/faw.png"
import { ChevronDown } from 'lucide-react';
import { useState } from "react";
import { useGetAllFaqsQuery } from "@/redux/features/allcontent/allcontent";

const AboutUsPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { data, isLoading, isError } = useGetAllFaqsQuery("");
  
  // Extract FAQ data from API response
  const faqs = data || [];

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full xxl:container  mx-auto  py-20 px-2 md:py-[130px]">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <h2 className="text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
          Ofte <span className="font-bold" style={{ color: '#FF9E1C' }}> stilte </span> spørsmål
        </h2>
        <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
      </div>
      
      <div className="md:flex justify-between items-center lg:px-10">
        <div className="w-full md:w-[50%]">
          <div className="space-y-3 lg:px-10">
            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Laster vanlige spørsmål...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-10">
                <p className="text-red-600">Kunne ikke laste vanlige spørsmål. Prøv igjen senere.</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Ingen vanlige spørsmål tilgjengelig akkurat nå.</p>
              </div>
            ) : (
              faqs.map((faqItem: any, index: number) => (
                <div
                  key={faqItem._id}
                  className="bg-[#FFDFD280] rounded-xl shadow-md border border-orange-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-1 md:px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 hover:bg-orange-50"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="font-bold text-lg flex-shrink-0">
                        {index + 1}.
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 flex-1">
                        {faqItem.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-700 ease-in-out ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="md:px-6 pb-5 pt-1">
                      <div className="pl-8">
                        <p className="text-gray-600 leading-relaxed">
                          {faqItem.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="w-full md:w-[50%]">
          <Image className="w-full" src={faq} alt="image" width={500} height={500} />
        </div>
      </div>
    </section>
  )
}

export default AboutUsPage