'use client';
import React, { useState } from 'react';
import { supabase } from '@/supabase';
import { Message } from '@/app/page';

type InputMessageProps = {
  messagesData: Message[];
  username: string | null;
};

const InputMessage: React.FC<InputMessageProps> = ({
  messagesData,
  username,
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(messagesData);

  const sendMessage = async () => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        username,
        message,
        created_at: new Date(),
      })
      .select();

    if (error) {
      console.error('Error sending message:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const newMessage = data[0] as Message;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="messageUser">{msg.username}</div>
            <div className="messageText">{msg.message}</div>
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
