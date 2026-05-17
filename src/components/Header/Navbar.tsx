"use client";
import { useState } from "react";
import logo from "@/assets/Authentication/logo2.png";
import Image from "next/image";
import ActiveLink from "./ActiveLink";
import Link from "next/link";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Profile from "@/assets/Authentication/Profile.jpg";
import { useGetProfileQuery } from "@/redux/features/Profile/Profile";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";


const navLink = [
  {
    href: "/",
    label: "Hjem",
  },
  {
    href: "/#Works",
    label: "Slik fungerer det",
  },
  {
    href: "/#Features",
    label: "Moduler",
  },
  {
    href: "/#aboutus",
    label: "Om oss",
  },
  {
    href: "/contact-us",
    label: "Kontakt",
  },
];



const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const { data } = useGetProfileQuery({});
  return (
    <nav>
      <div className="w-full xxl:container  mx-auto  flex justify-between items-center bg-[#FFFFFF] shadow-md py-2 px-3  xxl:px-2 rounded-b-xl">
        {/* logo */}
        <Link href="/">
          <Image
            src={logo}
            width={500}
            height={500}
            alt="logo"
            className="rounded-md w-[138px] h-[48px]"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-1 -ml-10">
          {navLink.map((link) => (
            <li key={link.href}>
              <ActiveLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>

        {/* Create job button */}
        <div className="flex justify-between items-center mg:gap-4 lg:gap-8 gap-2">
        {user ? (
          <div >
           
            {/* User Avatar Dropdown */}
            {user && (
              <Link href="/AddChildren">
                <div className="flex items-center gap-2 p-2 md:p-0 px-3 rounded-full cursor-pointer">
                  {data?.data?.profile?.profilePicture?.url ? (
                    <Image
                      src={data.data.profile.profilePicture.url}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FF9E1C]"
                    />
                  ) : (
                    <Image
                      src={Profile}
                      alt="Default Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  )}
                </div>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <Link href="/login" className="w-full">
              <Button className="bg-[#FF9E1C]">Logg inn</Button>
            </Link>
          </div>
        )}
        </div>
        {/* Mobile Drawer Button */}
        <Button
          type="text"
          className="md:hidden"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        />

        {/* Drawer for Mobile Navigation */}
        <Drawer
          title="Meny"
          placement="right"
          onClose={closeDrawer}
          open={isDrawerOpen}
          width="50%"
        >
          <ul className="flex flex-col gap-4">
            {navLink.map((link) => (
              <li key={link.href} onClick={closeDrawer}>
                <ActiveLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 mt-4">
            {user ? (
              <>
                <Link href="/logout" onClick={closeDrawer}>
                  <button className="text-white bg-red-500 px-10 py-3 rounded">
                    Logg ut
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeDrawer}>
                  <button className="text-white bg-[#FF9E1C]/80 hover:bg-[#FF9E1C] px-10 py-3 rounded">
                    Logg inn
                  </button>
                </Link>
                <Link href="/register" onClick={closeDrawer}>
                  <button className="px-8 py-3 border border-[#FF9E1C] text-black rounded">
                    Registrer
                  </button>
                </Link>
              </>
            )}
          </div>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;