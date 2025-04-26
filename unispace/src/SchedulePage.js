import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './schedule.css';
import './styles.css';

function SchedulePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    classroomId: '',
    startTime: '',
    endTime: ''
  });
  const [reservations, setReservations] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch classrooms and reservations on mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/classrooms', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setClassrooms(data);
        } else {
          throw new Error(data.error || 'Failed to fetch classrooms');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/reservations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setReservations(data);
        } else {
          throw new Error(data.error || 'Failed to fetch reservations');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClassrooms();
    fetchReservations();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Combine date and time for startTime and endTime
    const [startDate, startTime] = formData.startTime.split('T');
    const [endDate, endTime] = formData.endTime.split('T');
    const formattedStartTime = startDate && startTime ? `${startDate}T${startTime}:00Z` : '';
    const formattedEndTime = endDate && endTime ? `${endDate}T${endTime}:00Z` : '';

    if (!formattedStartTime || !formattedEndTime) {
      setError('Please provide both start and end times');
      return;
    }

    const payload = {
      classroomId: parseInt(formData.classroomId),
      startTime: formattedStartTime,
      endTime: formattedEndTime
    };

    try {
      const response = await fetch('http://localhost:9000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Reservation failed');
      }

      // Success: Show message and refresh reservations
      setSuccess('Reservation successful!');
      setFormData({ classroomId: '', startTime: '', endTime: '' });
      // Refresh reservations
      const reservationsResponse = await fetch('http://localhost:9000/api/reservations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const reservationsData = await reservationsResponse.json();
      if (reservationsResponse.ok) {
        setReservations(reservationsData);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during reservation');
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
        <div className="schedule-container">
          <div className="card-header section">
            <h2>Classroom Reservations</h2>
            <div className="red-square"></div>
          </div>
          <div className="class-queue section">
            <h3>Class Queue</h3>
            {reservations.length > 0 ? (
              <ul>
                {reservations.map((reservation) => (
                  <li key={reservation.id}>
                    {reservation.classroom.name}: {new Date(reservation.startTime).toLocaleString()} to {new Date(reservation.endTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reservations found.</p>
            )}
          </div>
        </div>
        <div className="reserve-class">
          <h3>Reserve Class</h3>
          <form className="schedule-form" onSubmit={handleSubmit}>
            <label>
              Classroom:
              <select
                name="classroomId"
                value={formData.classroomId}
                onChange={handleChange}
                className="schedule-input"
                required
              >
                <option value="">Select a classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              From:
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="schedule-input"
                required
              />
            </label>
            <label>
              To:
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="schedule-input"
                required
              />
            </label>
            <button type="submit">Submit</button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;