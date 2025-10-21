import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "../Login/Login.css"

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!authContext) {
      setError('Authentication context not available');
      setLoading(false);
      return;
    }

    try {
      await authContext.login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleusernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className='mainRegisterDiv'>
        <div className="registerTop">
            <h1 className='registerText'>Log into your account</h1>
            <h3 className='registerSub'>Welcome Back! We are excited to see you again </h3>
        </div>
      
      <form className="registerForm" onSubmit={handleSubmit}>
        <div className='formField'>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={handleusernameChange}
            required
            placeholder='Enter username'
          />
        </div>

        <div className='formField'>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder='Enter Password'
          />
        </div>

        {error && <div className="errorMessage">{error}</div>}

        <button className="registerButton" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className='alreadyReg'>
          Don't have an account ? <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
}

export default Login;