import type { CodeBlock } from '../../../type/gameType';
const organizeBlocks = (blocks: CodeBlock[]): any[] => {
  let organizeArray: any = [];
  for(const block of blocks) {
    if(block.type === "action"){
      organizeArray.push(block.label);
    } else if(block.type === "if") {
      let ifBlocks = {type: "if", condition: block.condition, nested: organizeBlocks(block.nestedBlocks || [])};
      organizeArray.push(ifBlocks);
    } else if(block.type === "while") {
      let whileBlocks = {type: "while", condition: block.condition, nested: organizeBlocks(block.nestedBlocks || [])};
      organizeArray.push(whileBlocks);
    } else if(block.type === "repeat") {
      let repeatBlocks = {type: "repeat", repeat: block.condition, nested: organizeBlocks(block.nestedBlocks || [])};
      organizeArray.push(repeatBlocks);
    }
  }
  return organizeArray;
}
export default organizeBlocks;