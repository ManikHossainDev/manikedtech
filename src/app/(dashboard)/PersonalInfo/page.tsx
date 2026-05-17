"use client";
import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { FiEdit2 } from "react-icons/fi";
import Swal from "sweetalert2";
import parentProfile from "@/assets/Authentication/prentProfile.png";
import Profileicon from "@/assets/Authentication/uploardicon.png";
import { 
  useGetProfileQuery, 
  useUpdateProfileImageMutation, 
  useUpdateProfileMutation 
} from "@/redux/features/Profile/Profile";

type FormDataType = {
  name: string;
  email: string;
};

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<StaticImageData | string>(parentProfile);
  
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
  });

  const { data, isLoading, refetch } = useGetProfileQuery({});
  const [updateImage] = useUpdateProfileImageMutation();
  const [updateName, { isLoading: isNameUpdating }] = useUpdateProfileMutation();

  // ✅ Load API data into state
  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.fullName || "",
        email: data.data.email || "",
      });

      setProfileImage(
        data?.data?.profile?.profilePicture?.url || parentProfile
      );
    }
  }, [data]);

  // ✅ Handle image selection, preview and auto-upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-upload image
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      await updateImage(formData).unwrap();
      
      // Refresh profile data
      await refetch();
      
      Swal.fire({
        icon: 'success',
        title: 'Vellykket!',
        text: 'Profilbilde oppdatert',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Opplasting mislyktes',
        text: 'Klarte ikke å laste opp bilde. Prøv igjen.',
        confirmButtonColor: '#FF9E1C'
      });
      
      // Revert to original image on error
      if (data?.data?.profile?.profilePicture?.url) {
        setProfileImage(data.data.profile.profilePicture.url);
      } else {
        setProfileImage(parentProfile);
      }
    }
  };

  // ✅ Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit only name update
  const handleSubmit = async () => {
    try {
      // Only update name if it changed
      if (formData.name !== data?.data?.fullName) {
        await updateName({
          fullName: formData.name
        }).unwrap();
        
        // Refresh profile data
        await refetch();
        
        Swal.fire({
          icon: 'success',
          title: 'Vellykket!',
          text: 'Navn oppdatert',
          showConfirmButton: false,
          timer: 1500
        });
      }

      // Close modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Update failed:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Oppdatering mislyktes',
        text: 'Klarte ikke å oppdatere navn. Prøv igjen.',
        confirmButtonColor: '#FF9E1C'
      });
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Laster...</p>;
  }

  const isUpdating = isNameUpdating;

  return (
    <div className="mt-5 bg-gray-50 p-6 border-4 border-[#FF9E1C] rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-500 pb-2">
        Personlig informasjon
      </h2>

      <div className="max-w-xl mx-auto rounded-lg shadow-sm">
        {/* Profile View */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative cursor-pointer" onClick={() => document.getElementById('mainImageUpload')?.click()}>
            <Image
              src={profileImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-lg object-cover hover:opacity-80 transition-opacity"
            />
            <input
              id="mainImageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="text-gray-800 font-medium mt-2">
            {formData.name}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-orange-400 hover:bg-[#FF9E1C] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <FiEdit2 />
          Rediger profil
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border border-[#FF9E1C]">
            <h3 className="text-lg font-semibold mb-6">
              Rediger personlig informasjon
            </h3>

            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute bottom-0 right-0">
                    <Image
                      src={Profileicon}
                      width={30}
                      height={30}
                      alt="Upload"
                    />
                  </div>
                </div>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="font-medium">{formData.name}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Navn
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  E-post
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  // Reset to original values
                  if (data?.data) {
                    setFormData({
                      name: data.data.fullName || "",
                      email: data.data.email || "",
                    });
                  }
                }}
                disabled={isUpdating}
                className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Avbryt
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="flex-1 bg-orange-400 text-white py-3 rounded-lg hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Oppdaterer...' : 'Lagre endringer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;