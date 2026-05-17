/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Edit, X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import Swal from "sweetalert2";

const Page = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [changePassword] = useChangePasswordMutation();

  const handleUpdatePassword = async () => {
    const { confirmPassword, newPassword, oldPassword } = formData;
    const data = {
      currentPassword: oldPassword,
      password: newPassword,
      confirmPassword: confirmPassword,
    };
    try {
      const res = await changePassword(data).unwrap();
      if (res?.data?.code === 200) {
        Swal.fire({
          toast: true,
          position: "center",
          icon: "success",
          title: res?.message || "Password changed successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setIsPasswordModalOpen(false);
        // Reset form
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Reset visibility states
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "center",
        icon: "error",
        title: error?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-gray-800 mt-5">Innstillinger</h1>
      <div className="flex space-x-2">
        {/* Personal Information Card */}
        <Link href="/PersonalInfo">
          <button className="bg-white border-2 border-[#FF9E1C] rounded-lg p-2 hover:shadow-lg transition-shadow text-center group">
            <div className="flex flex-col items-center space-y-3">
              <h2 className="text-lg font-medium text-gray-800">
                Personlig informasjon
              </h2>
              <Edit className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
            </div>
          </button>
        </Link>

        {/* Change Password Card */}
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="bg-white border-2 border-[#FF9E1C] rounded-lg p-2 hover:shadow-lg transition-shadow text-center group"
        >
          <div className="flex flex-col items-center space-y-3">
            <h2 className="text-lg font-medium text-gray-800">
              Endre passord
            </h2>
            <Edit className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
          </div>
        </button>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-[#FF9E1C]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Endre passord
              </h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gammelt passord
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    placeholder="Gammelt passord"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9E1C] focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nytt passord
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Nytt passord"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9E1C] focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bekreft nytt passord
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Bekreft nytt passord"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9E1C] focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Update Button */}
              <button
                type="submit"
                className="w-full bg-[#FF9E1C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Oppdater passord
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
