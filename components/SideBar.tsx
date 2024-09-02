'use client';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiChatNewLine } from 'react-icons/ri';
import NewChatModal from './NewChatModal';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

interface SideBarProps {
  usersList: {
    username: string;
    imageUrl: string;
    id: string;
  }[];
}

const SideBar: React.FC<SideBarProps> = ({ usersList }) => {
  const [contact, setContact] = useState('');
  const filtertedContacts = usersList.filter((user) =>
    user.username.toLowerCase().includes(contact.toLowerCase())
  );
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div id="contacts" className="p-2 my-4 text-center">
      <div className=" font-bold text-stokes-primary items-center inline-flex gap-2">
        Chats
        <RiChatNewLine
          className="cursor-pointer"
          onClick={() => {
            open();
          }}
        />
      </div>
      <NewChatModal usersList={usersList} close={close} opened={opened} />

      <div className="relative m-2">
        <span className="flex gap-2 absolute pl-2 text-slate-400 top-[5px] ">
          <FaMagnifyingGlass size="13" />
        </span>

        <input
          placeholder="Search"
          className="rounded-lg outline-stokes-secondary outline-2 pl-7 w-full"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3">
        {filtertedContacts.map((user) => (
          <Link href={`/chat/${user.id}`} key={user.id}>
            <div className="text-stokes-primary cursor-pointer self-center inline-flex gap-2">
              <Image
                src={user.imageUrl}
                alt="profile"
                width="30"
                height="30"
                className="rounded-full"
              />
              {user.username}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default SideBar;
