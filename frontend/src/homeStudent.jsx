import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Bubbles from './Bubbles.js';

function HomeStudent() {

    return(
        <div class="welcome-container">
             <Bubbles /> {/* Use the Bubbles component here */}
            <nav>
                                <ul>
                                    <li>
                                        <Link to="/home">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/classStudent">Class Status</Link>
                                    </li>
                                </ul>
                            </nav>
        <header>
            <h1>Welcome to UniSpace</h1>
            <p>Your campus scheduling companion</p>
        </header>

        <div class="features">
            <div class="feature-card">
                <h3>Check Availability</h3>
                <p>See real-time room schedules</p>
                <a href="http://localhost:3000/classStudent" class="btn">View Status</a>
            </div>
        </div>
    </div>


    )
}
export default HomeStudent