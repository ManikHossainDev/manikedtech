/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { Form, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import InputComponent from "@/components/UI/InputComponent";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import background from "@/assets/Authentication/login.png";
import logo from "@/assets/Authentication/logof.png";
import Image from "next/image";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const res = await login(values).unwrap();

      if (res?.code === 200) {
        toast.success(res.message);

        const { user, accessToken } = res.data;
        const {
          _id,
          firstName,
          lastName,
          email,
          authRole,
          profile,
          isVerified,
          isAdmin,
        } = user;

        dispatch(
          setUser({
            user: {
              id: _id,
              firstName,
              lastName,
              email,
              role: authRole,
              profileImage: profile?.profilePicture?.url || null,
              isVerified,
              isAdmin,
            },
            token: accessToken,
          })
        );

        router.push("/AddChildren");
      }
    } catch (error: any) {
      toast.error(error?.error || "Login failed");
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#F5E6D3]">
      <div className="w-full xxl:container  mx-auto w-full md:flex items-center justify-center px-4">
        
        {/* Left Image */}
        <div className="hidden md:block">
          <Image
            src={background}
            width={500}
            height={500}
            alt="Background"
            className="w-full h-full object-cover rounded-2xl mb-6"
          />
        </div>

        {/* Form Card */}
        <div className="bg-white md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-2xl border-2 border-[#FF9E1C] p-4 md:-ml-40 md:-mt-32">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src={logo}
              width={150}
              height={150}
              alt="Logo"
              className="object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Velkommen!</h2>
            <p className="text-gray-600 text-sm">
              Skriv inn opplysningene dine
            </p>
          </div>

          {/* Form */}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="E-post"
              name="email"
              rules={[
                { required: true, message: "Vennligst skriv inn e-posten din" },
                { type: "email", message: "Ugyldig e-post" },
              ]}
            >
              <InputComponent icon={MdEmail} placeholder="E-post" />
            </Form.Item>

            <Form.Item
              label="Passord"
              name="password"
              rules={[
                { required: true, message: "Vennligst skriv inn passordet ditt" },
              ]}
            >
              <InputComponent
                icon={FaLock}
                placeholder="Passord"
                isPassword
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Checkbox>Husk meg</Checkbox>
              <Link
                href="/forgot-password"
                className="text-sm hover:underline"
              >
                Glemt passord?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF9E1C] rounded-lg text-white font-semibold"
            >
              Logg inn
            </button>
          </Form>

          {/* Register */}
          <div className="mt-6 text-center text-sm">
            Har du ikke konto?{" "}
            <Link
              href="/register"
              className="text-[#FF9E1C] font-semibold"
            >
              Registrer deg
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;