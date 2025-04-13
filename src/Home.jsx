import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function Home() {

    return(
        <div class="welcome-container">
            <nav>
                                <ul>
                                    <li>
                                        <Link to="/home">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/class">Class Status</Link>
                                    </li>
                                    <li>
                                        <Link to="/schedule">Class Queue</Link>
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
                <a href="http://localhost:3000/class" class="btn">View Status</a>
            </div>
            <div class="feature-card">
                <h3>Join Queue</h3>
                <p>Reserve class spaces</p>
                <Link to="/schedule" class="btn">Get Started</Link>
            </div>
        </div>
    </div>


    )
}
export default Home