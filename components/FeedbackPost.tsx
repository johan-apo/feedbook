import {
  ActionIcon,
  Anchor,
  Badge,
  Grid,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { ArrowBigTop, Dots } from "tabler-icons-react";
import {
  deletePostByIdTHUNK,
  updatePostByIdTHUNK,
} from "../app/features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { Post } from "../prisma/queries";

import PaperContainer from "./common/PaperContainer";

dayjs.extend(relativeTime);

const getTimeElapsedFromDate = (createdAt: Date) => dayjs(createdAt).fromNow();

type FeedbackPostProps = {
  data: Post;
  withAuthor?: boolean;
};

const PostOptions = ({
  onHandleDeleteClick,
  postId,
}: {
  onHandleDeleteClick: (postId: string) => void;
  postId: string;
}) => (
  <Menu>
    <Menu.Target>
      <ActionIcon size="sm">
        <Dots />
      </ActionIcon>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item color="red" onClick={() => onHandleDeleteClick(postId)}>
        Delete
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

const FeedbackPost = ({
  data: {
    id,
    authorId,
    likes,
    title,
    body,
    tags,
    createdAt,
    author: { username: authorOfPost },
  },
  withAuthor,
}: FeedbackPostProps) => {
  const currentLoggedInUser = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();

  const handleLikeButton = () => {
    dispatch(updatePostByIdTHUNK(id));
  };

  const handleDelete = (postId: string) => {
    dispatch(deletePostByIdTHUNK(postId));
  };

  const authorIsTheCurrentLoggedInUser = authorId === currentLoggedInUser?.id;

  const isPostLikedByCurrentLoggedInUser = likes.some((like) => {
    if (currentLoggedInUser) return like.authorId === currentLoggedInUser.id;
  });

  return (
    <PaperContainer mb="sm">
      {authorIsTheCurrentLoggedInUser && (
        <Group position="right">
          <PostOptions onHandleDeleteClick={handleDelete} postId={id} />
        </Group>
      )}
      <Grid gutter="xl" align="center">
        <Grid.Col span={2}>
          <Group position="center">
            <ActionIcon
              onClick={handleLikeButton}
              color="blue"
              variant={
                isPostLikedByCurrentLoggedInUser ? "filled" : "transparent"
              }
            >
              <ArrowBigTop size="16" />
            </ActionIcon>
            <Text>{likes.length}</Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={10}>
          <Text weight="bold">{title}</Text>
          <Text>{body}</Text>
          <Group mt="sm">
            {tags.map((tag: string) => (
              <Badge radius="xs" key={tag}>
                {tag}
              </Badge>
            ))}
          </Group>
        </Grid.Col>
      </Grid>
      <Group position={withAuthor ? "apart" : "right"} mt="xs">
        {withAuthor && (
          <Text size="sm">
            By:{" "}
            <Link href={`/${authorId}`}>
              <Anchor>
                {currentLoggedInUser &&
                currentLoggedInUser.username === authorOfPost
                  ? "Me"
                  : authorOfPost}
              </Anchor>
            </Link>
          </Text>
        )}
        <Text size="sm">{getTimeElapsedFromDate(createdAt)}</Text>
      </Group>
    </PaperContainer>
  );
};

export default FeedbackPost;
