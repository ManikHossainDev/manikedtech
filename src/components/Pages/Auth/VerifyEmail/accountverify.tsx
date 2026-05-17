/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import InputComponent from "@/components/UI/InputComponent";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import background from "@/assets/Authentication/otp.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useVerifyAccountMutation } from "@/redux/features/auth/authApi";

interface OTPFormValues {
  otp: string;
}

const AccountVerify: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    console.log(email)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setEmail(searchParams.get('email')); 
    }
  }, []);
  
  const [verifyemail] = useVerifyAccountMutation();

  const onFinish = async (values: OTPFormValues) => {
    const data = {
      email,
      otp:values.otp
    }
    try{
      const res = await verifyemail(data)
      console.log(res)
       if (res?.data?.code === 200) {
        router.push(`/login`);
      }
    }catch(error:any){
       Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <section 
      className="min-h-screen w-full flex items-center justify-center bg-[F5E6D3]"
    >
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
        <div className="bg-white md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl border-2 border-[#FF9E1C] p-2 md:p-4 md:-ml-72">
            <div className="">
              <div className="px-2 py-8 ">
                <h2 className="text-xl md:text-2xl font-semibold   text-center ">
                Bekreft e-post
                </h2>
                <p className="pb-3 text-center ">Sjekk e-posten din og skriv inn koden</p>
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  className="space-y-5"
                >
                  <Form.Item
                    name="otp"
                    rules={[
                      { required: true, message: "Skriv inn engangskoden" },
                      { len: 6, message: "Engangskoden må være 6 sifre" },
                    ]}
                  >
                    <InputComponent
                      placeholder="Skriv inn koden"
                      className="w-full p-3"
                    />
                  </Form.Item>
                  <button className="w-full px-5 py-3 rounded bg-[#FF9E1C] ">
                    Bekreft
                  </button>
                </Form>
                <div className="flex justify-between items-center my-4">
                  <h1 className="">Fikk du ikke koden?</h1>
                  <button className="">
                  Send på nytt
                  </button>
              </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default AccountVerify;