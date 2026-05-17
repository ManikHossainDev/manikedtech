"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Drawer, Modal } from "antd";
import Image from "next/image";
import { 
  FaUserPlus, 
  FaFileContract, 
  FaBook, 
  FaCog 
} from "react-icons/fa";
import { LiaCertificateSolid } from "react-icons/lia";
import logout from "@/assets/Sidebar/Group.png";
import logo from "@/assets/Authentication/logof.png";
import pana from "@/assets/Authentication/pana.png";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";


interface SidebarProps {
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

const Sidebar = ({ drawerOpen, onDrawerClose }: SidebarProps) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const pathname = usePathname();
    const dispatch = useAppDispatch();
  const router = useRouter();
  // Update current path on mount and when pathname changes
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const showLogoutModal = () => setLogoutModalVisible(true);
  const handleLogoutCancel = () => setLogoutModalVisible(false);
  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    // localStorage.clear('')
       dispatch(
              setUser({
                user: null,
                token: null,
              })
            );
       router.push("/");
  };
  
  const isActive = (path: string) => {
    return currentPath === path || pathname === path;
  };

  const menuItems = [
    {
      key: "addchild",
      path: "/AddChildren",
      icon: FaUserPlus,
      label: "Legg til barn",
      iconClass: "text-gray-700"
    },
    {
      key: "familyagreement",
      path: "/familyagreement",
      icon: FaFileContract,
      label: "Familieavtale",
      iconClass: "text-gray-700"
    },
    {
      key: "parenttips",
      path: "/parenttips",
      icon: FaBook,
      label: "Foreldretips",
      iconClass: "text-gray-700"
    },
    {
      key: "certificate",
      path: "/certificate",
      icon: LiaCertificateSolid,
      label: "Sertifikat",
      iconClass: "text-gray-700"
    },
    {
      key: "settings",
      path: "/settings",
      icon: FaCog,
      label: "Innstillinger",
      iconClass: "text-gray-700"
    },
  ];

  const MenuContent = () => (
    <>
      <div className="flex-1 py-5 px-2 md:px-1 lg:px-4 space-y-2">
         <Link href="/">
          <Image className="w-[100xp] h-auto" src={logo} alt="logo" />
        </Link>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.key}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-[#ffdfd2a4] text-[#FF9E1C] border-r-4 border-[#FF9E1C]"
                  : "text-gray-700 hover:bg-[#ffdfd2a4] hover:border-r-4 border-[#FF9E1C]"
              }`}
              onClick={() => {
                setCurrentPath(item.path);
                onDrawerClose();
              }}
            >
              <Icon 
                className={`${item.key === "certificate" ? "text-2xl" : "text-xl"} ${
                  active ? "text-[#FF9E1C]" : item.iconClass
                }`} 
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-[#D8D8D8]">
        <button 
          onClick={showLogoutModal} 
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-100 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <Image src={logout} width={24} height={24} alt="Logout Icon" />
            <span className="font-medium text-gray-700">Logg ut</span>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Drawer for Mobile */}
      <Drawer
        placement="left"
        closable
        onClose={onDrawerClose}
        open={drawerOpen}
        className="p-0"
        styles={{
          body: { padding: 0, background: '#FFFFFF' }
        }}
        width={200}
      >
        <nav className="h-full flex flex-col bg-[#FBE9E9]">
          <MenuContent />
        </nav>
      </Drawer>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col bg-[#FFFFFF] w-52 lg:w-64 border-r border-[#D8D8D8] h-screen sticky top-0">
        <MenuContent />
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        centered
        className="border border-[#FF9E1C] rounded-lg"
        width={400}
        footer={[
          <div key="footer" className="flex items-center justify-between ">
            <button
              key="cancel"
              onClick={handleLogoutCancel}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              Avbryt
            </button>
            <button
              key="confirm"
              onClick={handleLogoutConfirm}
              className="bg-[#FF9E1C] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors ml-5"
            >
              Bekreft
            </button>
          </div>
        ]}
      >
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-red-500">Logg ut</h1>
          <p className="mb-2">Er du sikker på at du vil logge ut?</p>
          <Image src={pana} width={500} height={500} alt="Logout" className="mx-auto w-[227px] h-[257px] mb-4" />
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;