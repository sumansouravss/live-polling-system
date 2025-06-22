import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';
import './ChatPopup.css';

const ChatPopup = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (msg.trim()) {
      socket.emit('chat_message', { user, msg });
      setMsg('');
    }
  };

  useEffect(() => {
    socket.on('chat_message', ({ user: from, msg }) => {
      setChat((prev) => [...prev, { from, msg }]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="chat-wrapper">
      <div className={`chat-box ${isOpen ? 'open' : ''}`}>
        <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
          💬 Chat {isOpen ? '▲' : '▼'}
        </div>

        {isOpen && (
          <>
            <div className="chat-body">
              {chat.map((m, i) => (
                <div key={i} className={`msg ${m.from === user ? 'mine' : 'theirs'}`}>
                  <span><strong>{m.from}:</strong> {m.msg}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPopup;
