import React from "react";
import logo from "../../assets/logo.svg";
import { Link } from "react-router";
const Footer: React.FC = () => {
  return (
    <footer className="box-border bg-[#0a0909] text-white py-10 flex flex-col max-md:py-5">
      <Link to="/" className="flex items-center px-[5%]">
        <img src={logo} alt="Catabloc Logo" className="w-10 h-10 mr-[10px]" />
        <span className="font-bold text-lg">CATABLOC</span>
      </Link>
      <div className="box-border w-full flex justify-between px-[5%] max-md:flex-col max-md:gap-5">
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-base mb-[10px]">About</h3>
          <div className="flex flex-col gap-[3px]">
            <a href="#" className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]">
              About
            </a>
            <a href="#" className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]">
              Community
            </a>
            <a href="#" className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]">
              Help Center
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-base mb-[10px]">Practice</h3>
          <div className="flex flex-col gap-[3px]">
            <a href="#" className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]">
              Challenge
            </a>
            <span className="block text-[#6c757d] opacity-70">Coming Soon...</span>
            <span className="block text-[#6c757d] opacity-70">Coming Soon...</span>
            <span className="block text-[#6c757d] opacity-70">Coming Soon...</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h3 className="font-bold text-base mb-[10px]">Learn More</h3>
          <div className="flex flex-col gap-[3px]">
            <a
              href="https://www.geeksforgeeks.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]"
            >
              GeeksforGeeks
            </a>
            <a
              href="https://www.programiz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]"
            >
              Programiz
            </a>
            <a
              href="https://www.w3schools.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]"
            >
              W3Schools
            </a>
            <a
              href="https://www.codedex.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#6c757d] no-underline transition-colors duration-300 hover:text-[#007bff]"
            >
              Codedex
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
