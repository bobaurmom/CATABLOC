import React from "react";
import "../style/userProfile.css";
import catImage from "../assets/cat.png";
import starIcon from "../assets/star.svg";
import fireIcon from "../assets/fire.svg";
import Btn from "./ui/button";
interface a {
  name: string;
  bio: string;
}

const userProfile: React.FC<a>= ({name, bio}) => {
  return (
    <div className="userCard">
      <div className="profile">
        <div className="profile-image">
          <img src={catImage} alt="cat" className="image-user" />
        </div>
        <div className="text-user">
          <span className="name">{name}</span>
          <span className="job">{bio}</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat-card stat-exp">
          <div className="stat-content">
            <span className="stat-label">EXP</span>
            <div className="stat-details">
              <img src={starIcon} alt="star" className="icon" />
              <span className="stat-number">67</span>
            </div>
          </div>
        </div>
        <div className="stat-card stat-streak">
          <div className="stat-content">
            <span className="stat-label">Streak</span>
            <div className="stat-details">
              <img src={fireIcon} alt="fire" className="icon" />
              <span className="stat-number">7</span>
            </div>
          </div>
        </div>
      </div>
      <Btn text="View Profile"></Btn>
      {/* <button>View Profile</button> */}
    </div>
  );
};

export default userProfile;
