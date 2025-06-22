import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="badge">🎓 Intervue Poll</div>
      <h1>Welcome, Teacher!</h1>
      <p>What would you like to do today?</p>

      <div className="dashboard-options">
        <div className="dashboard-card" onClick={() => navigate('/teacher/poll')}>
          <h3>📝 Start New Poll</h3>
          <p>Create a question and collect live responses.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/teacher/history')}>
          <h3>📜 Poll History</h3>
          <p>View previous polls and participation.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/teacher/chat')}>
          <h3>💬 Open Chat</h3>
          <p>Communicate with students in real-time.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
