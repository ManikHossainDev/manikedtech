import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="fixed w-full top-0 left-0 z-[99999]">
      <Navbar />
    </header>
  );
};

export default Header;
