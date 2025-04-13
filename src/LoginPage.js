import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import './styles.css'; // Import index.css
import Bubbles from './Bubbles.js';

function LoginPage() {
  //const navigate = useNavigate();
  return (
    <div className='login-container1'>
      <Bubbles /> {/* Use the Bubbles component here */}
      <h1>UNISPACE</h1>
      <div className='login-container'>
        <div className='login-form'>
          <form >
            <label className='login-email'>Username or Email</label>
            <input type="text" />
            <label className='login-password'>Password</label>
            <input type="password" />
            <button className='buttons'><Link to="/home">Login</Link></button>
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
