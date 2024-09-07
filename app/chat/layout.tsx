import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import { clerkClient } from '@clerk/nextjs/server';
import React from 'react';

const DirectMessage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const users = await clerkClient().users.getUserList();
  const usersList = users.data.map((user) => ({
    username: user.username as string,
    imageUrl: user.imageUrl,
    id: user.id,
  }));

  return (
    <>
      <Header />
      <div className="flex w-full h-full justify-center">
        <div className="grid grid-cols-5 grid-flow-col mx-4 border-stokes-secondary bg-gradient-to-r from-stokes-secondary/95 to-stokes-primary border-4 rounded-lg w-full h-full ">
          <SideBar usersList={usersList} />
          {children}
        </div>
      </div>
    </>
  );
};

export default DirectMessage;
