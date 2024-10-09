import React, { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { Todo } from '../types'

interface TodoListProps {
  todos: Todo[]
  toggleTodo: (id: number) => void
  editingId: number | null
  startEditing: (id: number) => void
  cancelEditing: () => void
  saveTodo: (id: number, newText: string) => void
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  toggleTodo,
  editingId,
  startEditing,
  cancelEditing,
  saveTodo,
}) => {
  const [editText, setEditText] = useState('')

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between bg-gray-50 p-2 rounded"
        >
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-grow mr-2 p-1 border rounded"
              />
              <div>
                <button
                  onClick={() => saveTodo(todo.id, editText)}
                  className="text-green-600 hover:text-green-800 mr-2"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2"
                />
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => {
                  startEditing(todo.id)
                  setEditText(todo.text)
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={18} />
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TodoList