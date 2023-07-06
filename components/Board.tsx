'use client';

import { useBoardStore } from '@/store/boardStore';
import { useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Column from './Column';

function Board() {
  const { board, getBoard, setBoardState, updateTodoInDB } = useBoardStore(
    (state) => state
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, type, source } = result;

    if (!destination) return;

    // --------------------------------

    if (type === 'column') {
      const entries = Array.from(board.columns.entries());
      const movedColumn = entries.splice(source.index, 1)[0];
      entries.splice(destination.index, 0, movedColumn);
      setBoardState({
        ...board,
        columns: new Map(entries),
      });
    }

    // --------------------------------

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination.droppableId)];

    // --------------------------------

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    };

    // --------------------------------

    if (!startCol || !endCol) return;
    if (source.index === destination.index && startCol === endCol) return;

    // --------------------------------

    const newTodos = startCol.todos;
    const [movedTodo] = newTodos.splice(source.index, 1);

    // --------------------------------

    if (startCol.id === endCol.id) {
      newTodos.splice(destination.index, 0, movedTodo);

      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = board.columns.set(startCol.id, newCol);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      const finishTodos = endCol.todos;
      finishTodos.splice(destination.index, 0, movedTodo);
      const newColumns = board.columns;
      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: finishTodos,
      });
      updateTodoInDB(movedTodo, endCol.id);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    }
  };
  // console.log(
  //   'just something',
  //   Array.from(board.columns.entries()).map(([id, column]) =>
  //     console.log(id, column)
  //   )
  // );

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provider) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provider.droppableProps}
            ref={provider.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} index={index} todos={column.todos} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;

// type CartItem = {
//   id: number;
//   qty: number;
// };

// const cartItems: CartItem[] = [
//   { id: 1, qty: 0 },
//   { id: 2, qty: 0 },
//   { id: 3, qty: 0 },
// ];

// const cartQty = cartItems.reduce((qty, item) => item.qty + qty, 0);
