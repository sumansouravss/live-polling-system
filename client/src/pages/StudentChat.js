import React from 'react';
import ChatPopup from '../components/ChatPopup';

const StudentChat = () => {
  const name = sessionStorage.getItem('name') || 'Student';

  return (
    <div style={{ padding: '2rem' }}>
      <h2>💬 Fullscreen Chat</h2>
      <ChatPopup user={name} />
    </div>
  );
};

export default StudentChat;
