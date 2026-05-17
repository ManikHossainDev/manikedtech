/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form, Input, Button, Upload } from "antd";
import Image from "next/image";
import user from "@/assets/logo/user.png";
import { SlLocationPin } from "react-icons/sl";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { RiPhoneLine } from "react-icons/ri";
import Link from "next/link";


const UserProfile = () => {
  return (
    <div className="px-2">
      <Form
        layout="vertical"
        initialValues={{
          companyName: "",
          companyEmail: "",
          address: "",
          phoneNumber: "",
          telephoneNumber: "",
          demo1: "",
          demo2: "",
        }}
      >
        {/* Header Section */}
        <div className="flex items-center space-x-3 py-5">
          <Image src={user} alt="User Icon" />
          <div>
            <div className="md:flex items-center md:gap-2">
              <Upload>
                <Button className="bg-red-500 text-white px-5 ">Change Picture</Button>
              </Upload>
              <Link href="/changepass">
                <Button danger className="md:ml-2 mt-3 md:mt-0">
                  Change Password
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Maximum size 5MB. Format: jpg, jpeg, png.
            </p>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ message: "Please enter company name" }]}
          >
            <Input
              placeholder="Enter Company Name"
              prefix={<FaRegUserCircle />}
              className="bg-transparent border border-black px-3 py-2 rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="companyEmail"
            label="Company Email"
            rules={[
              { message: "Please enter company email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              placeholder="Enter Company Email"
              prefix={<MdOutlineEmail />}
              className="bg-transparent border border-black px-3 py-2 rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Staff First Name/Surname"
            rules={[{ message: "Enter you Staff Name" }]}
          >
            <Input
              placeholder="Type Name"
              prefix={<FaRegUserCircle />}
              className="bg-transparent border border-black px-3 py-2 rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ message: "Please enter phone number" }]}
          >
            <Input
              placeholder="Enter Phone Number"
              prefix={<RiPhoneLine />}
              className="bg-transparent border border-black px-3 py-2 rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="telephoneNumber"
            label="Telephone Number"
            rules={[{ message: "Please enter telephone number" }]}
          >
            <Input
              placeholder="Enter Telephone Number"
              prefix={<RiPhoneLine />}
              className="bg-transparent border border-black px-3 py-2 rounded-md"
            />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input
              placeholder="Type Name"
              prefix={<SlLocationPin />}
              className="bg-transparent border border-black px-3 py-2 rounded-md"
            />
          </Form.Item>
          
        </div>

        {/* Footer Section */}
        <div className="flex justify-end mt-5 gap-3 md:mb-12">
          <Button className="bg-gray-300  text-black px-4 py-2 rounded-md">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-red-500  text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
