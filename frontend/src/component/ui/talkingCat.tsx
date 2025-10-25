import type React from "react";
import logo from "../../assets/logo.svg";
import "../../style/talkingCat.css";
interface prop {
  text: string;
}
const TalkingCat: React.FC<prop> = ({ text }) => {
  return (
    <div className="talkingCat">
      <img src={logo} alt="Cat" style={{ width: "80px" }} />
      <div className="text">{text}</div>
    </div>
  );
};
export default TalkingCat;
