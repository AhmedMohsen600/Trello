import { databases, storage, ID } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { uploadImage } from '@/lib/uploadImage';

import { create } from 'zustand';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

interface BoardState {
  board: Board;
  searchString: string;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getBoard: () => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  addTodo: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTodo: (todoIndex: number, todo: Todo, id: TypedColumn) => void;
  setBoardState: (board: Board) => void;
  setSearchString: (searchString: string) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: '',
  newTaskInput: '',
  newTaskType: 'todo',
  image: null,

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setSearchString: (searchString: string) => set({ searchString }),
  setNewTaskInput: (newTaskInput: string) => set({ newTaskInput }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  addTodo: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    const fileUploaded = image && (await uploadImage(image));
    const file = fileUploaded
      ? {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      : undefined;

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    set({ newTaskInput: '' });

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);
      // if there is not column create one and add the new todo inside it
      if (!column)
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      else newColumns.get(columnId)?.todos.push(newTodo);
      return {
        board: { columns: newColumns },
      };
    });
  },

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  deleteTodo: async (todoIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = get().board.columns;
    newColumns.get(id)?.todos.splice(todoIndex, 1);
    set({ board: { columns: newColumns } });
    if (todo.image)
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
}));

// if (image) {
//   const fileUploaded = await uploadImage(image);
//   if (fileUploaded) {
//     file = {
//       bucketId: fileUploaded.bucketId,
//       fileId: fileUploaded.$id,
//     };
//   }
// }
