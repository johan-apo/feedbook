import { Avatar, Button, Grid, Group, Text } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { getPostsByUsername, User } from "../../prisma/queries";
import FeedbackPost from "../../components/FeedbackPost";
import type { ParsedUrlQuery } from "querystring";
import EditModal from "../../components/Profile/EditModal";
import { useAppSelector } from "../../app/hooks";

type UserProfileData = InferGetServerSidePropsType<typeof getServerSideProps>;

interface WithData {
  data: UserProfileData["data"];
}

interface LeftProps extends WithData {
  username: string | string[] | undefined;
  user: User;
}

type RightProps = WithData;

/* -------------------------------------------------------------------------- */
/*                                   Profile                                  */
/* -------------------------------------------------------------------------- */
const ProfilePage = ({ data }: UserProfileData) => {
  const {
    query: { username },
  } = useRouter();
  // TODO: FIGURE OUT A WAY TO MATCH THE EDIT BUTTON AND USERNAME AFTER EDITING
  const user = useAppSelector((state) => state.user.value);

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
  const [opened, setOpened] = useState(false);

  const thereIsALoggedinUser = !!user;

  const isCurrentUserCheckingTheirProfile =
    thereIsALoggedinUser && user.username === username;

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
ProfilePage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default ProfilePage;
