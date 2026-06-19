import { useDroppable } from "@dnd-kit/core";
const WrapDropZone = (prop: { id: string; children: React.ReactNode}) => {
    const { isOver, setNodeRef} = useDroppable({
      id: prop.id});
    const style: React.CSSProperties = {
      backgroundColor: isOver ? 'lightgreen' : '#f0f0f0', 
      borderColor: isOver ? '#4caf50' : '#ccc',
      height: 'fit-content',
      width: 'fit-content',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
    };
    return (
        <div ref={setNodeRef} style={style}>{prop.children}</div>
    )
}   
export default WrapDropZone;