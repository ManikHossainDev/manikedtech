/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Swal from "sweetalert2";

import background from "@/assets/Authentication/otp.png";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form] = Form.useForm();

  // Toggle functions for each password field
  const toggleCurrentVisibility = () => setShowCurrent(!showCurrent);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmVisibility = () => setShowConfirm(!showConfirm);

  // SUBMIT HANDLER
  const onFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const payload = {
      currentPassword: values.currentPassword,
      password: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    try {
      const res = await changePassword(payload).unwrap();
      if(res?.data?.code === 200){
        Swal.fire({
        toast: true,
        position: "center",
        icon: "success",
        title: res?.message || "Password changed successfully",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset form after successful change
      form.resetFields();
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

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <section className="md:min-h-screen w-full flex items-center justify-center bg-[F5E6D3]">
      <div className="w-full xxl:container  mx-auto w-full md:flex items-center justify-center px-4">
        <div className="hidden md:block">
          <Image
            src={background}
            width={500}
            height={500}
            alt="Background Image"
            className="w-full h-full object-cover rounded-2xl mb-6"
          />
        </div>
        {/* Form Card */}
        <div className="bg-white md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl border-2 border-[#FF9E1C] p-2 md:p-4 md:-ml-72">
          <h1 className="text-xl font-semibold">Endre passord</h1>
          <Form
            form={form}
            name="change-password"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Nåværende passord"
              name="currentPassword"
              rules={[
                { required: true, message: "Vennligst skriv inn nåværende passord!" }
              ]}
            >
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Skriv inn passord"
                prefix={<FaLock />}
                suffix={
                  showCurrent ? (
                    <FaRegEye onClick={toggleCurrentVisibility} style={{ cursor: 'pointer' }} />
                  ) : (
                    <FaRegEyeSlash onClick={toggleCurrentVisibility} style={{ cursor: 'pointer' }} />
                  )
                }
                className="bg-transparent border border-black px-3 py-2 rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Nytt passord"
              name="newPassword"
              rules={[
                { required: true, message: "Vennligst skriv inn nytt passord!" },
                { min: 6, message: "Passordet må være minst 6 tegn!" }
              ]}
            >
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Skriv inn nytt passord"
                prefix={<FaLock />}
                suffix={
                  showPassword ? (
                    <FaRegEye onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                  ) : (
                    <FaRegEyeSlash onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                  )
                }
                className="bg-transparent border border-black px-3 py-2 rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Bekreft nytt passord"
              name="confirmPassword"
              rules={[
                { required: true, message: "Bekreft det nye passordet ditt!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passordene stemmer ikke overens!"));
                  },
                }),
              ]}
            >
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Bekreft nytt passord"
                prefix={<FaLock />}
                suffix={
                  showConfirm ? (
                    <FaRegEye onClick={toggleConfirmVisibility} style={{ cursor: 'pointer' }} />
                  ) : (
                    <FaRegEyeSlash onClick={toggleConfirmVisibility} style={{ cursor: 'pointer' }} />
                  )
                }
                className="bg-transparent border border-black px-3 py-2 rounded-md"
              />
            </Form.Item>

            <Form.Item className="flex justify-end items-center">
              <Button 
                className="bg-gray-300 text-black px-4 py-2 rounded-md mr-3"
                onClick={handleCancel}
              >
                Avbryt
              </Button>
              <Button 
                className="bg-red-500 text-white" 
                htmlType="submit"
                loading={isLoading}
              >
                Lagre endring
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;