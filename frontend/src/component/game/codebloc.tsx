import React, { useState } from 'react';
import DropZone from './Dropzone';
import Draggable from './Draggable';
import type { CodeBlock } from '../../type/gameType';

interface CodeBlockProps {
  block: CodeBlock;
  isUserBlock?: boolean;
  onBlockClick?: (id: string) => void;
}
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(style);

const CONDITION_OPTIONS = {
  repeat: ['1 time', '2 times', '3 times', '4 times', '5 times', '10 times'],
  while: ['front_is_clear', 'on_grass_tile', 'at_mouse'],
  if: ['front_is_clear', 'on_grass_tile', 'at_mouse'],
};
const generateDropZoneId = (parentId : string) => {
  return `dropZone-${parentId}`;
};

const CodeBloc: React.FC<CodeBlockProps> = ({ block, isUserBlock, onBlockClick}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSelect = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    block.condition = option; 
    setIsMenuOpen(false);     
  };
  const isContainer = ['while', 'if', 'else', 'repeat'].includes(block.type);
  const options = CONDITION_OPTIONS[block.type as keyof typeof CONDITION_OPTIONS] || [];

  return (
    <div className={`flex flex-col mt-1 w-fit min-w-[150px] ${block.type} ${block.classList || ''}`} onClick={(e) => {
      e.stopPropagation(); 
      onBlockClick?.(block.id);
    }}>
      <div className={`flex items-center gap-2 bg-white border border-[#e5e7eb] px-3 py-2 rounded-lg font-[Inter] font-semibold text-sm ${block.classList || ''}`}>
        <span className="text-[#058d37]">{block.type}</span>
        
            {block.condition && (
          <div className="relative inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-[12px] border-2 border-[#2ecc71] font-semibold transition-all duration-200"
          onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}> 
            {block.condition}
            <span>▾</span>
            {isMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 min-w-[120px] bg-white rounded-lg overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] border border-[#e0e0e0] z-[1000]" style={{ animation: 'fadeIn 0.1s ease-out' }}>
              {options.map((opt) => (
                <div 
                  key={opt} 
                  className="px-4 py-[10px] text-[#1bc02f] text-sm cursor-pointer transition-colors duration-200 hover:bg-[#f0fff4] hover:text-[#ae2795] hover:font-bold" 
                  onClick={(e) => handleSelect(opt, e)}
                >
                  {opt}
                </div>
              ))}
              </div>
            )}
          </div>
        )}
        {block.label && <span className="text-[#0c39dc]">{block.label}</span>}
      </div>

      {isContainer && (
        <div className="flex ml-[18px]">
          <div className="w-[2px] bg-[#f3f4f6] mr-[10px]" />
          {isUserBlock ? (
            <DropZone id={generateDropZoneId(block.id)} className='h-fit'>
              {block.nestedBlocks && block.nestedBlocks.length > 0 ? (
                block.nestedBlocks.map((child) => (
                  <Draggable key={child.id} id={child.id} data={{ type: child.type, label: child.label, condition: child.condition }}>
                    <CodeBloc block={child} isUserBlock={isUserBlock} onBlockClick={onBlockClick} />
                  </Draggable>
                ))
              ) : (
                <div className="text-xs text-[#d1d5db] italic p-1">drop blocks here</div>
              )}
            </DropZone>
          ) : (
            <div className="flex flex-col pt-1 gap-1 min-h-[20px]">
              <div className="text-xs text-[#d1d5db] italic p-1">drop blocks here</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeBloc;