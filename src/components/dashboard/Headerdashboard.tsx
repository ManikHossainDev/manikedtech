"use client";
import { MenuOutlined } from "@ant-design/icons";
import Profile from "@/assets/Authentication/Profile.jpg";
import Image from "next/image";
import { useGetProfileQuery } from "@/redux/features/Profile/Profile";

interface HeaderdashboardProps {
  onMenuClick: () => void;
}

const Headerdashboard = ({ onMenuClick }: HeaderdashboardProps) => {
  const { data, isLoading } = useGetProfileQuery({});
  
  return (
    <header className="bg-[#FFFFFF] border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm md:ml-4 rounded-md">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <MenuOutlined className="text-xl text-gray-700" />
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Laster...
            </h1>
          ) : (
            <>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {data?.data?.firstName} <span className="text-[#FF9E1C]">{data?.data?.lastName}</span>
          </h1>
             
            </>
          )}
        </div>

        {/* Right side - User profile or notifications */}
        <div className="flex items-center space-x-4">
           {data?.data?.profile?.profilePicture?.url ? (
                <Image 
                  src={data.data.profile.profilePicture.url} 
                  alt="Profile" 
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover border-2 border-[#FF9E1C]"
                />
              ) : (
                <Image 
                  src={Profile} 
                  alt="Default Profile" 
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover"
                />
              )}
          {/* Placeholder for user avatar or profile */}
          {/* <div className="w-8 h-8 md:w-12 md:h-12 bg-[#FFDFD2] border-b-4 border-[#FF9E1C] rounded-md md:flex items-center justify-center hidden">
            <IoNotificationsOutline className="text-2xl text-[#FF9E1C]" />
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Headerdashboard;