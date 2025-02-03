import { configureStore } from '@reduxjs/toolkit';
import authreducer from './auth-slice'
import todoReducer from './todo-slice'
const store = configureStore({
  reducer: {
auth: authreducer,
todo: todoReducer
  },
});

export default store;
