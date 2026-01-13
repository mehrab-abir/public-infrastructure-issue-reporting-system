import React from 'react';
import { NavLink } from 'react-router';
import { FaRegTimesCircle } from "react-icons/fa";

const NavbarSmallDevice = ({openMenu, setOpenMenu}) => {
    return (
      <div
        className={`w-full h-screen fixed top-0 left-0 bg-surface-alt ${
          openMenu ? "" : "-translate-x-full"
        } transition-all duration-400`}
      >
        <FaRegTimesCircle className='text-3xl absolute top-6 right-7 cursor-pointer' onClick={()=>setOpenMenu(!openMenu)} />
        <nav className="flex flex-col items-center space-y-3 justify-center mt-15">
          <NavLink to="/" className="hover:text-accent text-lg" onClick={()=>setOpenMenu(!openMenu)}>
            Home
          </NavLink>
          <NavLink to="/all-issues" className="hover:text-accent text-lg" onClick={()=>setOpenMenu(!openMenu)}>
            All Issues
          </NavLink>
          <NavLink to="/about" className="hover:text-accent text-lg" onClick={()=>setOpenMenu(!openMenu)}>
            About Us
          </NavLink>
          <NavLink to="/contact" className="hover:text-accent text-lg" onClick={()=>setOpenMenu(!openMenu)}>
            Contact
          </NavLink>
        </nav>
      </div>
    );
};

export default NavbarSmallDevice;