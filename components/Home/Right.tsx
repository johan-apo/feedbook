import { useUser } from "@auth0/nextjs-auth0";
import { Button, Paper } from "@mantine/core";
import React, { useState } from "react";
import { NewSection } from "tabler-icons-react";
import { useAppSelector } from "../../app/hooks";
import AddPostModal from "../AddPostModal";
import FeedbackPost from "../FeedbackPost";

export default function RightPanel() {
  const posts = useAppSelector((state) => state.posts.value);
  const { user, isLoading } = useUser();

  const [opened, setOpened] = useState(false);

  return (
    <>
      <AddPostModal opened={opened} setOpened={setOpened} />
      {user && (
        <Paper
          p="md"
          mb="md"
          sx={(theme) => ({
            backgroundColor: theme.colors.dark[6],
          })}
        >
          <Button
            onClick={() => setOpened(true)}
            variant="subtle"
            leftIcon={<NewSection />}
          >
            Add Feedback
          </Button>
        </Paper>
      )}
      {posts.map((post) => {
        return <FeedbackPost data={post} key={post.id} />;
      })}
    </>
  );
}
