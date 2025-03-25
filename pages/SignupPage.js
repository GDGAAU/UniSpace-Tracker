import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.css';
import '../styles/styles.css'; // Import index.css

function SignupPage() {
  //const navigate = useNavigate();
  return (
    <div className='container'>
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
            <button>Signup</button>
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
