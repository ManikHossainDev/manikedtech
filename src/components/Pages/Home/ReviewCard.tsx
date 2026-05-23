/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { AiFillStar as Star } from 'react-icons/ai';

const ReviewCard = ({ rating, review, name, image, index, createdAt, averageRating, comment }: any) => {
  const isOdd = index % 5 !== 0;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    : '';

  return (
    <div
      className={`rounded-lg p-2 md:p-6 shadow-md min-w-[320px] max-w-sm flex-shrink-0 bg-white flex flex-col justify-between ${
        isOdd ? 'border border-gray-200' : ''
      }`}
      style={isOdd ? {
        background: 'linear-gradient(139.36deg, #FFFFFF 59.73%, rgba(255, 158, 28, 0.5) 106.27%)'
      } : undefined}
    >
      {/* Top Content */}
      <div>
        {/* Star Rating */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i < rating ? 'fill-orange-400 text-orange-400' : 'fill-gray-300 text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>

        {/* Review Text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 px-1">{review}</p>
        <p>{comment}</p>
      </div>

      {/* User Info — always at bottom */}
      <div className="flex justify-between items-center mt-4">
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
        <h1 className="text-orange-400">({averageRating ?? rating}.0)</h1>
      </div>
    </div>
  );
};

export default ReviewCard;