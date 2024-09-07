import ChatBox from '@/components/ChatBox';
import { supabase } from '@/supabase';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }
  const users = await clerkClient().users.getUserList();
  const usersList = users.data.map((user) => ({
    username: user.username as string,
    imageUrl: user.imageUrl,
    id: user.id,
  }));

  const { data: messagesData } = await supabase
    .from('messages')
    .select()
    .eq('conversation_id', params.id);

  const { data: conversationsData } = await supabase
    .from('conversations')
    .select()
    .eq('id', params.id);

  if (!conversationsData?.[0].participants.includes(user?.id)) {
    redirect('/chat');
  }

  return (
    <ChatBox
      messagesData={messagesData || []}
      conversationData={conversationsData?.[0]}
      username={user?.username || ''}
      usersList={usersList}
      conversationId={params.id}
    />
  );
};
export default Page;
