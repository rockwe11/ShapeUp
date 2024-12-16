import React, { useState, useContext } from 'react';
import { AppContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Register = () => {
    const { register } = useContext(AppContext);
    const [name, setName] = useState('');
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
            const result = await register({ name, email, password });
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
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <button type="submit">Register</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Account created successfully! Redirecting...</p>}
            </form>
        </div>
    );
};

export default Register;
