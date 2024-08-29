import { currentUser } from '@clerk/nextjs/server';
import InputMessage from '@/components/InputMessage';
import { supabase } from '@/supabase';

export type Message = {
  id: number;
  username: string;
  message: string;
  created_at: Date;
};

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const { data: messagesData, error } = await supabase
    .from('messages')
    .select();

  if (error) {
    return <div>Error loading messages: {error.message}</div>;
  }

  return (
    <div>
      <InputMessage
        messagesData={messagesData || []}
        username={user.username}
      />
    </div>
  );
}
