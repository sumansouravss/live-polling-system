import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import StudentLanding from './pages/StudentLanding';
import StudentPoll from './pages/StudentPoll';
import TeacherPoll from './pages/TeacherPoll';
import PollHistory from './pages/PollHistory';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherChat from './pages/TeacherChat';
import StudentChat from './pages/StudentChat';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/teacher/dashboard">Teacher</Link> | <Link to="/student/dashboard">Student</Link>
      </nav>

      <Routes>
        {/* 🏠 Landing page */}
        <Route path="/" element={<RoleSelection />} />

        {/* 👩‍🎓 Student paths */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/poll" element={<StudentPoll />} />
        <Route path="/student" element={<StudentLanding />} /> {/* fallback if needed */}

        {/* 👨‍🏫 Teacher paths */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/history" element={<PollHistory />} />
        <Route path="/teacher/poll" element={<TeacherPoll />} />
        <Route path="/teacher/chat" element={<TeacherChat />} />
        <Route path="/student/chat" element={<StudentChat />} />

      </Routes>
    </Router>
  );
}

export default App;
