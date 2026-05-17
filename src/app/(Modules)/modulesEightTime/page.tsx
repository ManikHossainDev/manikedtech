/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaStar, FaTimes } from "react-icons/fa";
import Link from "next/link";
import spiner from "@/assets/Modules/spiner.png";
import spininisial from "@/assets/Modules/spininisial.png";
import spinmessing from "@/assets/Modules/spinmessing.png";
import spintimeproblems from "@/assets/Modules/spinstandertimecrose.png";
import spinsuccess from "@/assets/Modules/spinsuccess.png";
import levelup from "@/assets/Modules/levelup.png";
import championstime from "@/assets/Modules/championstime.png";
import Image from "next/image";
import { useGetModulesByIdQuery } from "@/redux/features/modules/modulesGet";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCheckPointsMutation } from "@/redux/features/modules/GetProgressOverview";

interface Activity {
  id: string;
  name: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  recommended: number;
  description: string;
  color: string;
}

const Page = () => {
  const id = "6936776976dca28d7e43e6c7";
  const { data, isLoading } = useGetModulesByIdQuery(id);
  console.log(data)
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const router = useRouter();
  const [updateCheckPoints] = useUpdateCheckPointsMutation();
  const startLeaningHanlder = async () => {
    try {
      const introBody = {
        moduleNumber: 8,
        checkpoint: "interactive_task",
        childProfileId: childId,
      };
      await updateCheckPoints({ updatesBody: introBody }).unwrap();
      const learningBody = {
        moduleNumber: 8,
        checkpoint: "quiz",
        childProfileId: childId,
        data: {
          score: 0,
          passed: false,
        },
      };
      const response = await updateCheckPoints({
        updatesBody: learningBody,
      }).unwrap();
      if (response?.code === 200) {
        router.push(`/modulesEightContinueQuizzes?childId=${childId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // API থেকে আসা config data
  const config = data?.data?.interactiveTasks?.[0]?.config;
  console.log(config);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  console.log(earnedBadges);

  // Color mapping for activities
  const getColorByIndex = (index: number) => {
    const colors = [
      "bg-orange-400",
      "bg-purple-400",
      "bg-green-400",
      "bg-blue-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-red-400",
    ];
    return colors[index] || "bg-gray-400";
  };

  // Initialize activities from API data
  useEffect(() => {
    if (config && config.activityToolbox) {
      const initialActivities = config.activityToolbox.map(
        (activity: any, index: number) => ({
          id: activity.id,
          name: activity.name,
          icon: activity.icon,
          value: 0,
          min: activity.min,
          max: activity.max,
          recommended: activity.recommended,
          description: activity.description,
          color: getColorByIndex(index),
        })
      );
      setActivities(initialActivities);
    }
  }, [config]);

  const totalHours = activities.reduce(
    (sum, activity) => sum + activity.value,
    0
  );
  const hasSelection = totalHours > 0;
  const allFieldsFilled = activities.every((activity) => activity.value > 0);
  const isPerfectDay = totalHours === 24 && allFieldsFilled;

  // Get activity status based on value - fully dynamic from activityToolbox
  const getActivityStatus = (activity: Activity) => {
    if (activity.value === 0) return "missing";

    const { value, recommended } = activity;

    // Dynamic status based on recommended value
    if (value === recommended) return "balanced";
    if (value < recommended) return "under";
    if (value > recommended) return "excessive";

    return "under";
  };

  // Get balance tip from API config
  const getBalanceTip = useCallback((activity: Activity) => {
    if (!config || !config.balanceTips) return null;
    const status = getActivityStatus(activity);
    return config.balanceTips.find(
      (tip: any) => tip.activity === activity.id && tip.status === status
    );
  }, [config]);

  // Get badge info by badge name from badges array
  const getBadgeByName = (badgeName: string) => {
    if (!config || !config.badges) return null;
    return config.badges.find(
      (badge: any) => badge.name.toLowerCase() === badgeName.toLowerCase()
    );
  };

  // Get dynamic message with badge for slider - shows for all values min to max
  const getDynamicMessage = (activity: Activity) => {
    if (activity.value === 0) return null;

    const { value, min, max, recommended } = activity;
    const status = getActivityStatus(activity);
    const tip = getBalanceTip(activity);

    // Get badge icon if badge exists
    let badgeIcon = "";
    let badgeName = "";
    if (tip && tip.badge) {
      const badgeInfo = getBadgeByName(tip.badge);
      if (badgeInfo) {
        badgeIcon = badgeInfo.icon;
        badgeName = badgeInfo.name;
      }
    }

    // Message from balanceTips or generate dynamic message
    let message = "";
    
    if (tip && tip.message) {
      // Use message from balanceTips
      message = tip.message;
    } else {
      // Generate message based on value
      if (value === min) {
        message = `${activity.icon} Minimum ${min}t`;
      } else if (value === max) {
        message = `${activity.icon} Maksimum ${max}t!`;
      } else if (value === recommended) {
        message = `${activity.icon} Perfekt! ${recommended}t ✓`;
      } else if (value < recommended) {
        message = `${activity.icon} ${value}t - Trenger ${recommended - value}t mer`;
      } else if (value > recommended) {
        message = `${activity.icon} ${value}t - ${value - recommended}t for mye`;
      }
    }
    
    return {
      message: message,
      badge: badgeName,
      badgeIcon: badgeIcon,
      isBalanced: status === "balanced",
      status: status,
    };
  };

  // Calculate earned badges based on API badge requirements
  useEffect(() => {
    if (!config || !allFieldsFilled || !config.balanceTips) return;

    const badges: string[] = [];
    activities.forEach((activity) => {
      const tip = getBalanceTip(activity);
      if (tip && tip.badge) {
        badges.push(tip.badge);
      }
    });

    setEarnedBadges(badges);
  }, [activities, config, allFieldsFilled, getBalanceTip]);

  const updateSlider = (index: number, newValue: number) => {
    const currentTotal = activities.reduce(
      (sum, a, i) => (i === index ? sum : sum + a.value),
      0
    );

    if (currentTotal + newValue <= 24) {
      setActivities((prev) =>
        prev.map((a, i) => (i === index ? { ...a, value: newValue } : a))
      );
    }
  };

  const handleReset = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, value: 0 })));
    setShowModal(false);
    setShowContinueButton(false);
    setEarnedBadges([]);
  };

  const handleCheckMyDay = () => {
    if (isPerfectDay) {
      setShowModal(true);
      setTimeout(() => {
        setShowContinueButton(true);
      }, 1000);
    } else {
      setShowModal(true);
      setShowContinueButton(false);
    }
  };

  const getModalContent = () => {
    const missingActivities = activities.filter(
      (activity) => activity.value === 0
    );

    if (totalHours < 24) {
      return {
        bg: "bg-[#EA3411]",
        border: "border-yellow-400",
        icon: levelup,
        title: "Oops! Manglende timer",
        message: `Du har bare planlagt ${totalHours} timer. Du har fortsatt ${ 24 - totalHours } timer igjen å planlegge din perfekte dag!,`,
        color: "text-white",
        showTips: false,
        showBadges: false,
        missingActivities: [],
      };
    } else if (totalHours === 24 && !allFieldsFilled) {
      return {
        bg: "bg-[#EA3411]",
        border: "border-orange-400",
        icon: levelup,
        title: "Manglende aktiviteter",
        message: "",
        color: "text-white",
        showTips: true,
        showBadges: false,
        missingActivities,
      };
    } else if (totalHours === 24 && allFieldsFilled) {
      return {
        bg: "bg-[#12B347]",
        border: "border-green-400",
        icon: championstime,
        title: "Perfekt balanse!",
        message:
        "Du har planlagt en balansert og sunn dag! Fortsett det gode arbeidet!",
        color: "text-white",
        showTips: true,
        showBadges: true,
        missingActivities: [],
      };
    }
    return null;
  };

  const getCenterImage = () => {
    if (!hasSelection) {
      return spininisial;
    }

    if (totalHours < 24) {
      return spintimeproblems;
    } else if (totalHours === 24 && !allFieldsFilled) {
      return spinmessing;
    } else if (totalHours === 24 && allFieldsFilled) {
      return spinsuccess;
    }
    return spininisial;
  };

  const modalContent = getModalContent();

  // Loading state
  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laster aktiviteter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full xxl:container  mx-auto mx-auto lg:px-8">
        {/* Header */}
        <div className="py-4 px-1 md:px-0">
          <Link href={`/InteractiveGameEight?childId=${childId}`}>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition">
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">
                Tilbake til Modul 08
              </span>
            </button>
          </Link>
        </div>

        {/* Main Content Container */}
        <div className="p-1 lg:p-6 bg-gradient-to-t from-orange-300 via-amber-100 to-blue-300 shadow-md rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* LEFT SIDE */}
          <div className="md:col-span-3">
            <div className="border border-[#FF9E1C] backdrop-blur-sm rounded-2xl p-2 md:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                🎨 Aktivitetsverktøykasse
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Totalt:{" "}
                <span className="font-bold text-orange-600">
                  {totalHours}/24 timer
                </span>
              </p>

              {activities.map((activity, index) => {
                const dynamicData = getDynamicMessage(activity);
                return (
                  <div key={activity.id} className="mb-8">
                    <div className="flex items-center gap-4">
                      <span className="w-[16%] text-gray-700 text-sm font-semibold flex items-center gap-1">
                        <span>{activity.icon}</span>
                        <span>{activity.name}</span>
                      </span>

                      <div className="w-[84%] relative">
                        {/* Dynamic Message with Badge - Shows for all values from min to max */}
                        {activity.value > 0 && dynamicData && (
                          <div
                            className={`absolute -top-6 text-white text-xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-10 flex items-center gap-1
                              ${dynamicData.isBalanced ? 'bg-green-500' : 
                                dynamicData.status === 'excessive' ? 'bg-red-500' : 
                                'bg-[#FF9E1C]'}`}
                            style={{
                              left: `${(activity.value / activity.max) * 100}%`,
                              transform: "translateX(-50%)",
                            }}
                          >
                            {dynamicData.badgeIcon && (
                              <span>{dynamicData.badgeIcon}</span>
                            )}
                            <span>{dynamicData.badge || dynamicData.message}</span>
                          </div>
                        )}

                        <input
                          type="range"
                          min="0"
                          max={activity.max}
                          value={activity.value}
                          onChange={(e) =>
                            updateSlider(index, parseInt(e.target.value))
                          }
                          className="w-full flex-1 h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #fb923c ${
                              (activity.value / activity.max) * 100
                            }%, #fde0c8 ${
                              (activity.value / activity.max) * 100
                            }%)`,
                          }}
                        />
                        <div className="flex justify-between text-[11px] sm:text-xs text-gray-600 mt-1">
                          {[...Array(activity.max + 1)].map((_, i) => (
                            <span key={i}>{i}t</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <style jsx>{`
                      input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        width: 20px;
                        height: 20px;
                        background: #fb923c;
                        border-radius: 50%;
                        border: 3px solid white;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                      }
                    `}</style>
                  </div>
                );
              })}
            </div>

            {hasSelection && (
              <div className="flex space-x-3 md:space-x-6">
                <button
                  onClick={handleReset}
                  className="mt-4 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-black font-semibold px-8 py-3 rounded-lg shadow-md transition"
                >
                  Tilbakestill
                </button>

                <button
                  onClick={handleCheckMyDay}
                  className="bg-[#FF9E1C] mt-4 hover:bg-[#fb8c00] active:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 shadow-md transition"
                >
                  <FaStar className="w-4 h-4" />
                  Sjekk dagen min
                </button>

                {showContinueButton && isPerfectDay && (
                  <div onClick={startLeaningHanlder}>
                    <button className="bg-[#12B347] mt-4 hover:bg-green-600 active:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 shadow-md transition">
                      Fortsett
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-1 flex flex-col items-center">
            {/* Image at TOP */}
            <div className="relative w-full flex justify-center">
              <Image src={spiner} alt="spin" className="w-[90%] mx-auto" />

              {/* Center image overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%]">
                <Image
                  src={getCenterImage()}
                  alt="status"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Activity Summary */}
            {hasSelection && !showModal && (
              <div className="mt-6 w-full space-y-2">
                {activities
                  .filter((activity) => activity.value > 0)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${activity.color}`}
                        ></div>
                        <span className="text-gray-700">
                          {activity.icon} {activity.name}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-600">
                        {activity.value}t
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* Result Modal */}
            {showModal && modalContent && (
              <div className="mt-6 w-full space-y-4">
                {/* Balance Display */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-green-500">
                    Balanse: {totalHours}/24 timer
                  </h3>
                </div>

                {/* Dynamic Result Card */}
                <div
                  className={`${modalContent.bg} border-2 ${modalContent.border} rounded-xl p-6 w-full shadow-lg relative`}
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-white hover:text-gray-200"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <div className="mb-3 flex justify-center">
                      <Image
                        src={modalContent.icon}
                        alt="icon"
                        className="w-20 h-20"
                      />
                    </div>
                    <h3
                      className={`text-lg font-bold mb-2 ${modalContent.color}`}
                    >
                      {modalContent.title}
                    </h3>
                    {modalContent.message && (
                      <p className={`text-sm ${modalContent.color} mb-4`}>
                        {modalContent.message}
                      </p>
                    )}

                    {/* Balance Tips - Show for missing fields */}
                    {modalContent.showTips &&
                      !modalContent.showBadges &&
                      modalContent.missingActivities.length > 0 && (
                        <div className="mt-4 space-y-2 text-left">
                          {modalContent.missingActivities.map((activity) => {
                            const tip = getBalanceTip(activity);
                            return tip ? (
                              <div
                                key={activity.id}
                                className="flex items-start gap-2 text-sm text-white"
                              >
                                <span>❌</span>
                                <span>{tip.message}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                    {/* Balance Tips & Badges - Show for perfect day */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <br />
      </div>
    </div>
  );
};

export default Page;


