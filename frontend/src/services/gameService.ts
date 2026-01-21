import apiFetch from "./profile"; 
import type { CodeBlock, BlockType } from "../component/game/codebloc";

const fetchBloc = async (): Promise<CodeBlock[]> => {
  try {
    const response = await apiFetch("/api/codeblocks");

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
export const fetchLayout = async (levelId: number): Promise<any> => {
  try {
    const response = await apiFetch(`/api/games/level/${levelId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const layoutData = await response.json();
    
    // Map snake_case to camelCase
    return {
      levelId: layoutData.level_id,
      gameId: layoutData.game_id,
      levelNumber: layoutData.level_number,
      title: layoutData.title,
      description: layoutData.description,
      availableBlocksStr: layoutData.available_blocks_str,
      layout: layoutData.level_layout,
      blockLimit: layoutData.block_limit,
      timeLimit: layoutData.time_limit,
    };
  } catch (error) {
    console.error("Failed to fetch level layout from backend:", error);
    return null; 
  }
};

export default fetchBloc;