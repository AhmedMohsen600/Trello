import { getUrl } from '@/lib/getUrl';
import { useBoardStore } from '@/store/boardStore';
import { XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';

// -------------------------------------------------------

interface TodoCardProps {
  todo: Todo;
  imgUrl?: string;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

// -------------------------------------------------------

function TodoCard({
  todo,
  index,
  innerRef,
  id,
  dragHandleProps,
  draggableProps,
}: TodoCardProps) {
  const deleteTodo = useBoardStore((state) => state.deleteTodo);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------

  useEffect(() => {
    if (!todo.image) return;
    const fetchImage = async () => {
      try {
        setLoading(true);
        const url = await getUrl(todo.image!);
        setImageUrl(url.toString());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchImage();
  }, [todo, loading]);

  // ---------------------------------------

  if (loading) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <h2 style={{ color: 'red', fontSize: '16px', textAlign: 'center' }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div
      className='bg-white rounded-md space-y-2 drop-shadow-md'
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTodo(index, todo, id)}
          className='text-red-500 hover:text-red-600'
        >
          <XCircleIcon className='ml-5 h-8 w-8' />
        </button>
      </div>
      {imageUrl && (
        <div className='h-full w-full rounded-b-md'>
          <Image
            src={imageUrl}
            alt='Task image'
            width={400}
            height={200}
            className='w-full object-contain rounded-b-md'
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
