import { Modal, Button } from '@mantine/core';
import { supabase } from '@/supabase';
import { useRouter } from 'next/navigation';
import { Group } from './SideBar';
import { User } from './SideBar';
import React from 'react';

interface DeleteGroupProps {
  group: Group;
  user: User;
  onClose: () => void;
  onDelete: () => void;
  opened: boolean;
}

const DeleteGroupModal: React.FC<DeleteGroupProps> = ({
  group,
  user,
  onClose,
  onDelete,
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    const { error } = await supabase
      .from('conversations')
      .update([
        {
          participants: group.participants.filter(
            (participant) => participant !== user.id
          ),
        },
      ])
      .eq('id', group.id);

    if (error) {
      console.error('Error leaving group:', error.message);
      return;
    }

    onClose();
    onDelete();
    router.push('/chat/2');
  };

  return (
    <Modal opened={true} onClose={onClose} title="Leave Group?">
      <p>
        Are you sure you want to leave {group.group_name}? You won&apos;t be
        able to rejoin this group.
      </p>
      <div className="flex justify-end mt-4">
        <Button
          onClick={onClose}
          variant="transparent"
          color="#39AFEA"
          className="mr-2"
        >
          Cancel
        </Button>
        <Button onClick={handleDelete} color="#39AFEA">
          Leave
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteGroupModal;
