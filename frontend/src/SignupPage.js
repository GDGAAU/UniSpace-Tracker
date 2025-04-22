import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './SignupPage.css';
import './styles.css'; // Import index.css
import Bubbles from './Bubbles.js';

function SignupPage() {
  //const navigate = useNavigate();
  return (
    <div className='signup-container1'>
      <Bubbles /> {/* Use the Bubbles component here */}
      <h1>UNISPACE</h1>
      <div className='signup-container'>
        <div className='signup-form'>
          <form >
            <label className='signup-username'>Username</label>
            <input type="text" />
            <label className='signup-email'>Email</label>
            <input type="email" />
            <label className='signup-password'>Password</label>
            <input type="password" />
            <button className='buttons'>Signup</button>
            <p>
              Already have an account?{' '}
              <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}


export default SignupPage;
