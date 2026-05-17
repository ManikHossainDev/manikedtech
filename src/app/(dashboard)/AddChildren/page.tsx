/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Edit, X, Upload, Lock, GraduationCap, CircleCheckBig } from "lucide-react";
import childProfile from "@/assets/svg/Child.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCreateChildMutation,
  useDeleteChildMutation,
  useGetChildQuery,
  useUpdateChildImageMutation,
  useUpdateChildMutation,
} from "@/redux/features/childprofiles/childprofiles";
import Swal from "sweetalert2";
import { useGetProgressByIdQuery } from "@/redux/features/modules/GetProgressOverview";
import { useSelector } from "react-redux";
import {
  selectPayment,
  setPayment,
} from "@/redux/features/payments/paymentSlice";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import {
  useCreatePaymentLinkMutation,
  useGetPaymentStatusQuery,
} from "@/redux/features/payments/payments";
import { toast } from "sonner";

interface FormData {
  fullName: string;
  username: string;
  dateOfBirth: string;
}

interface EditFormData {
  fullName: string;
  dateOfBirth: string;
}

/* =========================
   CHECKPOINT ORDER
========================= */
const CHECKPOINT_ORDER = [
  "introPage",
  "learningContent",
  "interactiveTask",
  "quiz",
];

/* =========================
   ROUTE MAP (MODULE WISE)
========================= */
const ROUTE_MAP: Record<number, Record<string, string>> = {
  1: {
    introPage: "modulesone",
    learningContent: "LearningOne",
    interactiveTask: "Interacivegame",
    quiz: "ContinueQuizzes",
  },
  2: {
    introPage: "modulestow",
    learningContent: "Learningtow",
    interactiveTask: "Interacivegametow",
    quiz: "modulestowContinueQuizzes",
  },
  3: {
    introPage: "modulesthree",
    learningContent: "Learningthree",
    interactiveTask: "InteractiveGamethree",
    quiz: "modulesthreeContinueQuizzes",
  },
  4: {
    introPage: "modulesfour",
    learningContent: "Learningfour",
    interactiveTask: "InteractiveGamefour",
    quiz: "modulesfourContinueQuizzes",
  },
  5: {
    introPage: "modulesfive",
    learningContent: "Learningfive",
    interactiveTask: "InteractiveGamefive",
    quiz: "modulesfiveContinueQuizzes",
  },
  6: {
    introPage: "modulessix",
    learningContent: "Learningsix",
    interactiveTask: "InteractiveGamesix",
    quiz: "modulesSixContinueQuizzes",
  },
  7: {
    introPage: "modulesseven",
    learningContent: "LearningSeven",
    interactiveTask: "InteractiveGameSeven",
    quiz: "modulesSevenContinueQuizzes",
  },
  8: {
    introPage: "moduleseight",
    learningContent: "Learningeight",
    interactiveTask: "InteractiveGameEight",
    quiz: "modulesEightContinueQuizzes",
  },
};

const TOTAL_MODULES = 8;
const CERTIFICATE_ROUTE = "ModulesCertificate";

/* =========================
   MODULE → CHECKPOINT ROUTE
========================= */
const getRedirectRouteFromModule = (module: any): string | null => {
  if (!module?.checkpoints) return null;

  let lastCompletedIndex = -1;

  CHECKPOINT_ORDER.forEach((key, index) => {
    if (module.checkpoints[key]?.completed === true) {
      lastCompletedIndex = index;
    }
  });

  // কোনো checkpoint complete না হলে → first checkpoint
  if (lastCompletedIndex === -1) {
    const firstCheckpoint = CHECKPOINT_ORDER[0];
    return ROUTE_MAP[module.moduleNumber]?.[firstCheckpoint] || null;
  }

  // শেষ completed checkpoint
  const lastCompletedCheckpoint = CHECKPOINT_ORDER[lastCompletedIndex];
  return ROUTE_MAP[module.moduleNumber]?.[lastCompletedCheckpoint] || null;
};

/* =========================
   FINAL REDIRECT LOGIC
========================= */
const getFinalRedirectRoute = (modules: any[]): string | null => {
  if (!modules?.length) return null;

  // ✅ CONDITION 1: শুধু unlocked module filter করো
  const unlockedModules = modules.filter((m) => m.unlocked === true);
  
  if (!unlockedModules.length) {
    console.log("❌ No unlocked modules found");
    return null;
  }

  console.log(`✅ Found ${unlockedModules.length} unlocked modules`);

  // ✅ CONDITION 2: Certificate Check
  // Step 1: All modules unlocked check
  const allModulesUnlocked = unlockedModules.length === TOTAL_MODULES;
  
  // Step 2: Module 8 (last module) passed check
  const lastModule = modules.find((m) => m.moduleNumber === TOTAL_MODULES);
  
  if (allModulesUnlocked && lastModule?.passed === true) {
    console.log("🎓 All modules unlocked + Module 8 passed → Certificate!");
    return CERTIFICATE_ROUTE;
  }

  // =========================
  // 🔁 NORMAL FLOW: Find incomplete module
  // =========================
  const activeModule = unlockedModules.find((m) => m.passed === false);

  if (activeModule) {
    console.log(`📍 Incomplete module found: Module ${activeModule.moduleNumber}`);
    return getRedirectRouteFromModule(activeModule);
  }

  // Fallback: last unlocked module
  const fallbackModule = unlockedModules[unlockedModules.length - 1];
  console.log(`⚠️ Fallback to Module ${fallbackModule.moduleNumber}`);
  return getRedirectRouteFromModule(fallbackModule);
};

const Page: React.FC = () => {
  const router = useRouter();

  const FRONT_URI = process.env.NEXT_PUBLIC_FRONT_END_URL? process.env.NEXT_PUBLIC_FRONT_END_URL : "https://mobilklar.no";
  console.log(FRONT_URI)
  const paymentExist = useSelector(selectPayment);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { data: paymentStatus } = useGetPaymentStatusQuery(
    {},
    { skip: !user && paymentExist?.fetched }
  );

  const [createPayment] = useCreatePaymentLinkMutation();
  const createCheckoutSession = async () => {
    const reqBody = {
      successUrl: `${FRONT_URI}/AddChildren`,
      cancelUrl: `${FRONT_URI}/AddChildren`,
    };

    try {
      setIsCreatingPaymentLink(true);
      const res = await createPayment({ reqBody }).unwrap();
      window.location.href = res.url;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create payment");
    } finally {
      setIsCreatingPaymentLink(false);
    }
  };

  const paymenLinkHandler = async () => {
    if (paymentExist?.hasLifetimeAccess) {
      setShowAddModal(true);
      return;
    }

    setShowPaymentModal(true);
  };

  useEffect(() => {
    dispatch(
      setPayment({
        hasLifetimeAccess: paymentStatus?.hasLifetimeAccess || false,
        paidAt: paymentStatus?.paidAt || null,
      })
    );
  }, [user, paymentStatus, dispatch]);

  // State management
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [selectedChildIdEdit, setSelectedChildIdEdit] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // API hooks
  const [createChild, { isLoading: isCreating }] = useCreateChildMutation();
  const [updateChild, { isLoading: isUpdating }] = useUpdateChildMutation();
  const [uploadImage, { isLoading: isUploading }] = useUpdateChildImageMutation();
  const [deleteChild] = useDeleteChildMutation();
  const { data, isLoading, refetch } = useGetChildQuery({});

  // ✅ FIXED: Skip query when no selectedChildId
  const { data: allModulesProgress } = useGetProgressByIdQuery(
    selectedChildId!,
    { skip: !selectedChildId }
  );

  const childrenData = data?.data || [];
  const allProgresModules = allModulesProgress?.data?.modules;

  const [addFormData, setAddFormData] = useState<FormData>({
    fullName: "",
    username: "",
    dateOfBirth: "",
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    fullName: "",
    dateOfBirth: "",
  });

  // ✅ REDIRECT LOGIC
  useEffect(() => {
    if (selectedChildId && allProgresModules) {
      const route = getFinalRedirectRoute(allProgresModules);
      console.log("🚀 Redirecting to:", route);

      if (route) {
        router.push(`/${route}?childId=${selectedChildId}`);
      }
    }
  }, [allProgresModules, selectedChildId, router]);

  // Handle Add Form Input Change
  const handleAddInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Edit Form Input Change
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Filstørrelsen må være under 5 MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add Submit
  const handleAddSubmit = async () => {
    if (!addFormData.fullName || !addFormData.username || !addFormData.dateOfBirth) {
      alert("Vennligst fyll inn alle felt");
      return;
    }

    try {
      const payload = {
        fullName: addFormData.fullName.trim(),
        username: addFormData.username.trim(),
        dateOfBirth: addFormData.dateOfBirth,
      };

      const res = await createChild(payload).unwrap();

      if (res?.code === 201) {
        setAddFormData({ fullName: "", username: "", dateOfBirth: "" });
        setShowAddModal(false);
        refetch();
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error?.data?.message,
        icon: "error",
      });
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (child: any): void => {
    setSelectedChildIdEdit(child._id);
    setEditFormData({
      fullName: child.fullName,
      dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
    });

    const imageUrl =
      child.displayPicture?.avatar?.url ||
      child.profileImage ||
      child.profilePicture ||
      child.image ||
      child.avatar ||
      null;

    setImagePreview(imageUrl);
    setImageFile(null);
    setShowEditModal(true);
  };

  // ✅ Handle Card Click
  const handleCardClick = (childId: string): void => {
    setSelectedChildId(childId);
  };

  // Handle Delete Click
  const handleDeleteClick = async (childId: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Er du sikker?",
      text: "Du kan ikke angre dette!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF9E1C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ja, slett det!",
    });

    if (result.isConfirmed) {
      try {
        await deleteChild(childId).unwrap();
        Swal.fire({
          title: "Slettet!",
          text: "Barneprofilen er slettet.",
          icon: "success",
        });
        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text:
            error?.data?.message ||
            "An error occurred while deleting the child profile",
          icon: "error",
        });
      }
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async () => {
    if (!selectedChildIdEdit || !editFormData.fullName || !editFormData.dateOfBirth) {
      alert("Vennligst fyll inn alle felt");
      return;
    }

    try {
      const updatePayload = {
        fullName: editFormData.fullName.trim(),
        dateOfBirth: editFormData.dateOfBirth,
      };

      await updateChild({
        id: selectedChildIdEdit,
        data: updatePayload,
      });

      if (imageFile) {
        const formData = new FormData();
        formData.append("profilePicture", imageFile);

        const res = await uploadImage({ id: selectedChildIdEdit, data: formData });
        if (res?.data?.code === 201) {
          alert("Bilde lastet opp vellykket");
        }
      }

      setShowEditModal(false);
      setImagePreview(null);
      setImageFile(null);
      refetch();
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error?.data?.message,
        icon: "error",
      });
    }
  };

  // Calculate progress percentage
  const calculateProgress = (child: any) => {
    const completedModules = child.progress?.completedModules?.length || 0;
    const totalModules = child.progress?.modules?.length || 8;
    return totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Laster barneprofiler...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-base md:text-xl font-semibold">
          Legg til barna dine her
        </h1>
        <button
          onClick={paymenLinkHandler}
          className="text-white bg-[#FF9E1C] rounded-xl px-2 py-1 md:px-5 md:py-2"
        >
          Legg til barn
        </button>
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-8">
        {childrenData.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            Ingen barneprofiler ennå. Legg til ditt første barn!
          </p>
        ) : (
          childrenData.map((child: any) => {
            const progress = calculateProgress(child);
            const completedModules = child.progress?.completedModules?.length;
            const totalModules = child.progress?.modules?.length;
            return (
              <div
                onClick={() => handleCardClick(child._id)}
                key={child._id}
                className="bg-gradient-to-br from-[#FF9E1C] to-[#FFA726] rounded-3xl p-6 cursor-pointer hover:shadow-xl group"
              >
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        child?.profileImage ? child?.profileImage : childProfile
                      }
                      alt={child.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      width={64}
                      height={64}
                    />
                    <div>
                      <h2 className="text-white font-semibold text-lg">
                        {child.fullName}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {child.dateOfBirth
                          ? new Date(child.dateOfBirth).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(child);
                      }}
                      className="bg-white/30 hover:bg-white/40 p-2 rounded-lg transition-colors z-10"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-2">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(child._id);
                      }}
                      className="bg-white/30 hover:bg-white/40 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <X className="w-full text-red-500" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/90 font-semibold text-sm">
                      Start
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {completedModules}/{totalModules}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl p-2 md:p-4">
            <div className="absolute top-2 right-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddFormData({ fullName: "", username: "", dateOfBirth: "" });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="">
              <h2 className=" text-2xl font-semibold text-gray-800">
                Opprett barnekonto
              </h2>
              <p className=" text-gray-500 text-sm mb-6">
                Legg til barnets informasjon på følgende måte
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Barnets navn
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={addFormData.fullName}
                    onChange={handleAddInputChange}
                    placeholder="e.g. Sarah Ahmed"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Brukernavn
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={addFormData.username}
                    onChange={handleAddInputChange}
                    placeholder="e.g. sarah_ahmed"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Fødselsdato
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={addFormData.dateOfBirth}
                    onChange={handleAddInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <button
                  onClick={handleAddSubmit}
                  disabled={isCreating}
                  className="w-full bg-[#FF9E1C] hover:bg-[#ff8c00] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Legger til..." : "Legg til barn"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#FF9E1C] flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Engangsbetaling kreves</h2>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Lukk betalingsmodal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Lås opp livstids tilgang</h3>
              <p className="text-gray-600 leading-relaxed mb-5">
                Gjør en engangsbetaling for å låse opp livstids tilgang for hele familien og hjelpe barna dine med å få sitt digitale kjøresertifikat.
              </p>

              <ul className="space-y-3 text-left mb-7">
                <li className="flex items-start gap-3 text-gray-700">
                  <CircleCheckBig className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Opprett opptil 4 barneprofiler per konto</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CircleCheckBig className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Individuell progresjonssporing for hvert barn</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CircleCheckBig className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Få digitalt kjøresertifikat ved fullføring</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CircleCheckBig className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Full tilgang til alle læringsmoduler for alltid</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CircleCheckBig className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Ingen gjentakende avgifter – betal én gang, tilgang for alltid</span>
                </li>
              </ul>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Kanskje senere
                </button>
                <button
                  onClick={async () => {
                    setShowPaymentModal(false);
                    await createCheckoutSession();
                  }}
                  disabled={isCreatingPaymentLink}
                  className="bg-[#FF9E1C] hover:bg-[#ff8c00] text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreatingPaymentLink ? "Omdirigerer..." : "Betal én gang og lås opp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Child Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl">
            <div className="absolute top-2  right-2 flex justify-center">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setImagePreview(null);
                  setImageFile(null);
                  setSelectedChildId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-2 md:px-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Rediger barnekonto
              </h2>
               <p className="text-gray-500 text-sm mb-6 ">
                Rediger barnets informasjon på følgende måte
              </p>
            </div>
            <div className="p-2 md:p-4">
            
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Barnets navn
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Fødselsdato
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editFormData.dateOfBirth}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Profilbilde
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="cursor-pointer text-center py-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-400 transition-colors">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-lg object-cover mb-2 border-2 border-gray-200"
                            width={96}
                            height={96}
                          />
                          <p className="text-gray-500 text-xs">
                            Klikk for å bytte bilde
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                          <p className="text-gray-400 text-sm">Last opp bilde</p>
                          <p className="text-gray-400 text-xs">
                            Filstørrelsen må være under 5 MB
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleEditSubmit}
                  disabled={isUpdating || isUploading}
                  className="w-full bg-[#FF9E1C] hover:bg-[#ff8c00] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating || isUploading ? "Lagrer..." : "Lagre endringer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;