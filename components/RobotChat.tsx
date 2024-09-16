'use client';
import { useMediaQuery } from '@mantine/hooks';
import { FaRobot, FaRegPaperPlane } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { getMessage } from '@/app/API/OpenAI';
import React, { useState, useRef, useEffect } from 'react';
import BouncingDotsLoader from './BouncingDots';

const RobotChat = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 928px)');
  const { user } = useUser();
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<
    Array<{ userMessage?: string; gptResponse?: string }>
  >([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const turboRobotLogo = () => {
    return (
      <div className="inline-flex gap-1 items-center ">
        <div className=" inline-flex gap-0">
          <h1 className="text-stokes-primary font-light">Turbo</h1>
          <h1 className="text-stokes-primary font-bold">Robot</h1>
        </div>
        <FaRobot color="#F4F4FB" />
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    // Create a new entry with just the userMessage
    const newMessage = { userMessage: message, gptResponse: '' };

    // Append user message to the chat history
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);

    setMessage('');

    try {
      setIsTyping(true);
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      const [responseMessage] = await Promise.all([getMessage(message), delay]);

      if (responseMessage?.trim()) {
        // Update the last message with the GPT response
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].gptResponse =
            responseMessage;
          setIsTyping(false);
          return updatedHistory;
        });
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div
      id="chat-box"
      className={`outline-2 ${
        isMobile ? 'col-span-5' : 'col-span-4'
      } bg-stokes-primary/70 outline-stokes-secondary rounded-lg overflow-auto h-full`}
    >
      <div id="chat-name" className="flex flex-col gap-3 m-1">
        <div className="w-full h-[42px] justify-center items-center font-bold rounded-md bg-stokes-secondary/80 outline-1 outline-stokes-primary text-stokes-primary inline-flex gap-2">
          <div className="inline-flex gap-1 items-center pl-4">
            <div className=" inline-flex gap-0">
              <h1 className="text-stokes-primary font-light">Turbo</h1>
              <h1 className="text-stokes-primary font-bold">Robot</h1>
            </div>
          </div>
          <FaRobot color="#F4F4FB" />
        </div>
      </div>

      <div
        id="messages"
        className="h-[calc(100%-112px)] overflow-y-scroll flex flex-col relative"
      >
        <div className="absolute inset-0 flex justify-center items-center z-0">
          <FaRobot size="200" className="opacity-40" color="#5e69ee" />
        </div>

        {/* Messages */}
        <div className="relative z-10">
          {chatHistory.map((msg, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-end">
                <div
                  id="user-message"
                  className="flex flex-col w-2/3 m-1 bg-stokes-accent/80 rounded-lg"
                >
                  <div className="font-bold text-white ml-4" id="messageUser">
                    {user?.username}{' '}
                    <span className="font-extralight text-slate-100">
                      {new Date().toLocaleTimeString([], {
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <div className="font-normal text-white ml-4" id="messageText">
                    {msg.userMessage}
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <div
                  id="gpt-response"
                  className="flex flex-col w-2/3 m-1 bg-stokes-secondary/80 rounded-lg"
                >
                  <div
                    className="font-bold inline-flex text-white ml-4"
                    id="messageUser"
                  >
                    {turboRobotLogo()}&nbsp;
                    <span className="font-extralight text-slate-100">
                      {new Date().toLocaleTimeString([], {
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <div
                    className="font-normal text-white pl-4 pb-2"
                    id="messageText"
                  >
                    {msg.gptResponse || (isTyping && <BouncingDotsLoader />)}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div id="chat-input" className="rounded">
        <form
          className="flex flex-row cursor-text h-14"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(message);
          }}
        >
          <input
            className="w-full h-full rounded-lg mx-1 pl-2 text-stokes-secondary"
            placeholder="Chat with TurboRobot..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            type="text"
          />
          <div id="button" className="self-center mr-1">
            <button
              className="p-4 text-white hover:bg-stokes-accent-dark bg-stokes-accent/80 shadow-lg drop-shadow-sm shadow-inherit rounded-md"
              type="submit"
            >
              <FaRegPaperPlane size="20" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RobotChat;
