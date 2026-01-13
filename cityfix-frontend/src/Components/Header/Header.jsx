import React, { useState } from "react";
import Container from "../Container";
import logo from "../../assets/logo.png";
import NavbarLargeDevice from "./NavbarLargeDevice";
import UserDropdown from "./UserDropdown";
import NavbarSmallDevice from "./NavbarSmallDevice";

const Header = () => {

    const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="bg-surface py-5">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* mobile navbar toggler */}
            <div onClick={()=>setOpenMenu(!openMenu)} className="flex flex-col md:hidden items-start mt-1 space-y-1 cursor-pointer">
              <span className="h-1 w-7 bg-primary rounded-md"></span>
              <span className="h-1 w-5 bg-primary rounded-md"></span>
              <span className="h-1 w-7 bg-primary rounded-md"></span>
            </div>
            <img src={logo} alt="" className="w-12" />
            <h1 className="text-2xl font-bold">CityFix</h1>
          </div>

          <NavbarLargeDevice></NavbarLargeDevice>
          <UserDropdown></UserDropdown>
        </div>
      </Container>
      <NavbarSmallDevice openMenu={openMenu} setOpenMenu={setOpenMenu}></NavbarSmallDevice>
    </div>
  );
};

export default Header;
