import type { CodeBlock } from '../../../type/gameType';
const clearAllBlockClasses = (blocks: CodeBlock[]) => {
  for(const block of blocks) {
    block.classList = "";
    if(block.nestedBlocks) {
      clearAllBlockClasses(block.nestedBlocks);
    }
  }
}
export default clearAllBlockClasses;