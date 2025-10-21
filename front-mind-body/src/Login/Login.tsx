import { useState } from 'react';
import "../Login/Login.css"

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ username, password });
    // TODO: Send to backend
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
            placeholder='Enter Username'
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

        <button className="registerButton" type="submit">Register</button>

        <div className='alreadyReg'>
          Don't have an account ? <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
}

export default Login;