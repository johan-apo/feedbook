import { useUser } from "@auth0/nextjs-auth0";
import {
  Anchor,
  Avatar,
  Button,
  Container,
  Grid,
  Group,
  Text,
  FileButton,
} from "@mantine/core";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { getPostsByUsername } from "../../prisma/queries";
import FeedbackPost from "../../components/FeedbackPost";

const Profile = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    query: { username },
  } = useRouter();
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);

  const userNotFound = data == null;

  useEffect(() => {
    if (file) {
      console.log(file);
    } else {
      console.log("It's empy");
    }
  }, [file]);

  if (userNotFound) {
    return <Text>User not found</Text>;
  }

  return (
    <Grid>
      <Grid.Col md={12} lg={4}>
        <Group align="center">
          <Avatar src={data.picture} size="xl" />
          <div>
            <Text size="xl" weight="bold">
              {username}
            </Text>
            {user?.nickname && user.nickname === username && (
              <>
                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                  {(props) => (
                    <Button {...props}>Change profile picture</Button>
                  )}
                </FileButton>
                {file && (
                  <Text size="sm" align="center" mt="sm">
                    Picked file: {file.name}
                  </Text>
                )}
              </>
            )}
          </div>
        </Group>
      </Grid.Col>
      <Grid.Col md={12} lg={8}>
        <Text>Your feedbacks:</Text>
        {data &&
          data.posts.map((post) => {
            return <FeedbackPost key={post.id} data={post} />;
          })}
      </Grid.Col>
    </Grid>
  );
};

export const getServerSideProps = async (context: any) => {
  const username = context.query.username;

  if (username == undefined || typeof username !== "string")
    return { props: {} };

  const data = await getPostsByUsername(username);
  return { props: { data } };
};

Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Profile;
