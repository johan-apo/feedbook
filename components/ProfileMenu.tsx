import { forwardRef } from "react";
import { ChevronRight, Logout, Settings, User } from "tabler-icons-react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Divider,
  Button,
} from "@mantine/core";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  picture: string;
  nickname: string;
  email: string;
  icon?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  (
    { picture: image, nickname: name, email, icon, ...others }: UserButtonProps,
    ref
  ) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <ChevronRight size={16} />}
      </Group>
    </UnstyledButton>
  )
);

const ProfileMenu = ({ email, nickname, picture }: UserButtonProps) => {
  return (
    <Group position="center">
      <Menu withArrow>
        <Menu.Target>
          <UserButton picture={picture} nickname={nickname} email={email} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<User size={14} />}>Profile</Menu.Item>
          <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
          <Divider />
          <a href="/api/auth/logout">
            <Menu.Item color="red" icon={<Logout size={14} />}>
              Log out
            </Menu.Item>
          </a>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default ProfileMenu;