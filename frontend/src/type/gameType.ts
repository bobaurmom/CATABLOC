export interface CodeBlockData {
    codeblock_id: number;
    block_command: 'move_forward' | 'move_backward' | 'turn_left' | 'turn_right';
    block_type: 'movement' | 'repeat' | 'while' | 'condition' | 'procedure';
}
export interface Position {
    x: number;
    y: number;
}
export type BlockType = 'while' | 'if' | 'else' | 'action'| 'repeat';
export interface CodeBlock {
  id: string;
  type: BlockType;
  condition?: string;
  label?: string;
  nestedBlocks?: CodeBlock[];
  classList?: string; 
  parentId?: string;
}