import { useDroppable } from "@dnd-kit/core";
const DropZone = (prop: { id: string; children: React.ReactNode; className?: string }) => {
    const { isOver, setNodeRef} = useDroppable({
      id: prop.id});
    const style: React.CSSProperties = {
      backgroundColor: isOver ? 'lightgreen' : '#f0f0f0',
      border: '2px dashed #ccc',
      borderColor: isOver ? '#4caf50' : '#ccc',
      padding: '20px',
      minHeight: '100%',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
    };
    return (
        <div ref={setNodeRef} style={style} className={prop.className}>{prop.children}</div>
    )
}   
export default DropZone;