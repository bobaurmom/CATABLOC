import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TalkingCat from "../component/ui/talkingCat";
import Leaderboard from "../component/leaderboard";
import Card from "../component/gameCard";
import Profile from "../component/userProfile";
import "../style/dashboard.css";
import gameCover1 from "../assets/gamecover1.svg";

interface UserStats {
  exp: number;
  streak: number;
  bio: string;
}

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("student");
    const [userStats, setUserStats] = useState<UserStats | null>(null);

    useEffect(() => {
        // Get username from localStorage
        const storedName = localStorage.getItem("user");
        if (storedName) {
            try {
                const user = JSON.parse(storedName);
                setUserName(user.name || "student");
            } catch (error) {
                console.error("Failed to parse user data:", error);
                setUserName("student");
            }
        }
    }, []);

    // Callback to receive stats from Profile component
    const handleStatsLoad = useCallback((stats: UserStats) => {
        setUserStats(stats);
    }, []);

    const handlePlayGame = useCallback((gameName: string) => {
        console.log(`Navigate to ${gameName} game`);
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <div className="dashboard-left">
                    <TalkingCat text={`Welcome back ${userName} \\( >v< )/`} />
                    
                    <div className="dashboard-games-grid">
                        <Card 
                            text="Purfect_Pathing" 
                            detail="Ready to be a cat catching a mouse?"
                            gameImage={gameCover1}
                            onPlay={() => handlePlayGame("Purfect_Pathing")}
                        />
                        <Card 
                            text="Coming Soon" 
                            detail="Coming Soon ..."
                            gameImage={gameCover1}
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="dashboard-right">
                    <Profile 
                        name={userName} 
                        onStatsLoad={handleStatsLoad}
                    />
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;