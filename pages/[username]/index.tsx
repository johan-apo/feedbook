import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { Avatar, Button, Grid, Group, Text } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { getPostsByUsername } from "../../prisma/queries";
import FeedbackPost from "../../components/FeedbackPost";
import type { ParsedUrlQuery } from "querystring";

type UserProfileData = InferGetServerSidePropsType<typeof getServerSideProps>;

interface WithData {
  data: UserProfileData["data"];
}

interface LeftProps extends WithData {
  username: string | string[] | undefined;
  user: UserProfile | undefined;
}

type RightProps = WithData;

/* -------------------------------------------------------------------------- */
/*                                   Profile                                  */
/* -------------------------------------------------------------------------- */
const Profile = ({ data }: UserProfileData) => {
  const {
    query: { username },
  } = useRouter();
  const { user } = useUser();

  const userNotFound = data == null;

  if (userNotFound) {
    return <Text>User not found</Text>;
  }

  return (
    <Grid>
      <Left data={data} user={user} username={username} />
      <Right data={data} />
    </Grid>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const username = context.query.username;

  const isUsernameAnArrayOrUndefined =
    username == undefined || typeof username !== "string";

  if (isUsernameAnArrayOrUndefined) return { props: {} };

  const data = await getPostsByUsername(username);
  return { props: { data } };
};

/* -------------------------------------------------------------------------- */
/*                                    Left                                    */
/* -------------------------------------------------------------------------- */
const Left = ({ data, username, user }: LeftProps) => {
  const thereIsALoggedinUser = !!user;

  const isCurrentUserCheckingTheirProfile =
    thereIsALoggedinUser && user.nickname === username;

  const dataExists = data!;

  return (
    <Grid.Col md={12} lg={4}>
      <Group align="center">
        <Avatar src={dataExists.picture} size="xl" />
        <div>
          <Text size="xl" weight="bold">
            {username}
          </Text>
          {isCurrentUserCheckingTheirProfile && (
            <Button>Edit my profile</Button>
          )}
        </div>
      </Group>
    </Grid.Col>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    Right                                   */
/* -------------------------------------------------------------------------- */
const Right = ({ data }: RightProps) => {
  const dataExists = data!;

  return (
    <Grid.Col md={12} lg={8}>
      <Text>Your feedbacks:</Text>
      {dataExists.posts.map((post) => {
        return <FeedbackPost key={post.id} data={post} />;
      })}
    </Grid.Col>
  );
};

/* ---------------------------- Layout and export --------------------------- */
Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Profile;
