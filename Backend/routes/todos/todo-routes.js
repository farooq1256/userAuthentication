import express from "express";
import { createTodo, getTodo, updateTodo, deleteTodo } from "../../controllers/todos/todos-controller.js";
import { authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

// Add authMiddleware to protect all todo routes
router.post("/create", authMiddleware, createTodo);
router.get("/get", authMiddleware, getTodo);
router.put("/update/:todoId", authMiddleware, updateTodo);  
router.delete("/delete/:todoId", authMiddleware, deleteTodo);

export default router;