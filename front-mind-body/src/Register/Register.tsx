import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "../Register/Register.css"

function Register() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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
      await authContext.register({username, email, password});
      navigate('/dashboard');
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className='mainRegisterDiv'>
        <div className="registerTop">
            <h1 className='registerText'>Register your account</h1>
            <h3 className='registerSub'>Sign up to continue</h3>
        </div>
      
      <form className="registerForm" onSubmit={handleSubmit}>
        <div className='formField'>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
            placeholder='Enter Username'
          />
        </div>

        <div className='formField'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder='abcde123@gmail.com'
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
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className='alreadyReg'>
          Already registered? <a href="/login">Login here</a>
        </div>
      </form>
    </div>
  );
}

export default Register;