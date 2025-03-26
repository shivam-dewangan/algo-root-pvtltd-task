const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    status: { 
        type: String, 
        default: "Incomplete" 
    }
});

// Middleware to update `status` based on `completed`
TaskSchema.pre("save", function (next) {
    this.status = this.completed ? "Complete" : "Incomplete";
    next();
});

// Middleware to update `status` when updating a document
TaskSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.completed !== undefined) {
        update.status = update.completed ? "Complete" : "Incomplete";
    }
    next();
});

module.exports = mongoose.model("Task", TaskSchema);
