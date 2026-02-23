import { useGameSelection } from "../../hooks/useGameSelection";
import { useNavigate } from "react-router-dom";
import { startSession } from "../../services/gameService";
const levelPanel = ({totalLevels, gameName, handleClose}: {totalLevels: number, gameName: string, handleClose: () => void}) => {
    const { setCurrentLevel, setSessionId, gameId } = useGameSelection();
    const navigate = useNavigate();
    const handleLevelSelect = (levelNumber: number) => {
        setCurrentLevel(levelNumber);
    
        startSession(levelNumber).then(session => {
            console.log("Session response:", session);
            if(session) {
                console.log("Setting sessionId:", session);
                setSessionId(session);
            } else {
                console.warn("No session returned");
            }
            navigate('/level');
        }).catch(error => {
            console.error("Error starting session:", error);
        });
    }   
	return (
        <div className="modal-game-selection-levels fixed inset-0 flex flex-col items-center justify-center z-50 w-full h-full" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleClose}>
            <div className="game-selection-panel p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
                <h3>{gameName}: Select Your Level</h3>
                <div className="game-selection-level-container grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {[...Array(totalLevels)].map((_, index) => (
                        <div key={index} className="game-selection-level bg-gray-200 rounded-lg flex items-center justify-center aspect-square hover:bg-gray-300 cursor-pointer">
                            <button onClick={() => handleLevelSelect(index + 1)} className="select-btn w-full h-full p-4">Level {index + 1}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default levelPanel;