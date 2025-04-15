import { useState, useEffect } from 'react'
import supabase from './supabaseClient'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editTodo, setEditTodo] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const fetchTodos = async () => {
    const { data } = await supabase.from('todos').select().order('id', { ascending: true })
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (!newTodo.trim()) return
    await supabase.from('todos').insert({ title: newTodo, is_complete: false })
    setNewTodo('')
    fetchTodos()
  }

  const toggleComplete = async (id, currentStatus) => {
    await supabase.from('todos').update({ is_complete: !currentStatus }).eq('id', id)
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await supabase.from('todos').delete().eq('id', id)
    fetchTodos()
  }

  const startEdit = (todo) => {
    setEditTodo(todo)
    setEditTitle(todo.title)
  }

  const saveEdit = async () => {
    if (!editTitle.trim()) return
    await supabase.from('todos').update({ title: editTitle }).eq('id', editTodo.id)
    setEditTodo(null)
    setEditTitle('')
    fetchTodos()
  }

  const cancelEdit = () => {
    setEditTodo(null)
    setEditTitle('')
  }

  return (
    <div className="app">
      <h1>📝 我的待辦清單</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="輸入新任務"
        />
        <button className="button-add" onClick={addTodo}>新增</button>
      </div>

      {editTodo && (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="編輯任務"
          />
          <button className="button-save" onClick={saveEdit}>儲存</button>
          <button className="button-cancel" onClick={cancelEdit}>取消</button>
        </div>
      )}

      <table className="todo-table">
        <thead>
          <tr>
            <th>完成</th>
            <th>任務</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo.id}>
              <td>
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleComplete(todo.id, todo.is_complete)}
                />
              </td>
              <td style={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}>
                {todo.title}
              </td>
              <td>
                <button className="button-edit" onClick={() =>  startEdit(todo)}>編輯</button>
                <button className="button-delete" onClick={() => deleteTodo(todo.id)}>刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
