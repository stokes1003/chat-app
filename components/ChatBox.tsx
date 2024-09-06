'use client';
import { FaRegPaperPlane } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { GrGroup } from 'react-icons/gr';

type Message = {
  id: number;
  username: string;
  message: string;
  created_at: Date;
  sender_id: string;
  conversation_id: string;
  content: string;
};
type Conversation = {
  id: string;
  is_group: boolean;
  create_at: Date;
  group_name: string | null;
  participants: string[];
};

interface ChatBoxProps {
  messagesData: Message[];
  conversationData: Conversation;
  username: string;
  usersList: {
    username: string;
    imageUrl: string;
    id: string;
  }[];
  conversationId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messagesData,
  conversationData,
  username,
  usersList,
  conversationId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(messagesData);
  const { user } = useUser();

  const handleInserts = (payload: RealtimePostgresInsertPayload<Message>) => {
    if (payload.new.conversation_id !== conversationId) return;
    setMessages((prevMessages) => [...prevMessages, payload.new]);
  };

  const currentUserID = user?.id;
  const defaultGroupAvi = (
    <div className="bg-stokes-accent h-[30px] w-[30px] border-2 border-stokes-primary flex justify-center items-center rounded-full">
      <GrGroup className="rounded-full " />
    </div>
  );

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
        content: message,
        created_at: new Date(),
        sender_id: senderUser.id,
        conversation_id: conversationId,
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

  const getUsername = (id: string) => {
    return usersList.find((user) => user.id === id)?.username;
  };

  const messageName = () => {
    if (conversationData?.is_group) {
      return (
        <div className="inline-flex gap-2 self-center items-center">
          {defaultGroupAvi} {conversationData.group_name}
        </div>
      );
    } else {
      const DMRecipient = usersList.find(
        (user) =>
          user.id ===
          (conversationData?.participants.find(
            (participant) => participant !== currentUserID
          ) as string)
      )?.username;
      return (
        <div className="inline-flex gap-2 self-center items-center">
          <div className="flex self-center ">
            <Image
              src={
                usersList.find((user) => user.username === DMRecipient)
                  ?.imageUrl as string
              }
              alt="profile"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>

          {DMRecipient}
        </div>
      );
    }
  };

  return (
    <div
      id="chat-box"
      className="outline-2  col-span-4 bg-stokes-primary/70 outline-stokes-secondary rounded-lg"
    >
      <div id="chat-name" className="flex flex-col gap-3 m-1">
        <div className="w-full h-[42px] justify-center font-bold rounded-md bg-stokes-secondary/80 outline-1 outline-stokes-primary text-stokes-primary  inline-flex gap-2">
          {messageName()}
        </div>
        <div id="messages" className="h-[550px] overflow-y-scroll">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                getUsername(msg.sender_id) === username
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                id="message"
                className={`flex flex-col ${
                  getUsername(msg.sender_id) === username
                    ? 'w-2/3 m-1 bg-stokes-accent/80  rounded-lg'
                    : 'w-2/3 m-1 bg-stokes-secondary/80  rounded-lg'
                }`}
              >
                <div className="font-bold text-white  ml-4" id="messageUser">
                  {getUsername(msg.sender_id)}{' '}
                  <span className="font-extralight text-slate-100">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="font-normal text-white  ml-4" id="messageText">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div>
          <div id="chat-input" className="rounded">
            <form
              className="flex flex-row cursor-text h-14 "
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(message);
              }}
            >
              <input
                className="w-full h-full rounded-lg mx-1 text-stokes-secondary "
                placeholder=" Type a message..."
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
      </div>
    </div>
  );
};
export default ChatBox;
