import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "@/components/path";
import { GlobalApiCall } from "../GlobalApiCall";
// Initial state
const initialState = {
  todos: [],
  isLoading: false,
  error: null,
};

// Create Todo
export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await GlobalApiCall(
        `${URL.baseURL}/todos/create`,
        'POST',
        todoData,
        null,
        null,
        "application/json", 
        true
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Todos
export const getTodos = createAsyncThunk(
    "todos/getTodos",
    async (_, { rejectWithValue }) => {
      try {
        const response = await GlobalApiCall(
          `${URL.baseURL}/todos/get`,
          'GET',
          {},
          null,
          null,
          "application/json",
          true
        );
        return response;
       
        
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Update Todo
export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ todoId, updateData }, { rejectWithValue }) => {
    console.log(todoId,updateData,'9999999');
    
    try {
      const response = await GlobalApiCall(
        `${URL.baseURL}/todos/update/${todoId}`,
        'PUT',
        updateData,
        null,
        null,
        "application/json",
        true
      );
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Todo
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (todoId, { rejectWithValue }) => {
    try {
      const response = await GlobalApiCall(
        `${URL.baseURL}/todos/delete/${todoId}`,
        'DELETE',
        {},
        null,
        null,
        "application/json",
        true
      );
      return { ...response.data, todoId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Todo Slice
const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Todo Cases
      .addCase(createTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.unshift(action.payload.todo);
        state.error = null;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Todos Cases
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload.todos;
        state.error = null;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Todo Cases
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTodo = action.payload.todo;
        const index = state.todos.findIndex(todo => todo._id === updatedTodo._id);
        if (index !== -1) {
          state.todos[index] = updatedTodo;
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Todo Cases
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = state.todos.filter(todo => todo._id !== action.payload.todoId);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default todoSlice.reducer;
