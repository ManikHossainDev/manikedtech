/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form } from "antd";
import { useRouter } from "next/navigation";
import InputComponent from "@/components/UI/InputComponent";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import background from "@/assets/Authentication/otp.png";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import Swal from "sweetalert2";

interface LoginFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [forgetPassword] = useForgetPasswordMutation();

  const onFinish = async (values: LoginFormValues) => {
    const email = values.email;

    try {
      const res = await forgetPassword({ email }).unwrap();
      if (res?.code === 200) {
        Swal.fire({
          toast: true,
          position: "center",
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        router.push(`/verify-email?email=${email}`);
      }
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.data?.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#F5E6D3]">
      <div className="w-full xxl:container  mx-auto w-full md:flex items-center justify-center px-4">
        <div className="hidden md:block">
          <Image
            src={background}
            width={500}
            height={500}
            alt="OTP"
            className="rounded-2xl"
          />
        </div>

        <div className="bg-white md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl border-2 border-[#FF9E1C] p-4 md:-ml-72">
          <h2 className="text-2xl font-semibold pb-4 text-center">
            Glemt passordet ditt?
          </h2>

          <p className="text-sm pb-5 text-center">
            Skriv inn e-posten din for å tilbakestille passordet.
          </p>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="E-post"
              name="email"
              rules={[
                { required: true, message: "Vennligst skriv inn e-posten din" },
                { type: "email", message: "Skriv inn en gyldig e-post" },
              ]}
            >
              <InputComponent icon={MdEmail} placeholder="Skriv inn e-posten din" />
            </Form.Item>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF9E1C] rounded text-white font-medium"
            >
              Send kode
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
