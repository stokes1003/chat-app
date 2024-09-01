'use client';
import { FaRegPaperPlane } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

type Message = {
  id: number;
  username: string;
  message: string;
  created_at: Date;
  sender_id: string;
  chat_id: string;
};

interface ChatBoxProps {
  messagesData: Message[];
  username: string;
  usersList: {
    username: string;
    imageUrl: string;
    id: string;
  }[];
  chatId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messagesData,
  username,
  usersList,
  chatId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(messagesData);

  const handleInserts = (payload: RealtimePostgresInsertPayload<Message>) => {
    setMessages((prevMessages) => [...prevMessages, payload.new]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        handleInserts
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) {
      console.error('Cannot send an empty message.');
      return;
    }
    const senderUser = usersList.find((user) => user.username === username);

    if (!senderUser) {
      console.error('Invalid sender or receiver.');
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        username,
        message,
        created_at: new Date(),
        sender_id: senderUser.id,
        chat_id: chatId,
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

  return (
    <div
      id="chat-box"
      className="border-4 col-span-4 bg-slate-100/80 rounded-lg"
    >
      <div id="chat-name">
        <div className="font-bold bg-stokes-dark-blue text-white text-center">
          {usersList.find((user) => user.id === chatId)?.username}
        </div>
        <div id="messages" className="h-[400px] overflow-y-scroll">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.username === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                id="message"
                className={`flex flex-col ${
                  msg.username === username
                    ? 'w-2/3  bg-stokes-blue my-1 rounded-lg'
                    : 'w-2/3  bg-stokes-dark-blue my-1 rounded-lg'
                }`}
              >
                <div className="font-bold text-white  ml-4" id="messageUser">
                  {msg.username}{' '}
                  <span className="font-extralight text-slate-100">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="font-normal text-white  ml-4" id="messageText">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div>
          <div id="chat-input" className="rounded">
            <form
              className="flex flex-row cursor-text h-14"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(message);
              }}
            >
              <input
                className="w-full h-full rounded-lg mx-1 border-stokes-dark-blue border-2"
                placeholder=" Type a message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                type="text"
              />
              <div id="button" className="self-center">
                <button
                  className="p-4 text-white  bg-stokes-orange shadow-lg drop-shadow-sm shadow-inherit rounded-md"
                  type="submit"
                >
                  <FaRegPaperPlane size="20" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatBox;
