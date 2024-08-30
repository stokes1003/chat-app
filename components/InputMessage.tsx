'use client';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/supabase';
import { Message } from '@/app/page';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { FaRegPaperPlane } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      console.error('Cannot send an empty message.');
      return;
    }
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

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-5 grid-flow-col mt-10 border-stokes-dark-blue bg-stokes-dark-blue border-4 rounded-lg w-2/3 ">
        <div id="contacts" className="p-2 my-4">
          <div className="font-bold text-white text-center">Contacts</div>

          <div className="relative mx-2">
            <span className="flex gap-2 absolute pl-2 text-slate-400 top-[5px] ">
              <FaMagnifyingGlass size="13" />
            </span>

            <input
              placeholder="Search"
              className="rounded-lg border-stokes-dark-blue border-2 pl-7 w-full"
            />
          </div>
        </div>
        <div
          id="chat-box"
          className="border-4 col-span-4 bg-slate-100/80 rounded-lg"
        >
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
                      ? 'w-2/3  bg-stokes-teal my-1 rounded-lg'
                      : 'w-2/3  bg-stokes-blue my-1 rounded-lg'
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

                  <div
                    className="font-normal text-white  ml-4"
                    id="messageText"
                  >
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
                  sendMessage();
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
    </div>
  );
};

export default InputMessage;
