import React, { useEffect, useState } from "react";
import Container from "../Container";
import logo from "../../assets/logo.png";
import NavbarLargeDevice from "./NavbarLargeDevice";
import UserDropdown from "./UserDropdown";
import NavbarSmallDevice from "./NavbarSmallDevice";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { Link } from "react-router";
import useAuth from "../../Hooks/Auth/useAuth";

const Header = () => {
  const {user,loading} = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  if(loading){
    return <span className="loading loading-spinner text-info"></span>;
  }

  return (
    <div className="bg-surface py-5 fixed w-full z-30">
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
            <Link to="/" className="flex items-center gap-1">
              <img src={logo} alt="" className="w-10 md:w-12" />
              <h1 className="text-2xl font-bold">CityFix</h1>
            </Link>
          </div>

          <NavbarLargeDevice
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          ></NavbarLargeDevice>

          <div className="flex items-center gap-4">
            {theme === "light" ? (
              <CiDark
                onClick={() => setTheme("dark")}
                className="text-3xl cursor-pointer"
              />
            ) : (
              <CiLight
                onClick={() => setTheme("light")}
                className="text-3xl cursor-pointer"
              />
            )}

            {user ? (
              <UserDropdown></UserDropdown>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="btn btn-sm border border-blue-500 text-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="btn btn-sm border-none bg-primary text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
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
