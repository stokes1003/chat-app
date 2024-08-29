'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { Message } from '@/app/page';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

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
      setMessage('');
    }
  };

  const handleInserts = (payload: RealtimePostgresInsertPayload<Message>) => {
    setMessages((prevMessages) => [...prevMessages, payload.new]);
  };

  useEffect(() => {
    supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        handleInserts
      )
      .subscribe();
  }, []);

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
