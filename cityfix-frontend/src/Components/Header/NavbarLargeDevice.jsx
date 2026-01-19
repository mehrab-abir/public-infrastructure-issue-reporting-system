import React from 'react';
import { NavLink } from 'react-router';

const NavbarLargeDevice = () => {
    return (
      <nav className="hidden md:flex items-center gap-7">
        <NavLink to="/" className="hover:text-accent p-1">
          Home
        </NavLink>
        <NavLink to="/all-issues" className="hover:text-accent p-1">
          All Issues
        </NavLink>
        <NavLink to="/report-issue" className="hover:text-accent p-1">
          Report Issue
        </NavLink>
        <NavLink to="/about" className="hover:text-accent p-1">
          About Us
        </NavLink>
        <NavLink to="/dashboard" className="hover:text-accent p-1">
          Dashboard
        </NavLink>
      </nav>
    );
};

export default NavbarLargeDevice;