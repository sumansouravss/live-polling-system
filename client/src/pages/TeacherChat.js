import React from 'react';
import ChatPopup from '../components/ChatPopup';

const TeacherChat = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>💬 Fullscreen Chat</h2>
      <ChatPopup user="Teacher" />  
    </div>
  );
};

export default TeacherChat;
