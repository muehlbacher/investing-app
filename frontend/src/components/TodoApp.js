import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
  Form,
} from "reactstrap";

const API_URL = "http://127.0.0.1:8000/api/todos/";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axios.get(API_URL).then((res) => setTodos(res.data));
  }, []);

  const addTodo = () => {
    if (!newTodo) return;
    axios.post(API_URL, { title: newTodo, description: newTodo, completed: false }).then((res) => {
      setTodos([...todos, res.data]);
      setNewTodo("");
    });
  };

  const toggleComplete = (todo) => {
    axios
      .patch(`${API_URL}${todo.id}/`, { completed: !todo.completed })
      .then((res) => {
        setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`${API_URL}${id}/`).then(() => {
      setTodos(todos.filter((t) => t.id !== id));
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Todo App</h2>
      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
        />
        <Button color="primary" onClick={addTodo} className="ms-2">
          Add
        </Button>
      </Form>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem
            key={todo.id}
            className="d-flex justify-content-between align-items-center"
          >
            <span
              onClick={() => toggleComplete(todo)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.title}
            </span>
            <Button color="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
              Delete
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  );
}

export default TodoApp;
