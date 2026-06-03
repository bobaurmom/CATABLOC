import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import catImage from "../../assets/cat.png";
import starIcon from "../../assets/star.svg";
import fireIcon from "../../assets/fire.svg";
import Btn from "../ui/Button";
import apiFetch from "../../services/profile";

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
      <div className="flex flex-col items-center justify-between min-h-[280px] bg-white rounded-[20px] p-[30px_2rem] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] mt-auto" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[280px] bg-white rounded-[20px] p-[30px_2rem] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] mt-auto w-full" role="region" aria-label={`Profile of ${name}`}>
      <div className="flex items-center w-full">
        <div className="relative w-[50px] h-[50px] rounded-full bg-black p-[2px] mr-5" aria-hidden="true">
          <img
            src={catImage}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover rounded-full block"
          />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-black text-xl font-medium">{name}</span>
        </div>
      </div>

      <div className="mt-[25px] mb-[10px] justify-between w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="EXP"
          value={stats.exp}
          icon={starIcon}
          iconAlt="Experience points"
          gradientClass="bg-gradient-to-r from-[#1013c4] to-[#393cff]"
          isLoading={isLoading}
        />
        <StatCard
          label="Streak"
          value={stats.streak}
          icon={fireIcon}
          iconAlt="Current streak"
          gradientClass="bg-gradient-to-r from-[#fb923c] to-[#ff9862]"
          isLoading={isLoading}
        />
      </div>

      <Btn onClick={() => navigate('/profile')}>
        VIEW PROFILE
      </Btn>
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
  <div className={`flex flex-col items-start rounded-[12px] p-[20px_15px] transition-transform duration-200 hover:scale-105 cursor-pointer ${gradientClass} w-full`}>
    <div className="flex flex-col w-full">
      <span className="text-white text-2xl font-bold mb-[10px] text-left w-full">{label}</span>
      <div className="flex items-center w-full">
        <img src={icon} alt={iconAlt} className="w-[30px] h-[30px] mr-5 shrink-0" />
        <span className="text-[40px] text-white font-bold">
          {isLoading ? "..." : value}
        </span>
      </div>
    </div>
  </div>
);

export default UserProfile;