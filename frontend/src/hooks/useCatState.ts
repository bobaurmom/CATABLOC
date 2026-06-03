import { useRef, useState } from "react";
import type { Position } from "../type/gameType"
import type { Facing, LevelLayout } from "../component/game/GameScene";
import { GameEngine } from "../services/gameEngine";


const rotationMap: Record<Facing, number> = { 
  up: -90, 
  right: 0, 
  down: 90, 
  left: 180 
};
    
const useCatState = () => {
    const [catPos, setCatPos] = useState<Position>({ x: 0, y: 0 });
    const [catDeg, setCatDeg] = useState<number>(0);
    const [layout, setLayout] = useState<LevelLayout | null>(null);
    const engineRef = useRef<GameEngine | null>(null);
    const initialState = { catPos: { x: 0, y: 0 }, catDeg: 0 };

    const initialize = (layout: LevelLayout) => {
        if(!layout) throw new Error("Layout is required to initialize cat state");
        setLayout(layout);
        const facing = layout.facing;
        const deg = rotationMap[facing || 'right'];
        setCatDeg(deg);
        setCatPos(layout.cat_start);
        engineRef.current = new GameEngine(layout, deg);
    };

    const updateCatState = (newPos: Position, newDeg: number) => {
        setCatPos(newPos);
        setCatDeg(newDeg);
    };

    const resetCatState = () => {
        if(engineRef.current && layout) {
            console.log("layout in resetCatState:", layout);
            setCatPos(layout.cat_start);
            setCatDeg(rotationMap[layout.facing || 'right']);
            engineRef.current.reset();
        }
    };

    const getEngine = () => {
        return engineRef.current;
    }
    return {layout, catPos, catDeg,initialize, updateCatState, getEngine, resetCatState };
};
export default useCatState;