import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';

// -------------------------------------------------------
interface TodoCardProps {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

function TodoCard({
  todo,
  index,
  innerRef,
  dragHandleProps,
  draggableProps,
}: TodoCardProps) {
  return <div>TodoCard</div>;
}

export default TodoCard;
