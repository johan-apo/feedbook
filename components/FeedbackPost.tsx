import { useUser } from "@auth0/nextjs-auth0";
import {
  ActionIcon,
  Anchor,
  Badge,
  Grid,
  Group,
  Menu,
  Paper,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { ArrowBigTop, Dots } from "tabler-icons-react";
import { removePost, updatePost } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import axiosInstance from "../lib/axios";
import type { Post } from "../prisma/queries";
import { getHexadecimalId } from "../utils";

dayjs.extend(relativeTime);

type FeedbackPostProps = {
  data: Post;
  withAuthor?: boolean;
};

const PostOptions = ({
  handleDelete,
  postId,
}: {
  handleDelete: (postId: string) => void;
  postId: string;
}) => (
  <Menu>
    <Menu.Target>
      <ActionIcon size="sm">
        <Dots />
      </ActionIcon>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item color="red" onClick={() => void handleDelete(postId)}>
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
    author: { username },
  },
  withAuthor,
}: FeedbackPostProps) => {
  const { user } = useUser();
  const dispatch = useAppDispatch();

  let currentUserId: string | undefined;
  if (user) {
    currentUserId = getHexadecimalId(user.sub!);
  }

  const handleLikeButton = async () => {
    try {
      const { data: interactedPost } = await axiosInstance.patch(
        `/posts/${id}`
      );
      dispatch(updatePost(interactedPost));
    } catch (error: any) {
      if (error.response.data.error == "not_authenticated") {
        showNotification({
          message: "Log in first to interact",
          color: "orange",
        });
      }
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      dispatch(removePost(postId));
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Something went wrong",
        color: "red",
      });
    }
  };

  return (
    <Paper
      mb="xs"
      sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}
      p="xs"
    >
      {authorId === currentUserId && (
        <Group position="right">
          <PostOptions handleDelete={handleDelete} postId={id} />
        </Group>
      )}
      <Grid gutter="xl" align="center">
        <Grid.Col span={2}>
          <Group position="center">
            <ActionIcon
              onClick={handleLikeButton}
              color="blue"
              variant={
                likes.some((like) => {
                  if (user) {
                    return like.authorId === currentUserId;
                  }
                })
                  ? "filled"
                  : "transparent"
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
            <Link href={`/${username}`}>
              <Anchor>
                {user && user.nickname === username ? "Me" : username}
              </Anchor>
            </Link>
          </Text>
        )}
        <Text size="sm">{dayjs(createdAt).fromNow()}</Text>
      </Group>
    </Paper>
  );
};

export default FeedbackPost;
