"use client";
import { useState, useEffect } from "react";
import { Lock, X, Lightbulb } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// Assets
import group from "@/assets/ParentTips/Group.png";
import group1 from "@/assets/ParentTips/Group (1).png";
import group2 from "@/assets/ParentTips/Group (2).png";
import group3 from "@/assets/ParentTips/Group (3).png";
import group4 from "@/assets/ParentTips/Group (4).png";
import group5 from "@/assets/ParentTips/Frame (5).png";
import group6 from "@/assets/ParentTips/Group (6).png";
import group7 from "@/assets/ParentTips/Group (7).png";
import ParentTips from "@/assets/HeroBannerSection/ParentTips.png";
import childProfile from "@/assets/svg/Child.png";

// Redux
import {
  useGetChildQuery,
  useGetParentTipsByChildQuery,
} from "@/redux/features/childprofiles/childprofiles";
import { useUpdateParentTipsMutation } from "@/redux/features/certificates/certificates";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// Types
interface ModuleParentTips {
  _id: string;
  moduleId: string;
  moduleNumber: number;
  moduleTitle: string;
  title: string;
  content: string;
  additionalResources: unknown[];
  order: number;
  isUnlocked: boolean;
  unlockedAt: Date;
  isRead: boolean;
}

interface Tip {
  id: string;
  title: string;
  content: string;
  isUnlocked: boolean;
  isRead: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: StaticImageData | string;
  locked: boolean;
  hasParentTips: boolean;
  tips: Tip[];
}

interface Child {
  _id: string;
  fullName: string;
  age: number;
  profileImage?: string;
  progress?: {
    modules?: Array<{
      status: string;
    }>;
  };
}

interface UpdateData {
  parentTipId: string;
  title: string;
  content: string;
}

// Module icons mapping
const moduleIcons: Record<number, StaticImageData> = {
  1: group,
  2: group1,
  3: group2,
  4: group3,
  5: group4,
  6: group5,
  7: group6,
  8: group7,
};

const ParentTipsPage: React.FC = () => {
  // Client-side rendering state
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Component state
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<ModuleParentTips | null>(null);
  console.log(currentTip)
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [updatedContent, setUpdatedContent] = useState<string>("");

  // Redux
  const user = useSelector(selectCurrentUser);
  console.log(user)
  const { data: childrenData } = useGetChildQuery({});
  const [updateParentsTips, { isLoading: isUpdating }] = useUpdateParentTipsMutation();
  const { data: parentTipsChildren } = useGetParentTipsByChildQuery(
    { childrenId: selectedChild?._id ?? "" },
    { skip: !selectedChild || !isMounted }
  );  

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handlers
  const handleCloseModal = (): void => {
    setSelectedModule(null);
  };

  const handleChildClick = (child: Child): void => {
    setSelectedChild(child);
  };

  const handleViewTips = (module: Module): void => {
    setSelectedModule(module);
  };

  const handleOpenUpdateModal = (module: ModuleParentTips): void => {
    setCurrentTip(module);
    setUpdatedTitle(module.title);
    setUpdatedContent(module.content);
    setShowUpdateModal(true);
  };

  const handleUpdateTips = async (): Promise<void> => {
    if (!currentTip || !selectedChild) return;

    try {
      const updateData: UpdateData = {
        parentTipId: currentTip._id,
        title: updatedTitle,
        content: updatedContent,
      };

      console.log("Update payload:", updateData);

    const res =  await updateParentsTips({
        id: selectedChild._id,
        data: updateData,
      }).unwrap();
     if(res.code === 200){
        toast.success("Foreldretips oppdatert!");
        setShowUpdateModal(false)
     }
      
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : "Klarte ikke å oppdatere foreldretips";
      toast.error(errorMessage || "Klarte ikke å oppdatere foreldretips");
    }
  };

  // Loading skeleton during hydration
  if (!isMounted) {
    return (
      <div className="pt-5 mb-10">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-[300px] h-[250px] bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 mb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg md:text-2xl font-bold mb-2">
          Velkommen til foreldresenteret
        </h1>
        <p className="text-gray-600">
          Utforsk nyttige tips for å støtte barnets læringsreise gjennom hver modul.
        </p>
      </div>

      {/* Hero Image */}
      <div className="flex flex-col items-center justify-center mb-8">
        <Image
          src={ParentTips}
          alt="Parent Tips"
          width={500}
          height={500}
          className="w-[300px] h-[250px] rounded-lg object-cover"
          priority
        />
      </div>

      {/* Children Selection */}
      {childrenData?.data && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Velg ditt barn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {childrenData.data.map((child: Child) => {
              const isSelected = selectedChild?._id === child._id;
              const completedModules = child.progress?.modules?.filter(
                (m) => m.status === "completed"
              ).length || 0;
              const totalModules = child.progress?.modules?.length || 0;

              return (
                <div
                  key={child._id}
                  onClick={() => handleChildClick(child)}
                  className={`bg-gradient-to-br from-[#FF9E1C] to-[#FFA726] rounded-3xl p-4 pb-0 cursor-pointer hover:shadow-xl transition-all duration-300 ${
                    isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src={child?.profileImage || childProfile}
                        alt={child.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                        width={64}
                        height={64}
                      />
                      <div>
                        <h2 className="text-white font-semibold text-lg">
                          {child.fullName}
                        </h2>
                        <p className="text-white/80 text-sm">{child.age} år</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end pt-2">
                      <span className="text-white/90 text-sm font-bold">Fremgang</span>
                      <span className="text-white font-normal text-xs">
                        {completedModules}/{totalModules} moduler
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Module Tips Grid */}
      {parentTipsChildren?.tips && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {selectedChild ? `Foreldretips for ${selectedChild.fullName}` : "Foreldretips"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parentTipsChildren.tips.map((module: ModuleParentTips) => (
              <div
                key={module._id}
                className={`bg-gradient-to-b from-white to-transparent rounded-lg border-2 p-5 transition-all duration-300 ${
                  module.isUnlocked ? "border-transparent shadow-md" : "border-orange-400 shadow-lg"
                }`}
              >
                {/* Module Header */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-gray-400 text-xs md:text-xl font-semibold">
                    {module.moduleNumber}
                  </h1>
                  <div className={`w-[20%] mx-auto p-2.5 rounded-lg ${
                    module.isUnlocked ? "text-gray-400" : "text-orange-500"
                  }`}>
                    <Image
                      src={moduleIcons[module.moduleNumber] || group}
                      alt={module.moduleTitle}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>

                {/* Module Info */}
                <h3 className="text-base text-center font-bold text-gray-800 mb-2 leading-tight">
                  {module.moduleTitle}
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed text-center">
                  {module.title}
                </p>

                {/* Action Button */}
                <div className="flex justify-center">
                  {module.isUnlocked ? (
                    <button
                      onClick={() =>
                        handleViewTips({
                          id: module.moduleNumber.toString(),
                          title: module.moduleTitle,
                          description: `Foreldretips for ${module.moduleTitle}`,
                          icon: moduleIcons[module.moduleNumber] || group,
                          locked: false,
                          hasParentTips: true,
                          tips: [
                            {
                              id: module._id,
                              title: module.title,
                              content: module.content,
                              isUnlocked: module.isUnlocked,
                              isRead: module.isRead,
                            },
                          ],
                        })
                      }
                      className="bg-orange-400 text-white text-sm font-semibold py-2.5 px-6 rounded-md hover:bg-[#FF9E1C] transition-colors duration-200"
                    >
                      Se foreldretips
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenUpdateModal(module)}
                      className="bg-gray-400 text-white text-sm font-semibold py-2.5 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Låst
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Tips Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="mb-5 border-b border-gray-200 pb-4">
                <span className="text-gray-400 text-xs font-medium">
                  Modul {selectedModule.id}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-1">
                  {selectedModule.title}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedModule.description}
                </p>
              </div>

              <div className="space-y-3">
                {selectedModule.tips.map((tip) => (
                  <div
                    key={tip.id}
                    className={`bg-orange-50 rounded-lg p-4 ${
                      tip.isUnlocked ? "" : "opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {tip.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && currentTip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="mb-5 border-b border-gray-200 pb-4">
                <span className="text-gray-400 text-xs font-medium">
                  Modul {currentTip.moduleNumber}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-1">
                  {currentTip.isUnlocked ? "Oppdater foreldretips" : "Lås opp og oppdater foreldretips"}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tittel
                  </label>
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Skriv tittel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Innhold
                  </label>
                  <textarea
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    rows={4}
                    placeholder="Skriv innhold"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleUpdateTips}
                  disabled={isUpdating}
                  className="w-full bg-gradient-to-br from-[#FF9E1C] to-[#FFA726] text-white text-sm font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Oppdaterer..." : "Send gratulasjoner til barnet ditt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentTipsPage;