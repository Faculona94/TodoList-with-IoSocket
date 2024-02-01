const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  done: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
  dueDate: { type: Date, default: null },
});

module.exports = mongoose.model("Task", taskSchema);
