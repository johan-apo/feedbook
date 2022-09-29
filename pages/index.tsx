import { Grid } from "@mantine/core";
import { InferGetServerSidePropsType } from "next";
import { ReactElement, useEffect } from "react";
import { setPosts } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import SearchPanel from "../components/Home/SearchPanel";
import PostsTray from "../components/Home/PostsTray";
import Layout from "../components/Layout";
import { getPosts } from "../prisma/queries";

const Home = ({
  feed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPosts(feed));
  }, [feed]);

  return (
    <Grid>
      <Grid.Col md={12} lg={4}>
        <SearchPanel />
      </Grid.Col>
      <Grid.Col md={12} lg={8}>
        <PostsTray />
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
