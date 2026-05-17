/* eslint-disable react/prop-types */
"use client";
import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  border?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  border = true,
  loading = false,
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`w-full ${
        border ? "border-2" : "border-none"
      } p-0.5 border-2 rounded-xl`}
    >
      <button
        type="button" // Use button instead of submit
        className={`${className} w-full ${
          loading ? "opacity-75" : "opacity-100"
        } flex px-8 py-3 rounded-lg  justify-center items-center gap-5 text-white transition-all duration-500`}
        onClick={onClick}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          // Custom loading spinner design
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-dashed border-t-transparent  rounded-full animate-spin"></div>
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default Button;
