import React, { useState } from 'react';
import '../../style/codebloc.css';
import DropZone from './dropZone';
import Draggable from './draggable';
import type { CodeBlock } from '../../type/gameType';

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
const CodeBloc: React.FC<CodeBlockProps> = ({ block, isUserBlock, onBlockClick}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSelect = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    block.condition = option; 
    setIsMenuOpen(false);     
  };
  const generateDropZoneId = (parentId : string) => {
    return `dropZone-${parentId}`;
  }
  const isContainer = ['while', 'if', 'else', 'repeat'].includes(block.type);
  const options = CONDITION_OPTIONS[block.type as keyof typeof CONDITION_OPTIONS] || [];

  return (
    <div className={`block-node ${block.type} ${block.classList || ''}`} onClick={(e) => {
      e.stopPropagation(); 
      onBlockClick?.(block.id);
    }}>
      <div className={`block-control ${block.classList || ''}`}>
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
            <DropZone id={generateDropZoneId(block.id)}>
              {block.nestedBlocks && block.nestedBlocks.length > 0 ? (
                block.nestedBlocks.map((child) => (
                  <Draggable key={child.id} id={child.id} data={{ type: child.type, label: child.label, condition: child.condition }}>
                    <CodeBloc block={child} isUserBlock={isUserBlock} onBlockClick={onBlockClick} />
                  </Draggable>
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