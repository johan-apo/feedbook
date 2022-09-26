import { Avatar, Button, Grid, Group, Text } from "@mantine/core";
import { useState } from "react";
import EditModal from "./EditModal";
import { useAppSelector } from "../../app/hooks";

type ProfileInforProps = {
  userData: {
    id: string;
    email: string;
    username: string;
    picture: string | null;
  };
};
export const ProfileInfo = ({
  userData: { id, picture, username },
}: ProfileInforProps) => {
  const [opened, setOpened] = useState(false);
  const currentLoggedInUser = useAppSelector((state) => state.user.value);

  const thereIsALoggedinUser = !!currentLoggedInUser;

  const isCurrentLoggedInUserCheckingTheirProfile = thereIsALoggedinUser && currentLoggedInUser.id === id;

  return (
    <Grid.Col md={12} lg={4}>
      <Group align="center">
        <Avatar
          src={isCurrentLoggedInUserCheckingTheirProfile
            ? currentLoggedInUser.picture
            : picture}
          size="xl" />
        <div>
          <Text size="xl" weight="bold">
            {isCurrentLoggedInUserCheckingTheirProfile
              ? currentLoggedInUser.username
              : username}
          </Text>
          {isCurrentLoggedInUserCheckingTheirProfile && (
            <>
              <Button onClick={() => setOpened(true)}>Edit my profile</Button>
              <EditModal modalProps={{ opened, setOpened }} />
            </>
          )}
        </div>
      </Group>
    </Grid.Col>
  );
};
