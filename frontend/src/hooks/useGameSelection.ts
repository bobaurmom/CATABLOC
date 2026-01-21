import { useContext } from "react";
import { GameContext } from "../contexts/gameContext";
const useGameSelection = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameSelection must be used within a GameProvider");
    }
    return context;
}

export { useGameSelection };