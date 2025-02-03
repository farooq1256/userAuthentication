import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createTodo, getTodos, updateTodo, deleteTodo } from '../../store/todo-slice';
import { useToast } from "@/hooks/use-toast";

const Layout = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { todos = [], isLoading = false, error = null } = useSelector(
    (state) => state.todo || {}
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await dispatch(getTodos()).unwrap();
        if (!result.success) {
          toast({
            variant: "destructive",
            title: "Failed to fetch todos"
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: error?.message || "Error fetching todos"
        });
      }
    };

    fetchTodos();
  }, [dispatch, toast]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const result = await dispatch(updateTodo({
          todoId: editingId,  // Changed from id to todoId
          updateData: formData // Added updateData structure
        })).unwrap();
        if (result?.success) {
          toast({ title: result?.message || "Todo updated successfully!" });
        }
        setEditingId(null);
      } else {
        const result = await dispatch(createTodo(formData)).unwrap();
        if (result?.success) {
          toast({ title: result?.message || "Todo created successfully!" });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message || "An error occurred while processing the todo."
      });
    }
    setFormData({ title: '', description: '', status: 'pending' });
  };

  const handleEdit = (todo) => {

    setEditingId(todo._id);
    setFormData({ title: todo.title, description: todo.description, status: todo.status });
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteTodo(id)).unwrap();
      if (result?.success) {
        toast({ title: "Todo deleted successfully!" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message || "Failed to delete todo."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingId ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td className="px-6 py-4 whitespace-nowrap">{todo.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{todo.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">  {todo.updatedAt ?
                  new Date(todo.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })
                  :
                  new Date(todo.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })
                }</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={todo.status}
                    onChange={async (e) => {
                      try {
                        const result = await dispatch(updateTodo({
                          todoId: todo._id,
                          updateData: { ...todo, status: e.target.value }
                        })).unwrap();

                        if (result?.success) {
                          toast({ title: "Status updated successfully!" });
                        }
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: error?.message || "Failed to update status"
                        });
                      }
                    }}
                    className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Layout;