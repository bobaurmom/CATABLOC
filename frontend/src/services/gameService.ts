
import type { CodeBlock, BlockType } from "../type/gameType";
import api from "./api";

export const fetchBloc = async (): Promise<CodeBlock[]> => {
  try {
    const response = await api.get("/codeblocks");
    const dbData = response.data;
    return dbData.map((db: any) => ({
      id: String(db.codeblock_id), 
      type: (db.block_type === 'movement' ? 'action' : db.block_type) as BlockType,
      label: db.block_command ? db.block_command.toUpperCase() : "",
      nestedBlocks: [],
      condition: db.block_type === 'while' || db.block_type === 'condition'
        ? "FRONT_IS_CLEAR"
        : undefined
    }));
  } catch (error) {
    console.error("Failed to fetch blocks from backend:", error);
    return []; 
  }
};

// Response format still waiting from backend later
export const fetchLayout = async (gameId :number, levelId:number): Promise<any> => {
  try {
    const response = await api.get(`/games/${gameId}/level/${levelId}`);
    const layoutData = response.data;
    console.log("Layout data from backend:", layoutData);
    return {
      levelId: layoutData.level_id,
      gameId: layoutData.game_id,
      levelNumber: layoutData.level_number,
      title: layoutData.title,
      description: layoutData.description,
      availableBlocksStr: layoutData.available_codeblocks,
      layout: layoutData.level_layout,
      blockLimit: layoutData.block_limit,
      timeLimit: layoutData.time_limit,
    };
  } catch (error) {
    console.error("Failed to fetch level layout from backend:", error);
    return null; 
  }
};

export const startSession = async (levelId: number): Promise<number | null> => {
  try {
    const response = await api.post(`/games/start`, { level_id: levelId });
    const data = response.data;
    return data.session_id;
  } catch (error) {
    console.error("Failed to start game session:", error);
    return null;
  }
}

// Response format still waiting from backend later
export const completeGame = async (sessionId: number, levelId: number, blockUsed: number, time_spent: number, userCode: CodeBlock[]): Promise<any> => {
  const body = {
    "session_id": sessionId,
    "level_id": levelId,
    "blocks_used": blockUsed,
    "time_spent": time_spent,
    "commands": userCode
  };
  try{
    const response = await api.post(`/games/complete`, body);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Failed to complete game session:", error);
    return null;

  }
};
