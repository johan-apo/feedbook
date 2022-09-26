import { Grid, Text } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { getPostsByUserId } from "../../prisma/queries";
import type { ParsedUrlQuery } from "querystring";
import { ProfileInfo } from "../../components/Profile/ProfileInfo";
import { ProfilePosts } from "../../components/Profile/ProfilePosts";

type ProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ProfilePage = ({ userDataAndPosts }: ProfilePageProps) => {
  const userNotFound = userDataAndPosts == null;

  if (userNotFound) {
    return <Text>User not found</Text>;
  }

  const { posts, createdAt, updatedAt, ...userData } = userDataAndPosts;

  return (
    <Grid>
      <ProfileInfo userData={userData} />
      <ProfilePosts posts={posts} />
    </Grid>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const userId = context.query.userId;

  const isUsernameAnArrayOrUndefined =
    userId == undefined || typeof userId !== "string";

  if (isUsernameAnArrayOrUndefined) return { props: {} };

  const userDataAndPosts = await getPostsByUserId(userId);
  return { props: { userDataAndPosts } };
};

/* ---------------------------- Layout and export --------------------------- */
ProfilePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default ProfilePage;
