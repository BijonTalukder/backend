const express = require("express");
const categoryRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const CategoryService = require("../services/Category/CategoryService");
const CategoryController = require("../controllers/CategoryController");

const prisma = new PrismaClient();


const categoryService = new CategoryService(prisma);
const categoryController = new CategoryController(categoryService);

// Create a new category
categoryRouter.post("/", (req, res, next) => categoryController.createCategory(req, res, next));

// Get all categories
categoryRouter.get("/", (req, res, next) => categoryController.getAllCategories(req, res, next));

// Get a single category by ID
categoryRouter.get("/:id", (req, res, next) => categoryController.getSingleCategory(req, res, next));

// Update a category by ID
categoryRouter.put("/:id", (req, res, next) => categoryController.updateCategory(req, res, next));

// Delete a category by ID
categoryRouter.delete("/:id", (req, res, next) => categoryController.deleteCategory(req, res, next));

module.exports = categoryRouter;
