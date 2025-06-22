import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem('name');

  return (
    <div className="student-dashboard">
      <div className="badge">📚 Student Panel</div>
      <h1>Welcome, {name || 'Student'}!</h1>
      <p>Select an action to get started:</p>

      <div className="dashboard-options">
        <div className="dashboard-card" onClick={() => navigate('/student/poll')}>
          <h3>🗳 Join Live Poll</h3>
          <p>Answer active questions in real time.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/student/chat')}>
          <h3>💬 Open Chat</h3>
          <p>Message your teacher or class.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
