import React from "react";
import "../style/userProfile.css";
import catImage from "../assets/cat.png";
import starIcon from "../assets/star.svg";
import fireIcon from "../assets/fire.svg";

const userProfile: React.FC = () => {
  return (
    <div className="userCard">
      <div className="profile">
        <div className="profile-image">
          <img src={catImage} alt="cat" className="image" />
        </div>
        <div className="text">
          <span className="name">Boba</span>
          <span className="job">Student</span>
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
      <button>View Profile</button>
    </div>
  );
};

export default userProfile;
