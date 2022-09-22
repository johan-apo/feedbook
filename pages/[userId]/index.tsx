import { Avatar, Button, Grid, Group, Text } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { getPostsByUserId } from "../../prisma/queries";
import FeedbackPost from "../../components/FeedbackPost";
import type { ParsedUrlQuery } from "querystring";
import EditModal from "../../components/Profile/EditModal";
import { useAppSelector } from "../../app/hooks";

type ProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

/* -------------------------------------------------------------------------- */
/*                                   Profile                                  */
/* -------------------------------------------------------------------------- */
const ProfilePage = ({ userDataAndPosts }: ProfilePageProps) => {
  const userNotFound = userDataAndPosts == null;

  if (userNotFound) {
    return <Text>User not found</Text>;
  }

  const { posts, createdAt, updatedAt, ...userData } = userDataAndPosts;

  return (
    <Grid>
      <Left userData={userData} />
      <Right posts={posts} />
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

/* -------------------------------------------------------------------------- */
/*                                    Left                                    */
/* -------------------------------------------------------------------------- */
const Left = ({ userData: { id, picture, username } }: any) => {
  const [opened, setOpened] = useState(false);
  const loggedinUser = useAppSelector((state) => state.user.value);

  const thereIsALoggedinUser = !!loggedinUser;

  const isCurrentUserCheckingTheirProfile =
    thereIsALoggedinUser && loggedinUser.id === id;

  return (
    <Grid.Col md={12} lg={4}>
      <Group align="center">
        <Avatar
          src={
            isCurrentUserCheckingTheirProfile ? loggedinUser.picture : picture
          }
          size="xl"
        />
        <div>
          <Text size="xl" weight="bold">
            {isCurrentUserCheckingTheirProfile
              ? loggedinUser.username
              : username}
          </Text>
          {isCurrentUserCheckingTheirProfile && (
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

/* -------------------------------------------------------------------------- */
/*                                    Right                                   */
/* -------------------------------------------------------------------------- */
const Right = ({ posts }: any) => {
  return (
    <Grid.Col md={12} lg={8}>
      <Text>Your feedbacks:</Text>
      {posts.map((post) => {
        return <FeedbackPost key={post.id} data={post} />;
      })}
    </Grid.Col>
  );
};

/* ---------------------------- Layout and export --------------------------- */
ProfilePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default ProfilePage;
