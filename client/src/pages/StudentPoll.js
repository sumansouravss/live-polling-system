import React, { useEffect, useState } from 'react';
import socket from '../socket';
import './StudentPoll.css';
import ChatPopup from '../components/ChatPopup';


const StudentPoll = () => {
  const [name] = useState(sessionStorage.getItem('name') || '');
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState('');
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
  const name = sessionStorage.getItem('name');
  if (name) {
    socket.emit('student_join', name);
  }

  socket.on('kicked', () => {
    alert('You have been removed by the teacher.');
    sessionStorage.clear();
    window.location.href = '/student';
  });

  return () => {
    socket.off('kicked');
  };
}, []);









  useEffect(() => {
    if (!name) return;


    socket.on('new_poll', (pollData) => {
      setPoll(pollData);
      setResults(null);
      setSelected('');
      setTimer(60);
    });

    socket.on('poll_result', (data) => {
      setResults(data);
    });



    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResults((prev) => prev || {}); // fallback to show results if no answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
      socket.off('new_poll');
      socket.off('poll_result');
    };
  }, [name]);

  const handleSubmit = () => {
    if (selected) {
      socket.emit('submit_answer', { option: selected });
    }
  };

  return (
    <div className="student-poll">
      <div className="badge">🎓 Intervue Poll</div>
      {poll ? (
        <>
          <h2>Question 1 <span className="timer">⏱ {timer < 10 ? `0${timer}` : timer}</span></h2>
          <div className="question-box">{poll.question}</div>

          <div className="options-list">
            {poll.options.map((opt, idx) => (
              <label key={idx} className="option-item">
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={selected === opt}
                  disabled={results}
                  onChange={() => setSelected(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {!results ? (
            <button className="primary-button" onClick={handleSubmit} disabled={!selected}>
              Submit
            </button>
          ) : (
            <>
              <h3>Results:</h3>
              <div className="results-box">
                {poll.options.map((opt, idx) => {
                  const votes = results?.[opt] || 0;
                  const total = Object.values(results).reduce((a, b) => a + b, 0) || 1;
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
            </>
          )}
        </>
      ) : (
        <p className="waiting">⏳ Waiting for the teacher to ask a new question...</p>
      )}

          
  <ChatPopup user={name || 'Student'} />
    </div>
  );
};

export default StudentPoll;
