import React, { useState } from 'react';
import { MultiSelect, Modal, Button, Input } from '@mantine/core';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  imageUrl: string;
  id: string;
}

interface ModalProps {
  usersList: User[];
  opened: boolean;
  close: () => void;
  getGroups: () => void;
}

const NewChatModal: React.FC<ModalProps> = ({
  usersList,
  close,
  opened,
  getGroups,
}) => {
  const { user } = useUser();
  const router = useRouter();

  const [chatName, setChatName] = useState('');
  const [chatMembers, setChatMembers] = useState<string[]>([]);

  const items = usersList.map((user) => ({
    label: user.username,
    value: user.username,
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const participants = [
      ...chatMembers
        .map((member) => usersList.find((user) => user.username === member)?.id)
        .filter((id): id is string => id !== undefined),
      user?.id,
    ];

    const { data: insertData, error } = await supabase
      .from('conversations')
      .insert({
        is_group: true,
        participants: participants,
        group_name: chatName,
      })
      .select();

    if (error) {
      console.error('Error creating conversation:', error.message);
      return;
    }

    if (insertData && insertData.length > 0) {
      router.push(`/chat/${insertData[0].id}`);
      await getGroups();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create New Group Chat">
        <form onSubmit={handleSubmit} className="m-2">
          <MultiSelect
            data={items}
            label="Add Friends"
            placeholder="Add Friends"
            searchable
            value={chatMembers}
            onChange={(value) => setChatMembers(value)}
            className="m-2"
          />
          <Input.Wrapper label="Chat Name">
            <Input
              placeholder="Chat Name"
              value={chatName}
              onChange={(event) => setChatName(event.currentTarget.value)}
              className="m-2"
            />
          </Input.Wrapper>
          <Button color="#5e69ee" type="submit" className="m-2">
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default NewChatModal;
