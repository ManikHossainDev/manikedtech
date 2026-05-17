/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import heroImage from "@/assets/HeroBannerSection/HeroSection.png";
import { useSelector } from "react-redux";
import {
  selectPayment,
  setPayment,
} from "@/redux/features/payments/paymentSlice";
import {
  useCreatePaymentLinkMutation,
  useGetPaymentStatusQuery,
} from "@/redux/features/payments/payments";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LandingHero } from "@/types/landing.types";

interface HeroBannerSectionProps {
  heroData?: LandingHero;
}

const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({ heroData }) => {
  const router = useRouter();
  const FRONT_URI = process.env.NEXT_PUBLIC_FRONT_END_URL
    ? process.env.NEXT_PUBLIC_FRONT_END_URL
    : "https://mobilklar.no";
  const paymentExist = useSelector(selectPayment);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { data: paymentStatus } = useGetPaymentStatusQuery(
    {},
    { skip: !user && paymentExist?.fetched },
  );

  const [createPayment] = useCreatePaymentLinkMutation();
  const paymenLinkHandler = async () => {
    if (!user) {
      router.push("/register");
      return;
    }

    const reqBody = {
      successUrl: `${FRONT_URI}/AddChildren?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${FRONT_URI}/AddChildren`,
    };

    if (!paymentExist?.hasLifetimeAccess) {
      try {
        const res = await createPayment({ reqBody }).unwrap();
        window.location.href = res.url;
      } catch (error: any) {
        if (
          error?.data?.message ===
          "You already have lifetime access to Mobilklar"
        ) {
          router.push("/AddChildren");
        } else {
          toast.error(error?.data?.message || "Failed to create payment");
        }
      }
    } else {
      router.push("/AddChildren");
    }
  };

  useEffect(() => {
    dispatch(
      setPayment({
        hasLifetimeAccess: paymentStatus?.hasLifetimeAccess || false,
        paidAt: paymentStatus?.paidAt || null,
      }),
    );
  }, [user, dispatch, paymentStatus?.hasLifetimeAccess, paymentStatus?.paidAt]);

  // Use dynamic data or fallback to hardcoded
  const displayTitle =
    heroData?.title || "Gjør barnet ditt klart for sin første telefon – trygt, gøy og enkelt";
  const displaySubtitle =
    heroData?.subtitle ||
    "Gjør barnets telefon til et sted der kreativitet møter ansvar. Gi barnet ditt et trygt sted der læring møter utforskning.";
  const displayCtaText = heroData?.ctaText || "Start læring";

  return (
    <section className="relative h-auto  xl:h-screen py-20 px-5 overflow-hidden">
      <style>{`
        @keyframes gentleFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gentle {
          animation: gentleFadeIn 1s ease-out forwards;
        }

        .delay-1 {
          opacity: 0;
          animation-delay: 1.2s;
        }

        .delay-2 {
          opacity: 0;
          animation-delay: 1.4s;
        }

        .delay-3 {
          opacity: 0;
          animation-delay: 0.45s;
        }


      `}</style>
      {/* ✅ Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Hero background"
          fill
          className=""
          priority
        />
      </div>

      {/* ✅ Content */}
      <div className="relative -mb-10 sm:-mb-7 z-10 w-full xxl:container  mx-auto pt-5 md:pt-20 lg:pt-48 xl:pt-64 xxl:pt-72">
        <div className=" space-y-3 md:space-y-6 lg:space-y-8 w-[60%]  md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-7 lg:pr-0">
          <h1 className="animate-gentle text-base sm:text-lg   md:text-2xl lg:text-5xl xl:text-6xl font-semibold md:font-bold text-gray-900 md:leading-tight">
            {displayTitle}
          </h1>

          <p className="animate-gentle delay-1 text-xs sm:text-base md:text-lg text-gray-900 md:leading-relaxed ">
            {displaySubtitle}
          </p>

          {/* Buttons */}
          <div className="animate-gentle delay-2 md:pt-4">
            <button
              onClick={paymenLinkHandler}
              className="bg-[#FF9E1C] hover:bg-[#FF9E1C] flex items-center space-x-3 text-white font-semibold px-3 md:px-8 py-2 md:py-3 text-xs md:text-base rounded-lg transition-colors duration-200 shadow-md"
            >
              <h1>
                {!paymentExist?.hasLifetimeAccess ? `Kjøp nå – 19 $` : displayCtaText}
              </h1>{" "}
              <ArrowBigRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerSection;
