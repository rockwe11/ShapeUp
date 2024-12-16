import React, { useContext } from "react";
import { AppContext } from "../../context.js";
import { Link, Outlet, useLocation } from 'react-router-dom';

import './style.css'
const Layout = () => {
    // const user = undefined
    // const logout = undefined
    const location = useLocation();
    const { user, logout } = useContext(AppContext);
    
    const isHomePage = location.pathname === "/";
    
    return (
    <div className="layout">
        <header className={`header ${isHomePage ? "header-transparent" : ""}`}>
        <div className="logo">
            <Link to="/">Shape Up</Link>
        </div>
        <nav className="nav">
        {user ? (
            <div className="user-info">
            <span>{user.name}</span>
            <button className="logout-button" onClick={logout}>
                Logout
            </button>
            </div>
        ) : (
            <div className="auth-buttons">
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
            </div>
        )}
        </nav>
        </header>
        <main className="main">
            <Outlet />
        </main>
        <footer className="footer">
            <p>&copy; 2024 Shape Up. All Rights Reserved.</p>
        </footer>
    </div>
    );
};

export default Layout;