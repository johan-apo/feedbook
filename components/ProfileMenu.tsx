import { forwardRef } from "react";
import { ChevronRight, Logout, Settings, User } from "tabler-icons-react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

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
  const { user } = useUser();

  return (
    <Group position="center" data-test="profile-button">
      <Menu withArrow>
        <Menu.Target>
          <UserButton picture={picture} nickname={nickname} email={email} />
        </Menu.Target>
        <Menu.Dropdown>
          <Link href={`/${user?.nickname}`}>
            <Menu.Item icon={<User size={14} />}>Profile</Menu.Item>
          </Link>
          <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
          <Divider />
          <Link href="/api/auth/logout">
            <Menu.Item
              data-test="log_out"
              color="red"
              icon={<Logout size={14} />}
            >
              Log out
            </Menu.Item>
          </Link>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default ProfileMenu;
