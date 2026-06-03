import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TalkingCat from "../component/ui/TalkingCat";
import Leaderboard from "../component/dashboard/Leaderboard";
import Card from "../component/dashboard/GameCard";
import Profile from "../component/dashboard/UserProfile";
import gameCover1 from "../assets/gamecover1.svg";
import LevelPanel from "../component/dashboard/GameSelectionPanel";
import { useGameSelection } from "../hooks/useGameSelection";
import BreadcrumbAlert from "../component/ui/Snackbar";

interface UserStats {
  exp: number;
  streak: number;
  bio: string;
}

const style = document.createElement('style');
style.textContent = `@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(style);

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
            setTotalLevels(3);  
            setPopupVisible(true);
        }
    }, [setGameId, setGameName, setTotalLevels]);

    return (
        <div className="min-h-[calc(100vh-120px)] py-10 px-5 max-md:py-5 max-md:px-[10px] bg-white"
             style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
            {(popUpVisible && gameName && totalLevels) ? <LevelPanel totalLevels={totalLevels} gameName={gameName} handleClose={() => setPopupVisible(false)}></LevelPanel>  : (popUpVisible && <div><h3>Failed to load game levels</h3></div>)}
            <div className="grid grid-cols-[2fr_1fr] justify-items-center max-xl:grid-cols-1 max-xl:gap-[25px]">
                <div className="flex flex-col items-center justify-start flex-[1_1_680px] min-w-[300px] max-w-[680px] gap-5">
                    <TalkingCat text={`Welcome back ${userName} \\( >v< )/`} />
                    
                    <div className="w-full flex flex-col gap-[30px] max-md:gap-5">
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

                <div className="grid grid-cols-1 w-3/5 gap-[25px] xl:sticky xl:top-20 max-xl:static">
                    <Profile 
                        name={userName} 
                        onStatsLoad={handleStatsLoad}
                    />
                    <Leaderboard />
                </div>
            </div>
            <BreadcrumbAlert state="success" duration={3000} onClose={() => setPopupVisible(false)}>
                {`Starting ${gameName}...`}
            </BreadcrumbAlert>
        </div>
    );
}

export default Dashboard;