import { useUser } from "@auth0/nextjs-auth0";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";
import { News } from "tabler-icons-react";
import { fetchUserById, setLoadingFalse } from "../app/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
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
    <Group data-test="signup_login_buttons">
      <a href="/api/auth/signup">
        <Button data-test="sign_up" variant="filled">
          Sign Up
        </Button>
      </a>
      <a href="/api/auth/login">
        <Button data-test="log_in" variant="outline">
          Log in
        </Button>
      </a>
    </Group>
  );
};

const Header = () => {
  const { user: userFromAuth0, isLoading: isLoadingFromAuth0 } = useUser();
  const dispatch = useAppDispatch();
  const { value: user, isLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (userFromAuth0 && userFromAuth0.sub) {
      dispatch(fetchUserById(userFromAuth0.sub));
    } else {
      dispatch(setLoadingFalse());
    }
  }, [isLoadingFromAuth0]);

  return (
    <header>
      <Group py="md" position="apart">
        <Link href="/">
          <Group spacing="xs">
            <News />
            <Text weight="bolder" size="xl">
              Feedbook
            </Text>
          </Group>
        </Link>
        {isLoading ? (
          <UserSkeleton />
        ) : user ? (
          <ProfileMenu
            email={user.email!}
            nickname={user.username!}
            picture={user.picture!}
            userId={user.id!}
          />
        ) : (
          <SignUpLogInButtons />
        )}
      </Group>
    </header>
  );
};

export default Header;
