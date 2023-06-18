import { useBoardStore } from '@/store/boardStore';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';

// -------------------------------------------------

interface ColumnProps {
  id: TypedColumn;
  index: number;
  todos: Todo[];
}

// -------------------------------------------------

const idToColumnText: {
  [Key in TypedColumn]: string;
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

// -------------------------------------------------

function Column({ id, index, todos }: ColumnProps) {
  const { searchString } = useBoardStore((state) => state);
  // if searchString is empty or undefined then return all todos else return todos that only includes the search string
  const filteredTodos = todos.filter(
    (todo) =>
      !searchString ||
      todo.title.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <Draggable draggableId={id} index={index}>
      {(provider) => (
        <div
          ref={provider.innerRef}
          {...provider.dragHandleProps}
          {...provider.draggableProps}
        >
          <Droppable droppableId={index.toString()} type='card'>
            {(provider, snapshot) => (
              <div
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                }`}
                {...provider.droppableProps}
                ref={provider.innerRef}
              >
                <h2 className='flex justify-between font-bold text-xl mb-2'>
                  {idToColumnText[id]}
                  <span className='text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal'>
                    {filteredTodos.length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {filteredTodos.map((todo, index) => (
                    <Draggable
                      draggableId={todo.$id}
                      key={todo.$id}
                      index={index}
                    >
                      {(provider) => (
                        <TodoCard
                          todo={todo}
                          // imgUrl={todo.image?.bucketId}
                          index={index}
                          id={id}
                          innerRef={provider.innerRef}
                          draggableProps={provider.draggableProps}
                          dragHandleProps={provider.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provider.placeholder}
                  <div className='flex items-end justify-end p-2'>
                    <button className='text-green-500 hover:text-green-600'>
                      <PlusCircleIcon className='h-10 w-10' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
