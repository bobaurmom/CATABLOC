import React from "react";
import logo from "../../assets/logo.svg";
import "../../style/header.css";
import Btn from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import profilePic from "../../../public/asset/defaultProfile.png";
const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropDown = () => {
      setIsOpen(!isOpen);
    }
  return (
    <header className="header">
      <div className="header-left">
          <div className={`burger ${isOpen ? "burger-open" : ""}`} onClick={dropDown}>
            <div className="line line-first"></div>
            <div className="line line-second"></div>
            <div className="line line-third"></div>
          <div className={`dropDown ${isOpen ? "dropDown-show" : ""}`}>
          <div className="dropDown-content">
            <a href="/dashboard" className="drop-content">Dashboard</a>
            <a href="#about" className="drop-content">About Us</a>
            <a href="#help" className="drop-content">Help Center</a>
            </div>
          </div>
        </div>
        <a href="/">
          <img src={logo} alt="Catabloc Logo" className="header-logo" />
        </a>
        <span className="header-title">CATABLOC</span>
      </div>
      <nav className="header-middle">
        <a href="/dashboard" className="header-text">
          LEARN
        </a>
        <a href="#about" className="header-text">
          ABOUT US
        </a>
        <a href="#help" className="header-text">
          HELP CENTER
        </a>
      </nav>
      {isAuthenticated ? (
        <div className="header-user">
          <img src={profilePic} alt="profile" className="profile-pic"/>
          <span className="header-username">{user?.name}</span>
        </div>
      ) : (
        <a href="/register">
          <Btn text="Sign Up"></Btn>
        </a>
      )}
    </header>
  );
};
export default Header;
