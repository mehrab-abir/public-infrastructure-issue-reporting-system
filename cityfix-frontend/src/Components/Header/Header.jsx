import React, { useEffect, useState } from "react";
import Container from "../Container";
import logo from "../../assets/logo.png";
import NavbarLargeDevice from "./NavbarLargeDevice";
import UserDropdown from "./UserDropdown";
import NavbarSmallDevice from "./NavbarSmallDevice";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="bg-surface py-5">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* mobile navbar toggler */}
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="flex flex-col md:hidden items-start mt-1 space-y-1 cursor-pointer"
            >
              <span className="h-1 w-7 bg-primary rounded-md"></span>
              <span className="h-1 w-5 bg-primary rounded-md"></span>
              <span className="h-1 w-7 bg-primary rounded-md"></span>
            </div>
            <img src={logo} alt="" className="w-12" />
            <h1 className="text-2xl font-bold">CityFix</h1>
          </div>

          <NavbarLargeDevice openMenu={openMenu} setOpenMenu={setOpenMenu}></NavbarLargeDevice>

          <div className="flex items-center gap-4">
            <CiLight
              onClick={() => setTheme("light")}
              className="text-3xl cursor-pointer"
            />
            <CiDark
              onClick={() => setTheme("dark")}
              className="text-3xl cursor-pointer"
            />
            <UserDropdown></UserDropdown>
          </div>
        </div>
      </Container>
      <NavbarSmallDevice
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      ></NavbarSmallDevice>
    </div>
  );
};

export default Header;
