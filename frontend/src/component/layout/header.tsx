import React from "react";
import logo from "../../assets/logo.svg";
import Btn from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import profilePic from "../../assets/defaultProfile.png";
import { Link } from "react-router-dom";
const Header: React.FC = () => {
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropDown = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };
  return (
    <header className="sticky top-0 left-0 z-[1000] flex justify-between items-center px-[5%] h-[60px] bg-[#0a0909]">
      <div className="flex items-center gap-[5px]">
        <div
          className={`md:hidden flex-col gap-[5px] ${isOpen ? "flex" : "flex"}`}
          onClick={dropDown}
        >
          <div className={`bg-gray-500 w-[30px] h-[5px] rounded-[10px] origin-left transition-all duration-[0.1s] ${isOpen ? "rotate-45" : ""}`}></div>
          <div className={`bg-gray-500 w-[30px] h-[5px] rounded-[10px] ${isOpen ? "invisible" : ""}`}></div>
          <div className={`bg-gray-500 w-[30px] h-[5px] rounded-[10px] origin-left transition-all duration-[0.1s] ${isOpen ? "-rotate-45" : ""}`}></div>
          <div className={`${isOpen ? "flex flex-col" : "hidden"} fixed top-[60px] left-0`}>
            <div className="flex flex-col bg-white">
              <Link to="/dashboard" className="border border-black p-[10px] no-underline text-black hover:bg-[hsl(0,0%,66%)]">
                Dashboard
              </Link>
              <Link to="#about" className="border border-black p-[10px] no-underline text-black hover:bg-[hsl(0,0%,66%)]">
                About Us
              </Link>
              <Link to="#help" className="border border-black p-[10px] no-underline text-black hover:bg-[hsl(0,0%,66%)]">
                Help Center
              </Link>
            </div>
          </div>
        </div>
        <Link to="/" className="flex gap-2 items-center">
          <img src={logo} alt="Catabloc Logo" className="w-10 h-auto" />
          <span className="text-white text-lg font-bold">CATABLOC</span>
        </Link>
      </div>
      <nav className="flex items-center gap-[70px] max-md:hidden">
        <Link to="/dashboard" className="text-white no-underline text-base transition-colors duration-300 hover:text-[#1914b6]">
          LEARN
        </Link>
        <Link to="#about" className="text-white no-underline text-base transition-colors duration-300 hover:text-[#1914b6]">
          ABOUT US
        </Link>
        <Link to="#help" className="text-white no-underline text-base transition-colors duration-300 hover:text-[#1914b6]">
          HELP CENTER
        </Link>
      </nav>
      {isAuthenticated ? (
        <div
          className="flex items-center justify-center gap-[10%] bg-[#0a0909] h-[60px] px-[1%] hover:bg-[hsl(0,5%,15%)] cursor-pointer"
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        >
          <img src={profilePic} alt="profile" className="w-10 rounded-full" />
          <span className="text-white text-base">{user?.name}</span>
        </div>
      ) : (
        <Link to="/register">
          <Btn state="default">Sign Up</Btn>
        </Link>
      )}
      {profileMenuOpen && (
        <div className="fixed top-20 md:top-15 right-0 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 flex flex-col">
          <div className="border-b border-gray-300 p-2 mb-2 hover:bg-gray-100 cursor-pointer w-full">
            View Profile
          </div>
          <div className="border-b border-gray-300 p-2 mb-2 hover:bg-gray-100 cursor-pointer w-full">
            Help Center
          </div>
          <Btn state="warning" onClick={handleLogout}>
            Log out
          </Btn>
        </div>
      )}
    </header>
  );
};
export default Header;
