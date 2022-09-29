import { useUser } from "@auth0/nextjs-auth0";
import { Container } from "@mantine/core";
import { useEffect } from "react";
import {
  fetchUserByIdTHUNK,
  setLoadingFalse,
} from "../app/features/user/userSlice";
import { useAppDispatch } from "../app/hooks";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, isLoading } = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && user.sub) {
      dispatch(fetchUserByIdTHUNK(user.sub));
    } else {
      dispatch(setLoadingFalse());
    }
  }, [isLoading]);

  return (
    <Container>
      <Header />
      <main>{children}</main>
      <Footer />
    </Container>
  );
};

export default Layout;
