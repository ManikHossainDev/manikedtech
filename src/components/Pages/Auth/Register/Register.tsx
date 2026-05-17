/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Form, Checkbox } from "antd";
import InputComponent from "@/components/UI/InputComponent";
import { FaLock, FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import background from "@/assets/Authentication/login.png";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
}

const Register: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ✅ Correct destructuring
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values: RegisterFormValues) => {
    const data = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    try {
      const res = await register(data).unwrap();

      if (res?.code === 201) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: res?.message || "Registration successful",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Save verification token
        dispatch(
          setUser({
            user: null,
            token: res?.data?.verificationToken,
          })
        );

        // Redirect to verify email page
        router.push(`/accountverify?email=${values.email}`);
      }
    } catch (error: any) {
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
    <section className="min-h-screen w-full flex items-center justify-center bg-[#F5E6D3]">
      <div className="w-full xxl:container  mx-auto w-full h-full md:flex items-center justify-center px-4">
        {/* Left Image */}
        <div className="hidden md:block">
          <Image
            src={background}
            width={500}
            height={500}
            alt="Register Background"
            className="mt-36 w-full h-full object-cover rounded-2xl mb-6"
          />
        </div>

        {/* Register Form */}
        <div className="bg-white md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl border-2 border-[#FF9E1C] p-4 md:-ml-40 md:-mt-24">
          <h2 className="text-2xl font-semibold text-center">
            Opprett en konto
          </h2>
          <p className="text-center pb-4">
            Hei! La oss begynne reisen din med oss.
          </p>

          <Form layout="vertical" onFinish={onFinish}>
            {/* Full Name */}
            <Form.Item
              label="Navn"
              name="fullName"
              rules={[
                { required: true, message: "Vennligst skriv inn fullt navn" },
              ]}
            >
              <InputComponent
                placeholder="Skriv inn navn"
                icon={FaUserCircle}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="E-post"
              name="email"
              rules={[
                { required: true, message: "Vennligst skriv inn e-post" },
                { type: "email", message: "Skriv inn en gyldig e-post" },
              ]}
            >
              <InputComponent
                placeholder="Skriv inn e-post"
                icon={MdEmail}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Passord"
              name="password"
              rules={[
                { required: true, message: "Vennligst skriv inn passord" },
              ]}
            >
              <InputComponent
                placeholder="Skriv inn passord"
                isPassword
                icon={FaLock}
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label="Bekreft passord"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Bekreft passordet ditt" },
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
            >
              <InputComponent
                placeholder="Bekreft passord"
                isPassword
                icon={FaLock}
              />
            </Form.Item>

            {/* Terms & Conditions */}
            <Form.Item
              name="remember"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Du må godta vilkårene")
                        ),
                },
              ]}
            >
              <Checkbox>
                Jeg godtar vilkårene og personvernpolicyen
              </Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#FF9E1C] rounded font-semibold disabled:opacity-60"
            >
              {isLoading ? "Registrerer..." : "Registrer deg"}
            </button>
          </Form>

          {/* Login Link */}
          <div className="mt-3 text-center font-semibold">
            Har du allerede en konto?
            <Link
              href="/login"
              className="text-[#FF9E1C] hover:underline ml-1"
            >
              Logg inn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
