import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import reduxStore from "../app/store";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  // USE EFFECT
  // FETCH

  return (
    <>
      <Head>
        <title>Feedbook | Share your thoughts</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ReduxProvider store={reduxStore}>
        <UserProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme: "dark" }}
          >
            <NotificationsProvider>
              {getLayout(<Component {...pageProps} />)}
            </NotificationsProvider>
          </MantineProvider>
        </UserProvider>
      </ReduxProvider>
    </>
  );
}

export default MyApp;
