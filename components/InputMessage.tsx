'use client';
import React, { useState } from 'react';
import { supabase } from '@/supabase';

const InputMessage = ({ messagesData, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(messagesData);

  const sendMessage = async () => {
    await supabase.from('messages').insert({
      username: username,
      message: message,
      created_at: new Date(),
    });
    const newMessage = {
      username,
      message,
      created_at: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div className="messageUser">{message.username}</div>
            <div className="messageText">{message.message}</div>
          </div>
        ))}
      </div>
      <div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default InputMessage;
