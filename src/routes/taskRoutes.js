const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const checkAuthenticated = require("../middleware/authMiddleware");

module.exports = (io) => {
  // Create Task
  router.post("/tasks", checkAuthenticated, async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
      io.emit("task-added", task);
      res.status(201).send(task);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  });

  // Read Tasks
  router.get("/tasks", checkAuthenticated, async (req, res) => {
    const tasks = await Task.find({});
    res.send(tasks);
  });

  // Update Task
  router.put("/tasks/:id", async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    io.emit("task-updated", task);
    res.send(task);
  });

  return router;
};
