import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Classes from './class.jsx';
import LoginPage from './LoginPage.js';
import SignupPage from './SignupPage.js';
import SchedulePage from './SchedulePage.js';
import './index.css';

const App = () => {
    return (
        <Router>
            <div>
                {/* Define Routes for Each Page */}
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                     <Route path="/home" element={<Home />} /> 
                    <Route path="/class" element={<Classes />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;