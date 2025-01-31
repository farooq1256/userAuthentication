import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser} from "@/store/auth-slice"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

 
  const handleLogout = () => {
     // Logout Handler
  dispatch(logoutUser(formData)).then((data) => {
    if(data?.payload?.success){
      toast({
       title : data?.payload?.message
      })
     }else{
      toast({
        variant: "destructive",
        title : data?.payload?.message
       })
    }
    
    });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="text-white font-bold text-xl">Ebook Store</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { name: "Read Books", href: "/" },
              { name: "Add Books", href: "/add-books" },
              isAuthenticated
                ? { name: "Logout", href: "/", onClick: handleLogout }
                : { name: "LogIn", href: "/auth/login" },
            ].map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                <Link
                  to={item.href}
                  className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out"
                  onClick={item.onClick || undefined}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4 }}
          className="md:hidden bg-indigo-700"
        >
          {[
            { name: "Home", href: "/" },
            { name: "Dashboard", href: "/dashboard" },
            isAuthenticated
              ? { name: "Logout", href: "/", onClick: handleLogout }
              : { name: "Create Account", href: "/auth/register" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block text-white px-4 py-2 hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out"
              onClick={item.onClick || undefined}
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
