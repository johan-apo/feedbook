import { Grid } from "@mantine/core";
import { Like, Post } from "@prisma/client";
import { ReactElement } from "react";
import { setPosts } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import LeftPanel from "../components/Home/Left";
import RightPanel from "../components/Home/Right";
import Layout from "../components/Layout";
import prismaClient from "../lib/prisma";

interface HomeProps {
  feed: (Post & {
    likes: Like[];
  })[];
}

const Home = ({ feed }: HomeProps) => {
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
  const posts = await prismaClient.post.findMany({
    include: {
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const dateSerialized = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return { props: { feed: dateSerialized } };
}

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Home;
