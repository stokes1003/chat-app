import { useState } from 'react';
import { MultiSelect } from '@mantine/core';
import { Modal, Button } from '@mantine/core';
import { Input } from '@mantine/core';

interface ModalProps {
  usersList: {
    username: string;
    imageUrl: string;
    id: string;
  }[];
  opened: boolean;
  close: () => void;
}

const NewChatModal: React.FC<ModalProps> = ({ usersList, close, opened }) => {
  const [chatName, setChatName] = useState('');
  const [chatMembers, setChatMembers] = useState<string[]>([]);

  const items = usersList.map((user) => ({
    label: user.username,
    value: user.username,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(chatName);
    console.log(chatMembers);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create New Chat">
        <form onSubmit={handleSubmit} className="m-2">
          <MultiSelect
            data={items}
            label="Add Friends"
            placeholder="Add Friends"
            searchable
            multiple
            value={chatMembers}
            onChange={(value) => setChatMembers(value)}
            className="m-2"
          />
          <Input.Wrapper label="Chat Name">
            <Input
              placeholder="Chat Name"
              value={chatName}
              onChange={(event) => setChatName(event.target.value)}
              className="m-2"
            />
          </Input.Wrapper>
          <Button color="#39AFEA" type="submit" className="m-2">
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default NewChatModal;
