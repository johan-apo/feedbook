import { Grid, Text } from "@mantine/core";
import { Post } from "../../prisma/queries";
import FeedbackPost from "../FeedbackPost";
import { Like, User } from "@prisma/client";

export const ProfilePosts = ({
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
