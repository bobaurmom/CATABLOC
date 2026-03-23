import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TalkingCat from "../component/ui/talkingCat";
import Leaderboard from "../component/dashboard/leaderboard";
import Card from "../component/dashboard/gameCard";
import Profile from "../component/dashboard/userProfile";
import "../style/dashboard.css";
import gameCover1 from "../assets/gamecover1.svg";
import LevelPanel from "../component/dashboard/gameSelectionPanel";
import { useGameSelection } from "../hooks/useGameSelection";
import { getLevelsCount } from "../services/gameService";

interface UserStats {
  exp: number;
  streak: number;
  bio: string;
}

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("student");
    const [ popUpVisible, setPopupVisible ] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const { gameId, setGameId, totalLevels, setTotalLevels, gameName, setGameName } = useGameSelection();

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

    const handlePlayGame = useCallback((gameName: string, gameId: number) => {
        if (setGameId && setGameName && setTotalLevels) {
            setGameId(gameId);
            setGameName(gameName);
            
            // Fetch the actual number of levels for this game
            getLevelsCount(gameId).then(count => {
                setTotalLevels(count);
                setPopupVisible(true);
            }).catch(error => {
                console.error("Error fetching levels count:", error);
                setTotalLevels(0);
            });
        }
    }, [setGameId, setGameName, setTotalLevels]);

    return (
        <div className="dashboard-container">
            {(popUpVisible && gameName && totalLevels) ? <LevelPanel totalLevels={totalLevels} gameName={gameName} handleClose={() => setPopupVisible(false)}></LevelPanel>  : (popUpVisible && <div><h3>Failed to load game levels</h3></div>)}
            <div className="dashboard-wrapper">
                <div className="dashboard-left">
                    <TalkingCat text={`Welcome back ${userName} \\( >v< )/`} />
                    
                    <div className="dashboard-games-grid">
                        <Card 
                            text="Purfect Pathing" 
                            detail="Ready to be a cat catching a mouse?"
                            gameImage={gameCover1}
                            onPlay={() => handlePlayGame("Purfect Pathing", 1)}
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