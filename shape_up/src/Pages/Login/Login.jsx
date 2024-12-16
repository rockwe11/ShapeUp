import React, { useState, useContext } from 'react';
import { AppContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Login = () => {
    const { login } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        try {
            const result = await login({ email, password });
            if (result.success) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 2000); // Переход на главную страницу через 2 секунды
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Login successful! Redirecting...</p>}
            </form>
        </div>
    );
};

export default Login;