"use client";
import Link from "next/link";

interface IActiveProps {
  label: string;
  href: string;
}

const ActiveLink = ({ label, href }: IActiveProps) => {
  return (
    <Link
      href={href}
      className={`text-[17px] lg:p-4 p-2 text-black`}
    >
      {label}
    </Link>
  );
};

export default ActiveLink;