import path from "node:path";
import { fileURLToPath } from "node:url"; // Import fileURLToPath
import express from "express";
import { createBook } from "./bookController.js";
import multer from "multer";

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookRouter = express.Router();

// File storage configuration
const upload = multer({
  dest: path.resolve(__dirname, "../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30MB limit
});

// Routes
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;