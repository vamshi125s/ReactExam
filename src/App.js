import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [showMfa, setShowMfa] = useState(false);

    const handleRegister = async () => {
        if (password !== reenterPassword) {
            setError("Passwords are not same");
            return;
        }
        try {
            await axios.post('http://localhost:5000/register', {
                username,
                password
            });
            setShowLogin(true);
            setUsername('');
            setPassword('');
            setReenterPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            if (response.data.requiresMfa) {
                setShowMfa(true);
            } else {
                setLoggedIn(true);
            }
            setPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleMfa = async () => {
        try {
            const response = await axios.post('http://localhost:5000/mfa', {
                username,
                mfaCode
            });
            if (response.data.success) {
                setLoggedIn(true);
                setShowMfa(false);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleShowLogin = () => {
        setShowLogin(true);
        setError(null);
        setUsername('');
        setPassword('');
        setReenterPassword('');
    };

    const handleShowRegister = () => {
        setShowLogin(false);
        setError(null);
        setUsername('');
        setPassword('');
        setReenterPassword('');
    };

    return (
        <div className="container">
            <h1>Multi-Factor Authentication</h1>
            {showLogin ? (
                <div>
                    <h2>Login</h2>
                    <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
                    <br />
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                    <br />
                    <button onClick={handleLogin}>Login</button>
                    <p>Register here <span onClick={handleShowRegister} style={{ cursor: 'pointer', color: 'blue' }}>Register here</span></p>
                    {showMfa ? (
                        <div>
                            <h2>Enter MFA Code</h2>
                            <input type="text" value={mfaCode} onChange={(event) => setMfaCode(event.target.value)} placeholder="MFA Code" />
                            <br />
                            <button onClick={handleMfa}>Verify MFA</button>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div>
                    <h2>Register</h2>
                    <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
                    <br />
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                    <br />
                    <input type="password" value={reenterPassword} onChange={(event) => setReenterPassword(event.target.value)} placeholder="Re-enter Password" />
                    <br />
                    <button onClick={handleRegister}>Register</button>
                    <p>Login here <span onClick={handleShowLogin} style={{ cursor: 'pointer', color: 'blue' }}>Login here</span></p>
                </div>
            )}
            {error && <p className="error">{error}</p>}
            {loggedIn && <p>You are now logged in!</p>}
        </div>
    );
}

export default App;
