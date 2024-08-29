import { supabase } from '@/supabase';
import { currentUser } from '@clerk/nextjs/server';
import InputMessage from '@/components/InputMessage';

export default async function Home() {
  const user = await currentUser();

  const { data: messagesData } = await supabase.from('messages').select();

  return (
    <div>
      <InputMessage messagesData={messagesData} user={user.username} />
    </div>
  );
}
