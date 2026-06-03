import type React from "react";
import logo from "../../assets/logo.svg";

interface prop {
  text: string;
}
const TalkingCat: React.FC<prop> = ({ text }) => {
  return (
    <div className="flex items-center justify-center gap-[30px] w-[clamp(280px,80%,600px)]">
      <img src={logo} alt="Cat" className="w-[clamp(50px,20%,80px)] animate-bounce" />
      <div className="relative bg-[#E8E8E8] py-[calc(5%+10px)] px-[calc(8%+8px)] rounded-[15px] border-2 border-[#333] font-mono text-base font-medium text-black before:content-[''] before:absolute before:left-[-10px] before:top-1/2 before:-translate-y-1/2 before:border-t-[10px] before:border-b-[10px] before:border-r-[10px] before:border-t-transparent before:border-b-transparent before:border-r-[#333] after:content-[''] after:absolute after:left-[-7px] after:top-1/2 after:-translate-y-1/2 after:border-t-[8px] after:border-b-[8px] after:border-r-[8px] after:border-t-transparent after:border-b-transparent after:border-r-[#E8E8E8]">{text}</div>
    </div>
  );
};
export default TalkingCat;

