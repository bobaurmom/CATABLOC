interface game {
    game_id: number;
    title: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
}
interface codeblock{
    codeblock_id: number;
    block_type: 'forward' | 'backward' | 'turn_left' | 'turn_right'|'repeat' | 'if' ;    
    created_at?: Date;
    updated_at?: Date;
}
interface board_data{
    board_data_id: number;
    level_id: number;
    grid_size: number;
    obstacles: string; // JSON string representing obstacle positions
    start_position: string; // JSON string representing start position
    goal_position: string; // JSON string representing end position
    created_at?: Date;
    updated_at?: Date;
}
interface action{
    action_id: number;
    session_id: number;
    codeblock_id: number;
    action_type: 'execute' | 'next' | 'undo'| 'fast_forward'| 'reset'| 'delete'| 'check';
    timestamp: Date;
    action_result: 'success' | 'failure';
}