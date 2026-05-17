/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Family from "@/assets/HeroBannerSection/Family.png";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useGetChildAgreementsQuery } from "@/redux/features/childprofiles/childprofiles";

// antd
import { Select, Space } from "antd";
const { Option } = Select;

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const { data: childrenData } = useGetChildAgreementsQuery({});
  console.log(childrenData?.data);
  return (
    <div>
      <h2 className="text-md md:text-[24px] mt-1">
        Opprett familieavtalen din her
      </h2>

      <Image
        src={Family}
        alt="Family Agreement"
        width={600}
        height={400}
        className="mt-5 mx-auto"
      />

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 justify-center items-center">
        {/* Create Agreement */}
        <Link href="/familyagreement/createnewagreement">
          <button className="py-3 px-7 text-white bg-[#FF9E1C] rounded-xl flex items-center space-x-1">
            <FaUser />
            <span>Opprett familieavtale</span>
          </button>
        </Link>

        {/* Open Modal */}
        <button
          onClick={() => setOpenModal(true)}
          className="py-3 px-7 text-white bg-[#FF9E1C] rounded-xl flex items-center space-x-1"
        >
          <FaUser />
          <span>Signer avtalesertifikat</span>
        </button>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">
              Signer avtalesertifikat
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Velg et barn for å signere avtalesertifikatet.
            </p>

            <Space direction="vertical" size="middle" className="w-full mb-6">
              <Select
                placeholder="Velg et barn"
                className="w-full"
                value={selectedChildId}
                onChange={(value) => setSelectedChildId(value)}
              >
                {childrenData?.data?.map((child: any) => (
                  <Option key={child.childId} value={child.childId}>
                    {child.childName}
                  </Option>
                ))}
              </Select>
            </Space>

            <div className="flex justify-end space-x-2">
              {/* childId pass via query */}
              <Link
                href={
                  selectedChildId
                    ? `/familyagreement/timerules?childId=${selectedChildId}`
                    : "#"
                }
              >
                <button
                  disabled={!selectedChildId}
                  className={`px-4 py-2 rounded-lg text-white ${
                    selectedChildId
                      ? "bg-[#FF9E1C]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Fortsett
                </button>
              </Link>
            </div>

            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
