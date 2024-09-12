import { clerkClient } from '@clerk/nextjs/server';
import React from 'react';
import { AppContainer } from '@/components/AppContainer';

const DirectMessage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const users = await clerkClient.users.getUserList();

  const usersList = users.data.map((user) => ({
    username: user.username as string,
    imageUrl: user.imageUrl,
    id: user.id,
  }));

  return (
    <div className="h-svh">
      <AppContainer usersList={usersList}>{children}</AppContainer>
    </div>
  );
};

export default DirectMessage;
