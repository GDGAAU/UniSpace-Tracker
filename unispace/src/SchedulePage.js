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
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchClassrooms();
    await fetchReservations();
  };

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

    if (!formData.startTime || !formData.endTime) {
      setError('Please provide both start and end times');
      return;
    }

    const payload = {
      classroomId: parseInt(formData.classroomId),
      startTime: formData.startTime,
      endTime: formData.endTime
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

      setSuccess('Reservation successful!');
      setFormData({ classroomId: '', startTime: '', endTime: '' });
      await fetchReservations();
    } catch (err) {
      setError(err.message || 'An error occurred during reservation');
    }
  };

  // Handle reservation deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:9000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete reservation');
      }

      setSuccess('Reservation deleted successfully!');
      await fetchReservations();
    } catch (err) {
      setError(err.message || 'An error occurred during deletion');
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/class">Class Status</Link></li>
          <li><Link to="/schedule">Class Queue</Link></li>
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
                  <li key={reservation.id} className="reservation-item">
                    {reservation.classroom.name}: {new Date(reservation.startTime).toLocaleString()} to {new Date(reservation.endTime).toLocaleString()}
                    <button className="delete-button" onClick={() => handleDelete(reservation.id)}>Delete</button>
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
