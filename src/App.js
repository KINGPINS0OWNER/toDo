import { useEffect, useState } from 'react';

const api_base = 'http://localhost:3001';

function App() {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = () => {
        fetch(api_base + '/todos')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => setTodos(data))
            .catch((err) => console.error("Error: ", err));
    }

    const completeAndDeleteTodo = async id => {
        try {
            const response = await fetch(api_base + '/todo/complete/' + id);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Update the UI to mark the todo as complete
            setTodos(todos => todos.map(todo => {
                if (todo._id === data._id) {
                    todo.complete = data.complete;
                }
                return todo;
            }));

            // Now handle the deletion
            await deleteTodo(id);
        } catch (error) {
            console.error("Error completing and deleting todo: ", error);
            // Handle error here, display a message to the user, etc.
        }
    }


    const addTodo = async () => {
        try {
            const response = await fetch(api_base + "/todo/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: newTodo
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTodos([...todos, data]);
            setPopupActive(false);
            setNewTodo("");
        } catch (error) {
            console.error("Error adding todo: ", error);
            // Handle error here, display a message to the user, etc.
        }
    }

    const deleteTodo = async id => {
        try {
            const response = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const deletedTodoId = id; // Store the ID to be deleted
            setTodos(todos => todos.filter(todo => todo._id !== deletedTodoId));
        } catch (error) {
            console.error("Error deleting todo: ", error);
            // Handle error here, display a message to the user, etc.
        }
    }

    return (
        <div className="App">
            <h1>Welcome, Tyler</h1>
            <h4>Your tasks</h4>

            <div className="todos">
                {todos.length > 0 ? todos.map(todo => (
                    <div className={"todo" + (todo.complete ? " is-complete" : "")} onClick={() => completeAndDeleteTodo(todo._id)} key={todo._id}>
                        <div className="checkbox" ></div>
                        <div className="text">{todo.text}</div>
                    </div>
                )) : (
                    <p>You currently have no tasks</p>
                )}
            </div>

            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
                    <div className="content">
                        <h3>Add Task</h3>
                        <input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
                        <div className="button" onClick={addTodo}>Create Task</div>
                    </div>
                </div>
            ) : ''}
        </div>
    );
}

export default App;