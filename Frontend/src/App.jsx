import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/home/layout';
import Loader from './pages/loader/layout';
import Navbar from './pages/navbar/layout';
import AuthRegister from './pages/auth/register';
import AuthLogin from './pages/auth/login';
import PageNotFound from './pages/not-found/layout';
import { checkAuth } from './store/auth-slice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(checkAuth())
        .then(() => setIsAuthenticated(true))
        .catch((error) => {
          console.error("Auth check failed:", error);
          setIsAuthenticated(false);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Define routes where Navbar should not appear
  const hideNavbarRoutes = ['/', '/auth/register'];
  const isNotFoundPage = location.pathname !== '/home' &&
    !hideNavbarRoutes.includes(location.pathname);

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname) && !isNotFoundPage;

  return (
    <>
    {loading && <Loader />}
    {!loading && (
      <>
        {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthLogin />}
          />
          <Route
            path="/auth/register"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthRegister />}
          />
          <Route path="/home" element={<HomePage/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </>
    )}
  </>
  );
};

export default App;
