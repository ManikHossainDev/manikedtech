"use client";
import { useState } from "react";
import ReviewCard from "./ReviewCard";

const ParentReviews = () => {
    const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      rating: 4,
      review: "Absolutt! Jeg snakker gjerne om dette. Jeg tror dette har vært utrolig nyttig over så lang tid. Det er akkurat det vi har diskutert – og det gjelder fremdeles!",
      name: "Alanna Navn",
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      bgColor: "bg-orange-50"
    },
    {
      rating: 4,
      review: "Jeg synes det er fantastisk! Det er fremdeles ikke mye av det store, men verktøyene er virkelig nyttige. Du vet, jeg er glad for at vi endelig har noe så bra!",
      name: "Alanna Navn",
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      bgColor: "bg-orange-100"
    },
    {
      rating: 4,
      review: "Det var en strålende leksjon! Mye skjer i 99 % av tilfellene. Ikke for mye, ikke for lite – akkurat passe. Helt utmerket og anbefales på det sterkeste!",
      name: "Alanna Navn",
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      bgColor: "bg-orange-50"
    },
    {
      rating: 5,
      review: "Enestående tjeneste! Kvaliteten overgikk mine forventninger, og leveringen var rask. Anbefales på det sterkeste til alle som ønsker et pålitelig produkt!",
      name: "John Smith",
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      bgColor: "bg-orange-100"
    },
    {
      rating: 5,
      review: "Dette er akkurat det jeg lette etter! Stor oppmerksomhet på detaljer og utmerket kundestøtte gjennom hele prosessen. Veldig fornøyd!",
      name: "Sarah Johnson",
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      bgColor: "bg-orange-50"
    }
  ];

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];
 return (
 <div>
    <section className="w-full xxl:container  mx-auto md:pt-[100px] pt-10 "> 
          <div className="pl-4 xl:pl-0 flex items-center gap-3 mb-8">
          <h2 className="text-xl md:text-3xl lg:text-[48px] font-bold text-gray-900  ">
            Foreldre<span className="font-bold" style={{ color: '#FF9E1C',}}>omtaler</span>
          </h2>
          <span className="text-xl md:text-3xl lg:text-5xl">🔥</span>
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
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
    </section>
 </div>
 );
};

export default ParentReviews;