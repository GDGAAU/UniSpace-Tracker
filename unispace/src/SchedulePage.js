import React from "react";
import './index.css'; // Styles for this page
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function SchedulePage() {
  return (
    <div className="App">
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
      <div className="card">
        <div className='schedule-container'>
          <div className="card-header section ">
            <h2>E-Block 002</h2>
            <div className="red-square"></div>
          </div>
          <div className="class-queue section">
            <h3>Class Queue</h3>
            <p className='queue-para'>Class is reserved from 9:00am to 11:00am</p>
          </div>
        </div>
        <div className="reserve-class">
          <h3>Reserve Class</h3>
          <form className='schedule-form'>
            <label>
              From:
              <input type="time" name="from" className='schedule-input' />
            </label>
            <label>
              To:
              <input type="time" name="to" className='schedule-input' />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
  </div>
  );
}

export default SchedulePage;
