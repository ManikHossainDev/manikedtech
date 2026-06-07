/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import ReviewCard from "./ReviewCard";
import { useGetReviewsQuery } from "@/redux/features/certificates/certificates";

const ParentReviews = ({quote}:any) => {
    const displayTitle = quote?.title || 'Slik fungerer Mobilklar';
  const [isPaused, setIsPaused] = useState(false);
  const { data } = useGetReviewsQuery({});

  const reviews = data?.data || [];
  const duplicatedReviews = [...reviews, ...reviews];

  console.log(reviews)

  return (
    <div>
      <section className="w-full xxl:container mx-auto md:pt-[100px] pt-10">
        <div className="pl-4 xl:pl-0 flex items-center gap-3 mb-8">
          <h2 className="text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900">
            {displayTitle}
          </h2>
         
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex gap-6"
            style={{
              animation: isPaused ? 'none' : 'marquee 30s linear infinite'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedReviews.map((review, index) => (
              <ReviewCard
                key={index}
                index={index}
                rating={review.rating}
                review={review.review}
                name={review.userName}
                image={review.userProfileImage}
                createdAt={review.createdAt}
                averageRating={review.averageRating}
                comment={review.comment}
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    </div>
  );
};

export default ParentReviews;