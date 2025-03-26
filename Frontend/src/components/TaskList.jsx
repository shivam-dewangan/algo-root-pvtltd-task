import React, { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../api";
import "../components/Task.css"; // Import CSS

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTask, setEditTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const { data } = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            await updateTask(task._id, updatedTask);
            setTasks(tasks.map(t => (t._id === task._id ? updatedTask : t)));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleEdit = (task) => {
        setEditTask(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
    };

    const handleUpdate = async () => {
        if (!editTitle.trim()) return alert("Title is required!");

        try {
            const updatedTask = { title: editTitle, description: editDescription };
            await updateTask(editTask, updatedTask);
            setTasks(tasks.map(t => (t._id === editTask ? { ...t, ...updatedTask } : t)));
            setEditTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="task-list">
            <h2>Task List</h2>
            {loading ? (
                <p className="loading">Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="empty-message">No tasks available. Add a new task!</p>
            ) : (
                tasks.map(task => (
                    <div key={task._id} className="task-item">
                        {/* ✅ Checkbox to mark complete/incomplete */}
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => handleToggleComplete(task)} 
                        />
                        
                        {/* 🔄 Show Edit Form or Task Title */}
                        {editTask === task._id ? (
                            <div className="edit-mode">
                                <input 
                                    type="text" 
                                    value={editTitle} 
                                    onChange={(e) => setEditTitle(e.target.value)} 
                                    required
                                    placeholder="Task Title"
                                />
                                <input 
                                    type="text" 
                                    value={editDescription} 
                                    onChange={(e) => setEditDescription(e.target.value)} 
                                    placeholder="Task Description (optional)"
                                />
                                <button className="save-btn" onClick={handleUpdate}>Save</button>
                                <button className="cancel-btn" onClick={() => setEditTask(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="task-details">
                                <span className={task.completed ? "completed" : ""}>
                                    {task.title} {task.description && `- ${task.description}`}
                                </span>

                                {/* ✏️ Edit Button */}
                                <button className="edit-btn" onClick={() => handleEdit(task)}>
                                    Edit
                                </button>

                                {/* ❌ Delete Button */}
                                <button className="delete-btn" onClick={() => handleDelete(task._id)}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default TaskList;
