import React, { useEffect, useState } from 'react';
import './PollHistory.css';

const PollHistory = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch('https://live-polling-system-hu7o.onrender.com/api/polls') // ✅ Full backend URL here
      .then((res) => res.json())
      .then((data) => setPolls(data))
      .catch((err) => console.error('Error fetching poll history:', err));
  }, []);

  return (
    <div className="poll-history">
      <h2>📜 Poll History</h2>
      {polls.length === 0 ? (
        <p>No previous polls found.</p>
      ) : (
        polls.map((poll, idx) => (
          <div key={idx} className="poll-card">
            <div className="poll-meta">
              <h3>{poll.question}</h3>
              <p><em>{new Date(poll.createdAt).toLocaleString()}</em></p>
            </div>

            <div className="results-box">
              {poll.options.map((opt, i) => {
                const count = poll.responses?.[opt] || 0;
                const total = Object.values(poll.responses || {}).reduce((a, b) => a + b, 0) || 1;
                const percent = Math.round((count / total) * 100);

                return (
                  <div key={i} className="result-bar">
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
          </div>
        ))
      )}
    </div>
  );
};

export default PollHistory;
