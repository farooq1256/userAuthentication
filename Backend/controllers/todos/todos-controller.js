import Todo from '../../models/todo.js';
import createHttpError from 'http-errors';

// Create Todo Controller
const createTodo = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        if (!title || !description) {
            return next(createHttpError(400, 'Title and description are required.'));
        }
 // Add console.log to debug the data
//  console.log('Request body:', req.body);
//  console.log('User ID:', userId);
        const todo = await Todo.create({
            title,
            description,
            user: userId
        });

//  console.log('Created todo:', todo);
        res.status(201).json({
            success: true,
            message: 'Todo created successfully.',
            todo
        });
    } catch (error) {
        console.error('Create todo error:', error);
        next(createHttpError(500, 'An error occurred while creating todo.'));
    }
};

// Get Todos Controller
const getTodo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            todos
        });
    } catch (error) {
        console.error('Get todos error:', error);
        next(createHttpError(500, 'An error occurred while fetching todos.'));
    }
};

// Update Todo Controller
const updateTodo = async (req, res, next) => {
    try {
        const { todoId } = req.params;
        const { title, description, status } = req.body;
        const userId = req.user.id;

        const todo = await Todo.findOne({ _id: todoId, user: userId });

        if (!todo) {
            return next(createHttpError(404, 'Todo not found.'));
        }

        if (title) todo.title = title;
        if (description) todo.description = description;
        if (status) todo.status = status;

        await todo.save();

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully.',
            todo
        });
    } catch (error) {
        console.error('Update todo error:', error);
        next(createHttpError(500, 'An error occurred while updating todo.'));
    }
};

// Delete Todo Controller
const deleteTodo = async (req, res, next) => {
    try {
        const { todoId } = req.params;
        const userId = req.user.id;

        const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

        if (!todo) {
            return next(createHttpError(404, 'Todo not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully.'
        });
    } catch (error) {
        console.error('Delete todo error:', error);
        next(createHttpError(500, 'An error occurred while deleting todo.'));
    }
};

export { createTodo, getTodo, updateTodo, deleteTodo };
