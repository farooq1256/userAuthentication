import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route ,useLocation } from 'react-router-dom';
import HomePage from './pages/home/layout';
import Loader from './pages/loader/layout';
import Navbar from './pages/navbar/layout';
import AuthRegister from './pages/auth/register';
import AuthLogin from './pages/auth/login';
import AddBooks from './pages/addbooks/layout';
import PageNotFound from './pages/not-found/layout';
import { checkAuth } from './store/auth-slice'
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(checkAuth());
  }, [dispatch]);

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
            <Route path="/" element={<HomePage/>} />
            <Route path="/auth/register" element={<AuthRegister/>} />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/add-books" element={<AddBooks />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </>
      )}
    </>
  );
};



export default App;