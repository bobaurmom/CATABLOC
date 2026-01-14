import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/userProfile.css";
import catImage from "../assets/cat.png";
import starIcon from "../assets/star.svg";
import fireIcon from "../assets/fire.svg";
import Btn from "./ui/button";
import apiFetch from "../services/profile";

interface UserStats {
  exp: number;
  streak: number;
  bio: string;
}

interface UserProfileProps {
  name: string;
  onStatsLoad?: (stats: UserStats) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, onStatsLoad }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    exp: 0,
    streak: 0,
    bio: ""
    });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiFetch("/api/dashboard/dashboard");
        
        // Check content type to determine if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          setError("Invalid response from server");
          setIsLoading(false);
          return;
        }
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('Full response:', responseData);
          
          const userData = responseData.user;
          if (!userData) {
            setError("Invalid profile data received");
            setIsLoading(false);
            return;
          }
          
          const newStats: UserStats = {
            exp: userData.xp || 0,
            streak: userData.streak || 0,
            bio: userData.bio || "idk what to put here"
          };
          
          setStats(newStats);
          
          if (onStatsLoad) {
            onStatsLoad(newStats);
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: "Failed to load profile" }));
          setError(errorData.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
        setError("Unable to connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [onStatsLoad]);

  if (error) {
    return (
      <div className="userCard error-state" role="alert">
        <p>{error}</p>
      </div>
    );
  }

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
        </div>
      </div>

      <div className="stats">
        <StatCard
          label="EXP"
          value={stats.exp}
          icon={starIcon}
          iconAlt="Experience points"
          gradientClass="stat-exp"
          isLoading={isLoading}
        />
        <StatCard
          label="Streak"
          value={stats.streak}
          icon={fireIcon}
          iconAlt="Current streak"
          gradientClass="stat-streak"
          isLoading={isLoading}
        />
      </div>

      <Btn text="VIEW PROFILE" onClick={() => navigate('/profile')} />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  iconAlt: string;
  gradientClass: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconAlt,
  gradientClass,
  isLoading = false,
}) => (
  <div className={`stat-card ${gradientClass}`}>
    <div className="stat-content">
      <span className="stat-label">{label}</span>
      <div className="stat-details">
        <img src={icon} alt={iconAlt} className="icon" />
        <span className="stat-number">
          {isLoading ? "..." : value}
        </span>
      </div>
    </div>
  </div>
);

export default UserProfile;