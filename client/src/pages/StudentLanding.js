import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLanding.css';

const StudentLanding = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem('name', name);
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="student-landing">
      <div className="badge">🎓 Intervue Poll</div>
      <h1><span className="light">Let’s</span> <span className="bold">Get Started</span></h1>
      <p>If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and see your responses compare with classmates.</p>
      <input
        type="text"
        placeholder="Enter your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="primary-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default StudentLanding;
