export interface CodeBlockData {
    codeblock_id: number;
    block_command: 'move_forward' | 'move_backward' | 'turn_left' | 'turn_right';
    block_type: 'movement' | 'repeat' | 'while' | 'condition' | 'procedure';
}