import { useEffect, useState } from "react";
import TalkingCat from "../component/ui/talkingCat";
import Leaderboard from "../component/leaderboard";
import Card from "../component/gameCard";
import Profile from "../component/userProfile";
import catImage from "../assets/cat.png";
import "../style/dashboard.css";

function Dashboard() {
    const [userName, setUserName] = useState<string>("Student");

    // TODO: Replace with actual auth context when implemented
    useEffect(() => {
        // Fetch user data from localStorage or API
        const storedUser = localStorage.getItem("userName");
        if (storedUser) {
            setUserName(storedUser);
        }
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                {/* Left Column - Games Section */}
                <div className="dashboard-left">
                    <TalkingCat text={`Welcome back ${userName} \\( >v< )/`} />
                    
                    <div className="dashboard-games-grid">
                        <Card 
                            text="Purfect_Pathing" 
                            detail="Ready to be a cat catching a mouse?program a cat to catch a mouse. Use simple commands to set the cat's path. Plan your moves to outsmart the mouse. It's a fun way to learn basic coding logic."
                            gameImage={catImage}
                            onPlay={() => console.log("Navigate to Purfect Pathing game")}

                        />
                        <Card 
                            text="Coming Soon" 
                            detail="Coming Soon ..."
                            gameImage={catImage}
                            disabled={true}
                        />
                    </div>
                </div>

                {/* Right Column - Profile & Leaderboard */}
                <div className="dashboard-right">
                    <Profile name={userName} bio="Student" exp={67} streak={7} />
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;