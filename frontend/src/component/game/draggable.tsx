import { useDraggable } from "@dnd-kit/core";

const Draggable = (prop: { id: string; children: React.ReactNode; data?: any}) => {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
      id: prop.id,
      data: prop.data
    });

    const handleMouseDown = (e: React.MouseEvent) => {

        // Allow clicks on elements with class 'condition-box' to pass through without starting drag
        const target = e.target as HTMLElement;
        if (!target.closest('.condition-box')) {
            listeners?.onPointerDown?.(e as any);
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            {...attributes}
            onPointerDown={handleMouseDown}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                opacity: isDragging ? 0.5 : 1,
                padding: '10px',
                backgroundColor: '#fff',
                border: '1px solid #000',
                borderRadius: '4px',
                width: 'fit-content',
                maxWidth: '100%',
                height: 'fit-content',
                boxSizing: 'border-box',
                pointerEvents: isDragging ? 'none' : 'auto',
            }}
        >
            {prop.children}
        </div>
    )
}
export default Draggable;