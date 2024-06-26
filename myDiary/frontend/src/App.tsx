import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import TodoItem from "./components/TodoItem";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

export type TodoData = {
  id?: string; //?用法
  date: string;
  tag: string;
  mood: string;
  description: string;
};

function App() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [todoDate, setTodoDate] = useState(getDay());
  const [todoTag, setTodoTag] = useState("Academic");
  const [todoMood, setTodoMood] = useState("Happiness");
  const [todoDescription, setTodoDescription] = useState("");
  const [todoFilterTag, setTodoFilterTag] = useState("All");
  const [todoFilterMood, setTodoFilterMood] = useState("All");
  const [origin, setOrigin] = useState<TodoData[]>([]);

  // 得到今天日期
  function getDay(){
    const tmpDate = new Date();
    const year = tmpDate.getFullYear();
    const month = String(tmpDate.getMonth() + 1).padStart(2,"0");
    const day = String(tmpDate.getDate()).padStart(2,"0");
    return `${year}-${month}-${day}`
  }

  // 讀取
  async function init() {
    const todos = await getTodos();
    setOrigin(todos);
    setTodos(todos);
  }

  // 新增
  const addTodo = async() => {
    if (todoDescription === "") {
      alert("Please enter a description for your todo.");
      return;
    }
    const queryReq = { id: uuidv4(), date: todoDate, tag: todoTag, mood: todoMood, description: todoDescription };
    //console.log(queryReq);
    await createTodo(queryReq);
    init(); //重新getAllData
    setTodoDescription("");
    setTodoFilterTag("All");
    setTodoFilterMood("All");
  };
 
  // 刪除
  const deleteTodo = async(id: string) => {
    await deleteTodoById(id)
    init();
    setTodoFilterTag("All");
    setTodoFilterMood("All");
  };

  // 更新
  const completeTodo = async(id: string, todo:TodoData) => {
    await updateTodoStatus(id, todo); 
    init();
  };

  useEffect(() => {
    init();
  }, []);

  // 4APIs(CRUD) to backend
  async function getTodos() {
    const response = await instance.get("/todos");
    return response.data;
  }

  async function createTodo(todo:TodoData) {
    const response = await instance.post("/todos", todo);
    return response.data;
  }

  async function deleteTodoById(id:string) {
    const response = await instance.delete(`/todos/${id}`);
    return response.data;
  }
  
  async function updateTodoStatus(id:string, todo:TodoData) {
    const response = await instance.put(`/todos/${id}`, todo);
    return response.data;
  }

  return (
    <>
      <h1>My Diary</h1>
      <div id="todo-input-container">
        <input id="date" type="date" value={todoDate}
          onChange={(e) => setTodoDate(e.target.value)}
        />
        <select className="form-select" aria-label="Default select example"
          value={todoTag} onChange={(e) => setTodoTag(e.target.value)}>
        <option defaultValue="Academic">Academic</option>
        <option value="Interpersonal">Interpersonal</option>
        <option value="Club">Club</option>
        </select>
        <select className="form-select" aria-label="Default select example"
          value={todoMood} onChange={(e) => setTodoMood(e.target.value)}>
        <option defaultValue="Happiness">Happiness</option>
        <option value="Anger">Anger</option>
        <option value="Sadness">Sadness</option>
        </select>
        <button id="todo-add" tabIndex={3} onClick={addTodo}>
          add
        </button>
      </div>
      <textarea
        id="todo-description-input"
        placeholder="description"
        tabIndex={2}
        value={todoDescription}
        onChange={(e) => setTodoDescription(e.target.value)}
      ></textarea>
      <div className="filterWrapper">
        <p>Tag Filter </p>
        <select className="form-select" aria-label="Default select example"
          value={todoFilterTag} onChange={async(e) => {
              setTodoFilterTag(e.target.value)
              let tmp:TodoData[] = origin; 
              if(e.target.value !== "All")tmp = tmp.filter((todo) => todo.tag == e.target.value)
              if(e.target.value == 'All')tmp = origin;
              if(todoFilterMood !== "All")tmp = tmp.filter((todo) => todo.mood == todoFilterMood)
              setTodos(tmp);
            }
          }>
        <option defaultValue="All">All</option>
        <option value="Academic">Academic</option>
        <option value="Interpersonal">Interpersonal</option>
        <option value="Club">Club</option>
        </select>
        <p>Mood Filter </p>
        <select className="form-select" aria-label="Default select example"
          value={todoFilterMood} onChange={async(e) => {
            setTodoFilterMood(e.target.value)
            let tmp:TodoData[] = origin; 
            if(e.target.value !== "All")tmp = tmp.filter((todo) => todo.mood == e.target.value)
            if(e.target.value == 'All')tmp = origin;
            if(todoFilterTag !== "All")tmp = tmp.filter((todo) => todo.tag == todoFilterTag)
            setTodos(tmp);
          }
        }>
        <option defaultValue="All">All</option>
        <option value="Happiness">Happiness</option>
        <option value="Anger">Anger</option>
        <option value="Sadness">Sadness</option>
        </select>
      </div>
      <section id="todos">
        { 
          todos.map((todo) => (
          <TodoItem
            key={todo.id}
            date={todo.date}
            tag={todo.tag}
            mood={todo.mood}
            description={todo.description}
            onComplete={(newTodo:TodoData) => 
              completeTodo(todo.id!, newTodo)}
            onDelete={() => deleteTodo(todo.id!)}
          />
          ))
        }
      </section>
    </>
  );
}

export default App;
