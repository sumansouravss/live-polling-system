import React, { useState, useEffect } from 'react';
import socket from '../socket';

const Teacher = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [results, setResults] = useState(null);

  useEffect(() => {
    socket.on('poll_result', (res) => {
      setResults(res);
    });
  }, []);

  const handleCreatePoll = () => {
    const filtered = options.filter(opt => opt.trim());
    if (question && filtered.length >= 2) {
      socket.emit('create_poll', {
        question,
        options: filtered
      });
      setQuestion('');
      setOptions(['', '']);
      setResults(null);
    }
  };

  return (
    <div>
      <h2>Teacher</h2>
      <input
        type="text"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }}
        />
      ))}
      <button onClick={() => setOptions([...options, ''])}>Add Option</button>
      <button onClick={handleCreatePoll}>Create Poll</button>

      {results && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Teacher;
