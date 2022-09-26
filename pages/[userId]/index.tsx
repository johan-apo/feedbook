import { Avatar, Button, Grid, Group, Text } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { getPostsByUserId, Post } from "../../prisma/queries";
import FeedbackPost from "../../components/FeedbackPost";
import type { ParsedUrlQuery } from "querystring";
import EditModal from "../../components/Profile/EditModal";
import { useAppSelector } from "../../app/hooks";
import type { Like, User } from "@prisma/client";

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

/* -------------------------------------------------------------------------- */
/*                                 ProfileInfo                                */
/* -------------------------------------------------------------------------- */
type ProfileInforProps = {
  userData: {
    id: string;
    email: string;
    username: string;
    picture: string | null;
  };
};

const ProfileInfo = ({
  userData: { id, picture, username },
}: ProfileInforProps) => {
  const [opened, setOpened] = useState(false);
  const currentLoggedInUser = useAppSelector((state) => state.user.value);

  const thereIsALoggedinUser = !!currentLoggedInUser;

  const isCurrentLoggedInUserCheckingTheirProfile =
    thereIsALoggedinUser && currentLoggedInUser.id === id;

  return (
    <Grid.Col md={12} lg={4}>
      <Group align="center">
        <Avatar
          src={
            isCurrentLoggedInUserCheckingTheirProfile
              ? currentLoggedInUser.picture
              : picture
          }
          size="xl"
        />
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

/* -------------------------------------------------------------------------- */
/*                                ProfilePosts                                */
/* -------------------------------------------------------------------------- */
const ProfilePosts = ({
  posts,
}: {
  posts: (Post & {
    likes: Like[];
    author: User;
  })[];
}) => {
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
