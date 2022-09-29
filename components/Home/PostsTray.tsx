import { Button, Skeleton, Space, Text } from "@mantine/core";
import React, { useState } from "react";
import { NewSection } from "tabler-icons-react";
import { selectPosts } from "../../app/features/posts/postsSlice";
import { useAppSelector } from "../../app/hooks";
import AddPostModal from "../AddPostModal";
import PaperContainer from "../common/PaperContainer";
import FeedbackPost from "../FeedbackPost";

const PostsTray = () => {
  const posts = useAppSelector(selectPosts);
  const { isLoading, value: currentLoggedInUser } = useAppSelector((state) => state.user);
  const [opened, setOpened] = useState(false);

  const userIsLoggedIn = currentLoggedInUser != null;

  return (
    <>
      <AddPostModal opened={opened} setOpened={setOpened} />
      <Skeleton visible={isLoading}>
        {userIsLoggedIn ? (
          <AddFeedback setOpened={setOpened} />
        ) : (
          <LogIntoToPost />
        )}
      </Skeleton>
      <Space h="md" />
      {posts.map((post) => {
        return <FeedbackPost data={post} key={post.id} withAuthor />;
      })}
    </>
  );
};

export default PostsTray;

/* -------------------------------------------------------------------------- */

type AddFeedbackProps = {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddFeedback = ({ setOpened }: AddFeedbackProps) => {
  return (
    <PaperContainer>
      <Button
        onClick={() => setOpened(true)}
        variant="subtle"
        leftIcon={<NewSection />}
      >
        Add Feedback
      </Button>
    </PaperContainer>
  );
};

const LogIntoToPost = () => {
  return (
    <PaperContainer>
      <Text>Log into to create a post</Text>
    </PaperContainer>
  );
};
