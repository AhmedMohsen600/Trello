'use client';

import { XCircleIcon } from '@heroicons/react/24/solid';
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
  return (
    <div
      className='bg-white rounded-md space-y-2 drop-shadow-md'
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button className='text-red-500 hover:text-red-600'>
          <XCircleIcon className='ml-5 h-8 w-8' />
        </button>
      </div>
    </div>
  );
}

export default TodoCard;
