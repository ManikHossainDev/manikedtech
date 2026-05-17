/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import InputComponent from "@/components/UI/InputComponent";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import background from "@/assets/Authentication/otp.png";
import Image from "next/image";
import { useResitPasswordMutation } from "@/redux/features/auth/authApi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  console.log(email, otp);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setEmail(searchParams.get("email"));
      setOtp(searchParams.get("otp"));
    }
  }, []);
  const [ResetPassword] = useResitPasswordMutation();
  const onFinish = async (values: ResetPasswordFormValues) => {
    const data = {
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    try {
      console.log(data);
      const res = await ResetPassword(data);
      console.log(res);
      console.log();
      if (res?.data?.code === 200) {
        router.push("/login");
      }
      if (res?.error) {
        // Check if error is FetchBaseQueryError with data property
        const errorMessage =
          "data" in res.error && res.error.data
            ? (res.error.data as any).message
            : "An error occurred during password reset";

        Swal.fire({
          toast: true,
          position: "center",
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
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
    <section className="min-h-screen w-full flex items-center justify-center bg-[F5E6D3]">
      <div className="w-full xxl:container  mx-auto w-full md:flex items-center  justify-center px-4">
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
        <div className="bg-white md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl border-2 border-[#FF9E1C] p-2 md:p-4 md:-ml-72 md:-mt-10">
          <div className="">
            <div className="px-2 py-8 ">
              <h2 className="text-xl md:text-2xl font-semibold   text-center ">
                Tilbakestill passord
              </h2>
              <p className="text-center pb-3 ">
                Passordet ditt må være 8–10 tegn langt.
              </p>
              <Form layout="vertical" onFinish={onFinish} className="space-y-5">
                <Form.Item
                  label={<span className="">Passord</span>}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Skriv inn et nytt passord",
                    },
                    {
                      min: 6,
                      message: "Passordet må være minst 6 tegn",
                    },
                  ]}
                  hasFeedback
                >
                  <InputComponent
                    placeholder="Nytt passord"
                    className="w-full p-3 border-b border-gray-300 "
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="">Bekreft passord</span>}
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Bekreft det nye passordet ditt",
                    },
                    {
                      min: 6,
                      message: "Passordet må være minst 6 tegn",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passordene stemmer ikke overens")
                        );
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <InputComponent
                    placeholder="Bekreft nytt passord"
                    className="w-full p-3 border-b border-gray-300 "
                  />
                </Form.Item>
                <button className="w-full px-5 py-3 bg-[#FF9E1C] rounded ">
                  Tilbakestill passord
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
