import './index.css'; // Styles for this page
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import React, { useState } from 'react';

function SchedulePage() {
  const [selectedBlock, setSelectedBlock] = useState('');
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [rooms, setRooms] = useState([]);

  const handleBlockChange = (event) => {
      const block = event.target.value;
      setSelectedBlock(block);
      setSelectedFloor(''); // Reset floor selection
      setRooms([]); // Reset rooms when block changes

      if (block === 'NB') {
          setFloors(['Ground Floor', '1st Floor','2nd Floor']);
      } else if (block === 'SAMSUNG') {
          setFloors(['Ground Floor', '2nd Floor']);
      } else if (block === 'MCEC') {
          setFloors(['D-block', 'E-block','2nd Floor', '3rd Floor', '4th Floor']);
      } else {
          setFloors([]);
      }
  };

  const handleFloorChange = (event) => {
      const floor = event.target.value;
      setSelectedFloor(floor);

      // Update rooms based on selected floor
      if (floor === 'Ground Floor') {
          setRooms(['002', '003A','003B','012A','011','107','N020']);
      } else if (floor === '1st Floor') {
          setRooms(['108', '']);
      } else if (floor === '2nd Floor') {
          setRooms(['204', '205','207','208','210','211','212','213','215','N113','N114','118','121','131','132','137','138','139','155']);
      } else if (floor === '1st Floor') {
          setRooms(['Room 101', 'Room 102']);
      }  else if (floor === 'D-block') {
        setRooms(['027', '028']);
    }  else if (floor === 'E-block') {
      setRooms(['E122', 'E124','E129','E131']);
  } else if (floor === '3rd Floor') {
          setRooms(['201', '206','207','213','215','216','233','246']);
      } else if (floor === '4th Floor') {
          setRooms(['310', '311','313','319','337','338','339']);
      } else {
          setRooms([]);
      }
  };

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
         <div clas="class-half-container">
          <div className="card-header section">
            <select className="Block-dropdown" value={selectedBlock} onChange={handleBlockChange}>
              <option value="">Select a block...</option>
              <option value="NB">NB</option>
              <option value="SAMSUNG">SAMSUNG</option>
              <option value="MCEC">MCEC</option>
            </select>  

            <select className="Floor-dropdown" value={selectedFloor} onChange={handleFloorChange} disabled={!selectedBlock}>
              <option value="">Select a Floor...</option>
              {floors.map((floor, index) => (
                  <option key={index} value={floor}>{floor}</option>
              ))}
            </select>        

            <select className="Room-dropdown" disabled={!selectedFloor}>
              <option value="">Select a Room...</option>
              {rooms.map((room, index) => (
                  <option key={index} value={room}>{room}</option>
              ))}
            </select>
            
           
          </div>
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
            <button type="submit" className="buttons">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;