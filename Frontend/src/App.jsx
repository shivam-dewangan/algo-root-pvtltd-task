import React from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
    return (
        <div>
            <h1>Task Manager</h1>
            <TaskForm reload={() => window.location.reload()} />
            <TaskList />
        </div>
    );
}

export default App;
