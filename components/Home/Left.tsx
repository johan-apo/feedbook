import { useUser } from "@auth0/nextjs-auth0";
import { Paper, Text } from "@mantine/core";

const LeftPanel = () => {
  const { user } = useUser();

  return (
    <Paper
      p="xl"
      sx={(theme) => ({
        color: theme.colors.dark[7],
        backgroundColor: theme.colors.dark[0],
      })}
    >
      <Text weight="bold">
        {user
          ? user.nickname
          : "Welcome! Please log in to create your first feedback"}
      </Text>
      {user && <Text size="xs">{user.email}</Text>}
    </Paper>
  );
};

export default LeftPanel;
