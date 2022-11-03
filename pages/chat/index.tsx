import {
  Box,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  ScrollArea,
  Modal,
  UnstyledButton,
  Avatar,
  Divider,
  ActionIcon,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import useSWR from "swr";
import { Writing } from "tabler-icons-react";
import ChatProvider, {
  useMessageRecipient,
  useSearchModal,
} from "../../components/Chat/ChatProvider";
import Layout from "../../components/Layout";
import axiosInstance from "../../lib/axios";
import { GetUsersByUsernameRESULT } from "../../prisma/queries";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Chat = () => {
  // const [input, setInput] = useState("");

  // useEffect(() => void socketInitializer(), []);

  // const socketInitializer = async () => {
  //   await fetch("/api/socket");
  //   socket = io();

  //   socket.on("connect", () => {
  //     console.log("connected");
  //   });

  //   socket.on("update-input", (msg) => {
  //     setInput(msg);
  //   });
  // };

  // const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   setInput(event.target.value);
  //   socket.emit("input-change", event.target.value);
  // };

  return (
    <ChatProvider>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          padding: theme.spacing.xs,
          borderRadius: theme.radius.md,
          display: "flex",
          gap: theme.spacing.xs,
          height: "80vh",
        })}
      >
        <RecentChats />
        <ChatWindow />
        <SearchUserModal />
      </Box>
    </ChatProvider>
  );
};

Chat.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Chat;

/* -------------------------------- Contacts -------------------------------- */
const RecentChats = () => {
  const [_opened, setOpened] = useSearchModal();

  return (
    <Box
      sx={(theme) => {
        return {
          backgroundColor: theme.colors.dark[6],
          flexGrow: 1,
          borderRadius: theme.radius.md,
        };
      }}
    >
      <Group position="right" p="xs">
        <ActionIcon onClick={() => setOpened(true)}>
          <Writing />
        </ActionIcon>
      </Group>
    </Box>
  );
};

/* -------------------------------- Messages -------------------------------- */
const ChatWindow = () => {
  const [, setOpened] = useSearchModal();
  const [messageRecipient] = useMessageRecipient();
  // const [isComposing, setIsComposing] = useState(false);

  const isComposing = messageRecipient != null;

  return (
    <Box
      sx={(theme) => {
        return {
          backgroundColor: theme.colors.dark[7],
          flexGrow: 2,
          borderRadius: theme.radius.md,
        };
      }}
    >
      {isComposing ? (
        <MessageComposition />
      ) : (
        <NewMessage setOpened={setOpened} />
      )}
    </Box>
  );
};

const NewMessage = ({
  setOpened,
}: {
  setOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Text>Send private messages to anybody</Text>
      <Button onClick={() => setOpened(true)}>New message</Button>
    </>
  );
};

const User = ({
  data: { picture, username, id },
}: {
  data: {
    picture: string | null;
    id: string;
    username: string;
  };
}) => {
  const [, setMessageRecipient] = useMessageRecipient();
  const [, setOpened] = useSearchModal();

  return (
    <UnstyledButton
      onClick={() => {
        setMessageRecipient({
          id,
          username,
          picture: picture || null,
        });
        setOpened(false);
      }}
    >
      <Group>
        <Avatar src={picture} radius="xs" />
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {username}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
};

const MessageComposition = () => {
  const [input, setInput] = useState("");
  const [messageRecipient] = useMessageRecipient();
  return (
    <>
      <Group p="sm" position="center">
        <Text>{messageRecipient?.username}</Text>
      </Group>

      {/* Content */}
      <Stack justify="flex-end">
        <ScrollArea
          style={{
            height: "100%",
          }}
        >
          <Text>Sample</Text>
          <Text>Sample</Text>
          <Text>Sample</Text>
        </ScrollArea>
      </Stack>

      <Group p="sm">
        <TextInput
          placeholder="Your message"
          onChange={(event) => setInput(event.target.value)}
          value={input}
          sx={(theme) => {
            return {
              flexGrow: 10,
            };
          }}
        />
        <Button
          sx={() => {
            return {
              flexGrow: 1,
            };
          }}
          onClick={async () => {
            await axiosInstance.post("/redis", {
              content: input,
            });
            setInput("");
          }}
        >
          Send
        </Button>
      </Group>
    </>
  );
};

/* ---------------------------------- Modal --------------------------------- */
const SearchUserModal = () => {
  const [opened, setOpened] = useSearchModal();

  const [usernameValue, setUsernameValue] = useState("");
  const [debounced] = useDebouncedValue(usernameValue, 1000);

  const { data } = useSWR(
    opened ? `/users?username=${debounced}` : null,
    (url) =>
      axiosInstance.get<GetUsersByUsernameRESULT>(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Search people by username on Feedbook"
    >
      <TextInput
        label="Username"
        value={usernameValue}
        onChange={(event) => setUsernameValue(event.currentTarget.value)}
      />
      <Divider my="xs" />
      <Stack>
        {data &&
          data.map((user) => {
            return <User data={user} key={user.id} />;
          })}
        {/* TODO: ONCE CLICKED, LOAD MESSAGES */}
        {/* TODO: REFACTOR THE CODE */}
      </Stack>
    </Modal>
  );
};
