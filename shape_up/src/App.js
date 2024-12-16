import logo from './logo.svg';
import './App.css';
import Layout from './Pages/Layout/Layout';
import Main from './Pages/Main/Main';
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import React, { useState, useEffect, createContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContext } from "./context";

const parseJwt = (token) => {
  try {
    if (!token) throw new Error('Token is null or undefined');
    const payload = token.split('.')[1];
    if (!payload) throw new Error('Invalid token format');
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error('Error parsing token:', e.message);
    return null;
  }
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,

    children: [
      { index: true, element: <Main /> },

      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
]);

const App = () => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8885/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        const tokenData = parseJwt(data.token);
        if (tokenData && tokenData.username) {
          setUser({ name: tokenData.username });
          localStorage.setItem('token', data.token);
        } else {
          console.error('Invalid token data:', tokenData);
        }
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: error.message };
    }
  };

  const register = async (userDetails) => {
    try {
      const response = await fetch('http://localhost:8885/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        console.error('Registration failed');
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => { 
    setUser(null);
    localStorage.removeItem('token');
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      
      const tokenData = parseJwt(storedToken);

      const isExpired = tokenData.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('token');
        return;
      }

      if (tokenData && tokenData.username) {
        setUser({ name: tokenData.username });
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, login, register, logout }}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
};

export default App;

