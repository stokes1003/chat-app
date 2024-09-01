import ChatBox from '@/components/ChatBox';
import { supabase } from '@/supabase';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const users = await clerkClient().users.getUserList();
  const usersList = users.data.map((user) => ({
    username: user.username as string,
    imageUrl: user.imageUrl,
    id: user.id,
  }));

  const { data: messagesData } = await supabase
    .from('messages')
    .select()
    .or(
      `and(sender_id.eq.${user?.id},chat_id.eq.${params.id}),and(sender_id.eq.${params.id},chat_id.eq.${user?.id})`
    );

  return (
    <ChatBox
      messagesData={messagesData || []}
      username={user?.username || ''}
      usersList={usersList}
      chatId={params.id}
    />
  );
};
export default Page;
