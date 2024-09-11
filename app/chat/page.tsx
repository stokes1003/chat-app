import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RobotChat from '@/components/RobotChat';

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <RobotChat />;
};

export default Page;
