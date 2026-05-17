import ForgotPassword from "@/components/Pages/Auth/ForgotPassword/ForgotPassword";
import React from "react";

export const metadata = {
  title: "Forgot Password | Locksmit",
  description: "This is the forgot password page for our application",
  keywords: ["forgot password", "page", "example"], // Add these keywords under the 'metadata' type if needed
};

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
