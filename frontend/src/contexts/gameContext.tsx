import { createContext, useState } from "react";
import type { FC, ReactNode } from "react";
export interface gameContextType {
  gameId: number;
  setGameId: (id: number) => void;
  totalLevels: number;
  setTotalLevels: (levels: number) => void;  
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  gameName?: string;
  setGameName?: (name: string) => void;
}
export const GameContext = createContext<gameContextType | null>(null);

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [gameId, setGameId] = useState<number>(0);
    const [totalLevels, setTotalLevels] = useState<number>(0);
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [gameName, setGameName] = useState<string>("");
    return (
        <GameContext.Provider value={{ gameId, setGameId, totalLevels, setTotalLevels, currentLevel, setCurrentLevel, gameName, setGameName }}>
            {children}
        </GameContext.Provider>
    );
}