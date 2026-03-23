import apiFetch from "./profile"; 
import type { CodeBlock, BlockType } from "../component/game/codebloc";

const fetchBloc = async (): Promise<CodeBlock[]> => {
  try {
    const response = await apiFetch("/api/games/codeblocks");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dbData = await response.json();

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
export const fetchLayout = async (gameId: number, levelId: number): Promise<any> => {
  try {
    const response = await apiFetch(`/api/games/${gameId}/level/${levelId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const layoutData = await response.json();
    console.log("Layout data from backend:", layoutData);
    
    // available_codeblocks is already an array of command strings like ["move_forward", "turn_left", ...]
    const availableBlocksStr = Array.isArray(layoutData.available_codeblocks) 
      ? layoutData.available_codeblocks
      : [];
    
    // Map snake_case to camelCase
    return {
      levelId: layoutData.level_id,
      gameId: layoutData.game_id,
      levelNumber: layoutData.level_number,
      title: layoutData.title,
      description: layoutData.description,
      availableBlocksStr: availableBlocksStr,
      layout: layoutData.level_layout,
      blockLimit: layoutData.block_limit,
      timeLimit: layoutData.time_limit,
    };
  } catch (error) {
    console.error("Failed to fetch level layout from backend:", error);
    return null; 
  }
};
export const startSession = async (gameId: number, levelId: number): Promise<number | null> => {
  try {
    const response = await apiFetch(`/api/games/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"game_id": gameId, "level_id": levelId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    const data = await response.json();
    return data.session_id;
  } catch (error) {
    return null;
  }
};
export const completeGame = async (sessionId: number, levelId: number, blockUsed: number, time_spent: number, userCode: CodeBlock[]): Promise<Response | null> => {
  const body = {
    "session_id": sessionId,
    "level_id": levelId,
    "blocks_used": blockUsed,
    "time_spent": time_spent,
    "commands": userCode
  };
  console.log("Complete Game Request Body:", JSON.stringify(body));
  try {
    const response = await apiFetch(`/api/games/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "session_id": sessionId,
        "level_id": levelId,
        "blocks_used": blockUsed,
        "time_spent": time_spent,
        "commands": userCode
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Failed to complete game session:", error);
    return null;
  }
};

export const getLevelsCount = async (gameId: number): Promise<number> => {
  try {
    const response = await apiFetch(`/api/games/${gameId}/levels-count`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.levels_count || 0;
  } catch (error) {
    console.error("Failed to fetch levels count:", error);
    return 0;
  }
};

export default fetchBloc;