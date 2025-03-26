const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// ✅ GET all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error });
    }
});

// ✅ POST (Create a new task)
router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;

        // Validation
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newTask = new Task({ title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
});

// ✅ PUT (Update a task)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        // Find and update task
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
});

// ✅ DELETE (Remove a task)
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
});

module.exports = router;
