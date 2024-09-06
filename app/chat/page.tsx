import { FaRegPaperPlane } from 'react-icons/fa';

import { currentUser } from '@clerk/nextjs/server';
import { FaRobot } from 'react-icons/fa';

import Image from 'next/image';

const Page = async () => {
  const user = await currentUser();
  return (
    <div
      id="chat-box"
      className="outline-2 col-span-4 bg-stokes-primary/70 outline-stokes-secondary rounded-lg"
    >
      <div id="chat-name" className="flex flex-col gap-3  m-1">
        <div className="w-full h-[42px] justify-center items-center font-bold rounded-md bg-stokes-secondary/80 outline-1 outline-stokes-primary text-stokes-primary inline-flex gap-2">
          <Image
            src={user?.imageUrl || ''}
            alt="profile"
            width="30"
            height="30"
            className="rounded-full"
          />{' '}
          Welcome Robot
        </div>
      </div>
      <div
        id="messages"
        className="h-[550px] overflow-y-scroll flex justify-center items-center flex-col"
      >
        <FaRobot size="200" className="opacity-40" color="#5e69ee" />

        <div className="inline-flex items-center p-2">
          <h1 className="text-stokes-secondary  ">
            Select a chat to start chatting.
          </h1>
        </div>
      </div>
      <div>
        <div id="chat-input" className="rounded">
          <form className="flex flex-row cursor-text h-14">
            <input
              className="w-full h-full rounded-lg mx-1 pl-2 text-stokes-secondary"
              placeholder="Select a chat..."
              type="text"
            />
            <div id="button" className="self-center mr-1">
              <button className="p-4 text-white hover:bg-stokes-accent-dark bg-stokes-accent/80 shadow-lg drop-shadow-sm shadow-inherit rounded-md">
                <FaRegPaperPlane size="20" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
