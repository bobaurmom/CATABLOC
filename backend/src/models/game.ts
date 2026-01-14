interface game {
    game_id: number;
    title: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
}

interface codeblock{
    codeblock_id: number;
    block_command: 'forward' | 'backward' | 'turn_left' | 'turn_right';   
    block_type: 'movement' | 'loop' | 'while' | 'condition';
    created_at?: Date;
    updated_at?: Date;
}

interface action{
    action_id: number;
    session_id: number;
    codeblock_id: number;
    current_step: number;
    action_type: 'execute' | 'next' | 'undo'| 'fast_forward'| 'reset'| 'delete'| 'check';
    timestamp: Date;
    action_result: 'success' | 'failure';
}

interface userSolution{
    solution_id: number;
    session_id: number;
    code_sequence: string; // JSON string representing the sequence of codeblocks used
    submitted_at: Date;
    is_correct: boolean;
}
