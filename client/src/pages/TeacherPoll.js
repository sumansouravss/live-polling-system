import React, { useState, useEffect } from 'react';
import socket from '../socket';
import './TeacherPoll.css';
import ChatPopup from '../components/ChatPopup';

const TeacherPoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ text: '', correct: false }]);
  const [timer, setTimer] = useState(60);
  const [results, setResults] = useState(null);
  const [activePoll, setActivePoll] = useState(null);
  const [students, setStudents] = useState([]);



  const handleAddOption = () => {
    setOptions([...options, { text: '', correct: false }]);
  };
  


  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleAskQuestion = () => {
    const filteredOptions = options
      .map((opt) => opt.text.trim())
      .filter((opt) => opt.length > 0);

    if (question.trim() && filteredOptions.length >= 2) {
      socket.emit('create_poll', {
        question: question.trim(),
        options: filteredOptions,
        timer: timer,
      });

      setQuestion('');
      setOptions([{ text: '', correct: false }]);
      setTimer(60);
    }
  };

  useEffect(() => {
  socket.on('student_list', (list) => {
    setStudents(list);
  });

  return () => socket.off('student_list');
}, []);


  useEffect(() => {
    socket.on('poll_result', (res) => {
      setResults(res);
    });

    socket.on('new_poll', (pollData) => {
      setActivePoll(pollData);
      setResults(null);
    });

    return () => {
      socket.off('poll_result');
      socket.off('new_poll');
    };
  }, []);

  return (
    <div className="teacher-poll">
      <div className="badge">🎓 Intervue Poll</div>
      {!activePoll ? (
        <>
          <h1><span className="light">Let’s</span> <span className="bold">Get Started</span></h1>
          <p>You’ll be able to create and manage polls, ask questions, and monitor responses in real-time.</p>

          <div className="question-area">
            <input
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <select value={timer} onChange={(e) => setTimer(Number(e.target.value))}>
              {[30, 45, 60, 90].map((sec) => (
                <option key={sec} value={sec}>{sec} seconds</option>
              ))}
            </select>
          </div>

          <div className="option-section">
            {options.map((opt, i) => (
              <div className="option-row" key={i}>
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(i, 'text', e.target.value)}
                />
                <span>Is it correct?</span>
                <label><input type="radio" name={`correct-${i}`} onChange={() => handleOptionChange(i, 'correct', true)} /> Yes</label>
                <label><input type="radio" name={`correct-${i}`} onChange={() => handleOptionChange(i, 'correct', false)} /> No</label>
              </div>
            ))}
            <button className="add-option" onClick={handleAddOption}>+ Add More Option</button>
          </div>

          <button className="primary-button" onClick={handleAskQuestion}>Ask Question</button>
        </>
      ) : (
        <>
          <h2>Live Poll Results</h2>
          <p className="question-box">{activePoll.question}</p>

          <div className="results-box">
            {activePoll.options.map((opt, idx) => {
              const votes = results?.[opt] || 0;
              const total = Object.values(results || {}).reduce((a, b) => a + b, 0) || 1;
              const percent = Math.round((votes / total) * 100);

              return (
                <div key={idx} className="result-bar">
                  <div className="label">{opt}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${percent}%` }}>
                      {percent}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="student-list">
  <h4>🧑 Students Online</h4>
  {students.length === 0 ? <p>No students connected.</p> : (
    students.map((s) => (
      <div key={s.id} className="student-row">
        <span>{s.name}</span>
        <button onClick={() => socket.emit('kick_student', s.id)}>Kick</button>
      </div>
    ))
  )}
</div>

        </>
      )}
      <ChatPopup user="Teacher" />
    </div>
  );
};


export default TeacherPoll;
