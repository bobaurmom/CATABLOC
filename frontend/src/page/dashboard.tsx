import TalkingCat from "../component/ui/talkingCat";
import Leaderboard from "../component/leaderboard";
import Card from "../../src/component/gameCard";
import Profile from "../component/userProfile";

function Dashboard() {
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-center",
                justifyContent: "center",
                margin: "120px 0px",
                gap: "50px",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "680px",
                    gap: "50px",
                }}>
                    <TalkingCat text="Welcome back {student} \( >v< )/" />
                    <Card text="Purfect Pathing" detail="Ready to be a cat catching a mouse?program a cat to catch a mouse. Use simple commands to set the cat's path. Plan your moves to outsmart the mouse. It's a fun way to learn basic coding logic."></Card>
                    <Card text="Coming soon" detail="Ready to be a cat catching a mouse?program a cat to catch a mouse. Use simple commands to set the cat's path. Plan your moves to outsmart the mouse. It's a fun way to learn basic coding logic."></Card>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "auto",
                    gap: "50px",
                }}>
                    <Profile name="Boba" bio="Student"></Profile>
                    <Leaderboard></Leaderboard>
                </div>
            </div>
        </>
    )
}

export default Dashboard