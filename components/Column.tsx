import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';

// -------------------------------------------------

interface ColumnProps {
  id: TypedColumn;
  index: number;
  todos: Todo[];
}

const idToColumnText: {
  [Key in TypedColumn]: string;
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

function Column({ id, index, todos }: ColumnProps) {
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
                <h2 className='flex justify-between font-bold text-xl'>
                  {idToColumnText[id]}
                  <span className='text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal'>
                    {todos.length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {todos.map((todo, index) => (
                    <Draggable
                      draggableId={todo.$id}
                      key={todo.$id}
                      index={index}
                    >
                      {(provider) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provider.innerRef}
                          draggableProps={provider.draggableProps}
                          dragHandleProps={provider.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
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
