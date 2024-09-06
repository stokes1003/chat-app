import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    redirect('/chat');
  }

  redirect('/sign-up');
}
