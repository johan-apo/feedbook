import { useUser } from "@auth0/nextjs-auth0";
import { Button, Group, Skeleton } from "@mantine/core";
import ProfileMenu from "./ProfileMenu";

const UserSkeleton = () => {
  return (
    <div style={{ width: "10rem", display: "flex", alignItems: "center" }}>
      <Skeleton mr="xs" height={40} circle />
      <div style={{ flex: 1 }}>
        <Skeleton height={10} radius="xs" />
        <Skeleton height={6} mt="0.5rem" radius="xs" />
      </div>
    </div>
  );
};

const SignUpLogInButtons = () => {
  return (
    <Group>
      <a href="/api/auth/signup">
        <Button variant="filled">Sign Up</Button>
      </a>
      <a href="/api/auth/login">
        <Button variant="outline">Log in</Button>
      </a>
    </Group>
  );
};

const Header: React.FC = () => {
  const { user, isLoading } = useUser();

  return (
    <header>
      <Group position="apart">
        <h3>Feedbook</h3>
        {isLoading ? (
          <UserSkeleton />
        ) : user ? (
          <ProfileMenu
            email={user.email!}
            nickname={user.nickname!}
            picture={user.picture!}
          />
        ) : (
          <SignUpLogInButtons />
        )}
      </Group>
    </header>
  );
};

export default Header;
