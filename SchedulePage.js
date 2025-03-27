import React from "react";
import '../styles/schedule.css'; // Styles for this page

function SchedulePage() {
  return (
    <div className="App">
      <nav className="navbar">
        <button className="nav-button">Home</button>
        <button className="nav-button">Class Status</button>
        <button className="nav-button">Class Queue</button>
        <button className="nav-button">Home</button>
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
