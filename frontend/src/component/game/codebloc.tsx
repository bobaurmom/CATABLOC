import React, { useState } from 'react';
import '../../style/codebloc.css';
import DropZone from './dropZone';


export type BlockType = 'while' | 'if' | 'else' | 'action'| 'repeat';

export interface CodeBlock {
  id: string;
  type: BlockType;
  condition?: string;
  label?: string;
  nestedBlocks?: CodeBlock[]; 
}
interface CodeBlockProps {
  block: CodeBlock;
  isUserBlock?: boolean;
  onBlockClick?: (id: string) => void;
}
const CONDITION_OPTIONS = {
  repeat: ['1 time', '2 times', '3 times', '4 times', '5 times', '10 times'],
  while: ['front_is_clear', 'on_grass_tile', 'at_mouse'],
  if: ['front_is_clear', 'on_grass_tile', 'at_mouse'],
};
let idCounter: number = 0;
const CodeBloc: React.FC<CodeBlockProps> = ({ block, isUserBlock, onBlockClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nestedBlocks, setNestedBlocks] = useState<CodeBlock[]>(block.nestedBlocks || []);
  const handleSelect = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    block.condition = option; 
    setIsMenuOpen(false);     
  };
  const generateDropZoneId = () => {
    return `dropZone-${idCounter++}`;
  }
  const isContainer = ['while', 'if', 'else', 'repeat'].includes(block.type);
  const options = CONDITION_OPTIONS[block.type as keyof typeof CONDITION_OPTIONS] || [];

  return (
    <div className={`block-node ${block.type}`} onClick={(e) => {
      e.stopPropagation(); 
      onBlockClick?.(block.id);
    }}>
      <div className="block-control">
        <span className="keyword">{block.type}</span>
        
            {block.condition && (
          <div className="condition-box"
          onClick={(e) => {
              e.stopPropagation(); // Prevent selecting the whole block
              setIsMenuOpen(!isMenuOpen); // Toggle the menu
            }}> 
            {block.condition}
            <span className="chevron">▾</span>
            {isMenuOpen && (
              <div className="dropdown-menu">
              {options.map((opt) => (
                <div 
                  key={opt} 
                  className="dropdown-item" 
                  onClick={(e) => handleSelect(opt, e)}
                >
                  {opt}
                </div>
              ))}
              </div>
            )}
          </div>
        )}
        {block.label && <span className="label-text">{block.label}</span>}
      </div>

      {isContainer && (
        <div className="block-children-area">
          <div className="indent-guide" />
          {isUserBlock ? (
            <DropZone id={generateDropZoneId()}>
              {block.nestedBlocks && block.nestedBlocks.length > 0 ? (
                block.nestedBlocks.map((child) => (
                  <CodeBloc key={child.id} block={child} isUserBlock={isUserBlock} onBlockClick={onBlockClick} />
                ))
              ) : (
                <div className="empty-placeholder">drop blocks here</div>
              )}
            </DropZone>
          ) : (
            <div className="nested-blocks-container">
              <div className="empty-placeholder">drop blocks here</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeBloc;