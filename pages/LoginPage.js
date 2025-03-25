import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import '../styles/styles.css'; // Import index.css

function LoginPage() {
  //const navigate = useNavigate();
  return (
    <div className='container'>
      <h1>UNISPACE</h1>
      <div className='login-container'>
        <div className='login-form'>
          <form >
            <label className='login-email'>Username or Email</label>
            <input type="text" />
            <label className='login-password'>Password</label>
            <input type="password" />
            <button>Login</button>
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
