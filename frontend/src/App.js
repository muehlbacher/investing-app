import React from "react";
import TodoApp from "./components/TodoApp";
import { Container } from "reactstrap";

function App() {
  return (
    <Container>
      <h1 className="text-center mt-4">My Todo App</h1>
      <TodoApp />
    </Container>
  );
}

export default App;
