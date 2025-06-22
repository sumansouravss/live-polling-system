import React from "react";
import "./RoleSelection.css";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState("");

  const handleContinue = () => {
   if (role === 'Student') navigate('/student/dashboard');
else if (role === 'Teacher') navigate('/teacher/dashboard');

  };

  return (
    <div className="role-container">
      <div className="badge">🎓 Intervue Poll</div>
      <h1>
        Welcome to the <span className="highlight">Live Polling System</span>
      </h1>
      <p>Please select the role that best describes you:</p>

      <div className="role-cards">
        <div
          className={`role-card ${role === "Student" ? "selected" : ""}`}
          onClick={() => setRole("Student")}
        >
          <h3>I’m a Student</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
        <div
          className={`role-card ${role === "Teacher" ? "selected" : ""}`}
          onClick={() => setRole("Teacher")}
        >
          <h3>I’m a Teacher</h3>
          <p>Create polls and see student responses in real-time.</p>
        </div>
      </div>

      <button className="primary-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
