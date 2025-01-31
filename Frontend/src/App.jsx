import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route ,useLocation } from 'react-router-dom';
import HomePage from './pages/home/layout';
import Loader from './pages/loader/layout';
import Navbar from './pages/navbar/layout';
import AuthRegister from './pages/auth/register';
import AuthLogin from './pages/auth/login';
import AddBooks from './pages/addbooks/layout';

const App = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);

  const shouldShowNavbar = !['/auth/login', '/auth/register'].includes(location.pathname);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
    {shouldShowNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/register" element={<AuthRegister/>} />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/add-books" element={<AddBooks />} />
          </Routes>
        </>
      )}
    </>
  );
};



export default App;