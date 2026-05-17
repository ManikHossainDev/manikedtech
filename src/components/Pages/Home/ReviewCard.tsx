/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { AiFillStar as Star } from 'react-icons/ai';

const ReviewCard = ({ rating, review, name, image, index }:any) => {
  // Check if index is odd (1, 3, 5, etc.)
  const isOdd = index % 5 !== 0;
  
  return (
    <div 
      className={`rounded-lg p-2 md:p-6 shadow-md min-w-[320px] max-w-sm flex-shrink-0 bg-white ${
        isOdd ? 'border border-gray-200' : ''
      }`}
      style={isOdd ? {
        background: 'linear-gradient(139.36deg, #FFFFFF 59.73%, rgba(255, 158, 28, 0.5) 106.27%)'
      } : undefined}
    >
      {/* Star Rating */}
      <div className='flex justify-between items-center'>
        <div className="flex gap-1 ">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-8 h-8 ${
              i < rating
                ? 'fill-orange-400 text-orange-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
      <div>
        <div className="">20-05-25</div>
      </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 px-1">
        {review}
      </p>

      {/* User Info */}
      <div className='flex justify-between items-center'>
        <div className="flex items-center gap-3">
        <Image
          width={40}
          height={40}
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>
       <h1 className='text-orange-400'>(4.5)</h1>
      </div>
    </div>
  );
};

export default ReviewCard;