import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/userProfile.css";
import catImage from "../assets/cat.png";
import starIcon from "../assets/star.svg";
import fireIcon from "../assets/fire.svg";
import Btn from "./ui/button";

interface UserProfileProps {
  name: string;
  bio: string;
  exp?: number;      // optional and dynamic
  streak?: number;   // optional and dynamic
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  bio,
  exp = 67,
  streak = 7,
}) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="userCard" role="region" aria-label={`Profile of ${name}`}>
      <div className="profile">
        <div className="profile-image" aria-hidden="true">
          <img
            src={catImage}
            alt={`${name}'s profile`}
            className="image-user"
          />
        </div>
        <div className="text-user">
          <span className="name">{name}</span>
          <span className="job">{bio}</span>
        </div>
      </div>

      <div className="stats">
        <StatCard
          label="EXP"
          value={exp}
          icon={starIcon}
          iconAlt="Experience points"
          gradientClass="stat-exp"
        />
        <StatCard
          label="Streak"
          value={streak}
          icon={fireIcon}
          iconAlt="Current streak"
          gradientClass="stat-streak"
        />
      </div>

      <Btn text="VIEW PROFILE" onClick={handleViewProfile} bgColor="#1013C4" />
    </div>
  );
};

// Extracted reusable stat card
interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  iconAlt: string;
  gradientClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconAlt,
  gradientClass,
}) => (
  <div className={`stat-card ${gradientClass}`}>
    <div className="stat-content">
      <span className="stat-label">{label}</span>
      <div className="stat-details">
        <img src={icon} alt={iconAlt} className="icon" />
        <span className="stat-number">{value}</span>
      </div>
    </div>
  </div>
);

export default UserProfile;