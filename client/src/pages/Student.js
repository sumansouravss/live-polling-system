import React, { useEffect, useState } from 'react';
import socket from '../socket';

const [name, setName] = useState(() => {
  const existing = sessionStorage.getItem('name');
  if (existing) return existing;

  const randomName = `Student-${Math.floor(1000 + Math.random() * 9000)}`;
  sessionStorage.setItem('name', randomName);
  return randomName;
});

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!name) {
      const inputName = prompt("Enter your name:");
      if (inputName) {
        sessionStorage.setItem('name', inputName);
        setName(inputName);
      }
    }
  }, [name]);

  useEffect(() => {
  if (name) {
    socket.emit('student_join', name);
  }
}, [name]);


  useEffect(() => {
    socket.on('new_poll', (poll) => {
      setQuestion(poll);
      setResults(null);
      setAnswer('');
      setTimer(60);
    });

    socket.on('poll_result', (res) => {
      setResults(res);
    });

   const interval = setInterval(() => {
  setTimer((t) => {
    if (t <= 1) {
      socket.emit('request_result'); // Ask server to resend results
      return 0;
    }
    return t - 1;
  });
}, 1000);


    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (answer) {
      socket.emit('submit_answer', { option: answer });
    }
  };

  if (!name) return null;

  return (
    <div>
      <h2>Student: {name}</h2>
      {question ? (
        results ? (
          <div>
            <h3>Results:</h3>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <h3>{question.question}</h3>
            {question.options.map((opt, i) => (
              <div key={i}>
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={answer === opt}
                  onChange={() => setAnswer(opt)}
                />
                {opt}
              </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
            <p>Time left: {timer}s</p>
          </div>
        )
      ) : (
        <p>Waiting for a poll...</p>
      )}
    </div>
  );
};

export default Student;
