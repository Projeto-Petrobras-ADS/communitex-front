import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import PetrobrasLogo from '../../assets/logo/logo.png';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('user', JSON.stringify({ username }));
            navigate('/');
        } else {
            setError('Usuário ou senha inválidos');
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <img src={PetrobrasLogo} alt="Logo Petrobras" className="login-logo" />
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Usuário</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="login-btn">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;
