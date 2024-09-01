import SideBar from '@/components/SideBar';
import { clerkClient } from '@clerk/nextjs/server';

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
    <div className="flex justify-center">
      <div className="grid grid-cols-5 grid-flow-col mt-10 border-stokes-dark-blue bg-stokes-dark-blue border-4 rounded-lg w-2/3 ">
        <SideBar usersList={usersList} />
        {children}
      </div>
    </div>
  );
};

export default DirectMessage;
