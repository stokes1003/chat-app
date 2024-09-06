'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/supabase';
import { RiChatNewLine } from 'react-icons/ri';
import NewChatModal from './NewChatModal';
import { useDisclosure } from '@mantine/hooks';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GrGroup } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import DeleteGroupModal from './DeleteGroupModal';

export interface User {
  username: string;
  imageUrl: string;
  id: string;
}

export interface Group {
  id: string;
  group_name: string;
  is_group: boolean;
  participants: string[];
}

interface SideBarProps {
  usersList: User[];
}

const SideBar: React.FC<SideBarProps> = ({ usersList }) => {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState<undefined | string>();

  const [
    deleteGroupOpened,
    { open: openDeleteGroup, close: closeDeleteGroup },
  ] = useDisclosure(false);
  const [
    createGroupOpened,
    { open: openCreateGroup, close: closeCreateGroup },
  ] = useDisclosure(false);

  const defaultGroupAvi = (
    <div className="bg-stokes-accent h-[30px] w-[30px] border-2 border-stokes-primary flex justify-center items-center rounded-full">
      <GrGroup className="rounded-full " />
    </div>
  );

  const handleConversation = async (recipientId: string) => {
    if (!user) return;

    // Step 1: Check if conversation exists
    const { data: existingConversations, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participants', [user.id, recipientId])
      .eq('is_group', false);

    if (error) {
      console.error('Error fetching conversation:', error);
      return;
    }

    // Step 2: If conversation exists, redirect to chat page
    if (existingConversations?.length) {
      return router.push(`/chat/${existingConversations[0].id}`);
    }

    // Step 3: If conversation does not exist, create a new conversation
    const { data: newConversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        is_group: false,
        participants: [user.id, recipientId],
      })
      .select();

    if (insertError) {
      console.error('Error creating conversation:', insertError);
      return;
    }

    // Step 4: Redirect to chat page
    if (newConversation?.length) {
      return router.push(`/chat/${newConversation[0].id}`);
    }
  };

  const getGroups = async () => {
    if (!user) return;

    const { data: groupData, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participants', [user.id])
      .eq('is_group', true);

    if (error) {
      console.error('Error fetching groups:', error);
      return;
    }

    setGroups(groupData || []);
  };

  useEffect(() => {
    (async () => {
      await getGroups();
    })();
  }, [getGroups]);

  const handleDeleteGroupClick = (group: Group) => {
    setSelectedGroup(group);
    openDeleteGroup();
  };

  return (
    <div id="contacts" className="p-2 m-3 text-left flex flex-col h-full">
      <div className="font-bold text-stokes-primary inline-flex p-2 mb-2 w-full justify-between">
        Group Chats
        <RiChatNewLine
          className="cursor-pointer flex self-center hover:text-stokes-primary-dark "
          onClick={() => {
            openCreateGroup();
          }}
        />
      </div>
      <NewChatModal
        usersList={usersList}
        close={closeCreateGroup}
        opened={createGroupOpened}
        getGroups={getGroups}
      />

      <div className="flex flex-col gap-3">
        {groups?.map((group) => (
          <Link
            href={`/chat/${group.id}`}
            key={group.id}
            onMouseEnter={() => setHovered(group.id)}
            onMouseLeave={() => setHovered(undefined)}
          >
            <div className="group cursor-pointer inline-flex hover:bg-stokes-secondary justify-between items-center h-full w-full p-1 pr-2 rounded-sm">
              <div className="inline-flex gap-2 items-center text-stokes-primary">
                {defaultGroupAvi}
                {group.group_name}
              </div>
              <ImCancelCircle
                onClick={() => handleDeleteGroupClick(group)}
                className={`${
                  hovered === group.id ? 'hover:opacity-100' : 'opacity-0'
                } text-stokes-primary hover:text-stokes-primary-dark`}
              />
            </div>
          </Link>
        ))}
        {deleteGroupOpened && (
          <DeleteGroupModal
            group={selectedGroup as Group}
            onClose={closeDeleteGroup}
            onDelete={closeDeleteGroup}
            opened={deleteGroupOpened}
            user={user as User}
          />
        )}
        <div className="font-bold text-stokes-primary inline-flex p-2 mb-2 w-full justify-between">
          Direct Messages
        </div>
        {usersList
          .filter((someUser) => someUser.username !== user?.username)
          .map((filteredUser) => (
            <div
              key={filteredUser.id}
              className="text-stokes-primary cursor-pointer hover:bg-stokes-secondary self-left inline-flex gap-2 p-1"
              onClick={() => handleConversation(filteredUser.id)}
            >
              <Image
                src={filteredUser.imageUrl}
                alt="profile"
                width="30"
                height="30"
                className="rounded-full"
              />
              {filteredUser.username}
            </div>
          ))}
      </div>
      <div
        id="user-status"
        className="mt-auto mb-4 text-stokes-primary cursor-pointer hover:bg-stokes-secondary inline-flex gap-2 items-center font-bold"
      >
        <Image
          src={user?.imageUrl || ''}
          alt="profile"
          width="30"
          height="30"
          className="rounded-full"
        />
        {user?.username}
      </div>
    </div>
  );
};

export default SideBar;
