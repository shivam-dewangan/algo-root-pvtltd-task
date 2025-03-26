import React, { useState } from "react";
import { createTask } from "../api";
import "../components/Task.css"; // Import CSS

function TaskForm({ reload }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setMessage("Title is required!");
            return;
        }

        try {
            await createTask({ title, description });
            setTitle("");
            setDescription("");
            setMessage("✅ Task added successfully!");
            reload(); // Refresh the task list
        } catch (error) {
            setMessage("❌ Error adding task.");
            console.error("Error:", error);
        }

        setTimeout(() => setMessage(""), 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input 
                type="text" 
                placeholder="Enter task title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Enter task description (optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
            />
            <button type="submit">Add Task</button>

            {/* Success/Error Message */}
            {message && <p className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>}
        </form>
    );
}

export default TaskForm;
