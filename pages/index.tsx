import { Grid } from "@mantine/core";
import { InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import { setPosts } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import LeftPanel from "../components/Home/Left";
import RightPanel from "../components/Home/Right";
import Layout from "../components/Layout";
import { getPosts } from "../prisma/queries";

const Home = ({
  feed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useAppDispatch();
  dispatch(setPosts(feed));

  return (
    <Grid>
      <Grid.Col md={12} lg={4}>
        <LeftPanel />
      </Grid.Col>
      <Grid.Col md={12} lg={8}>
        <RightPanel />
      </Grid.Col>
    </Grid>
  );
};

export async function getServerSideProps() {
  const feed = await getPosts();

  return { props: { feed } };
}

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Home;
