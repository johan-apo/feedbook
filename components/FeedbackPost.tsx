import { useUser } from "@auth0/nextjs-auth0";
import {
  ActionIcon,
  Badge,
  Button,
  Grid,
  Group,
  Menu,
  Paper,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Like, Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowBigTop, Dots } from "tabler-icons-react";
import { removePost, updatePost } from "../app/features/posts/postsSlice";
import { useAppDispatch } from "../app/hooks";
import axiosInstance from "../lib/axios";
import { getHexadecimalId } from "../utils";

dayjs.extend(relativeTime);

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
      <Menu.Item>Update</Menu.Item>
      <Menu.Item color="red" onClick={() => void handleDelete(postId)}>
        Delete
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

export default function FeedbackPost(props: {
  data: Post & {
    likes: Like[];
  };
}) {
  const { user } = useUser();
  const dispatch = useAppDispatch();

  let currentUserId: string | undefined;
  if (user) {
    currentUserId = getHexadecimalId(user.sub!);
  }

  async function handleDelete(postId: string) {
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
  }

  return (
    <Paper
      mb="xs"
      sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}
      p="xs"
    >
      {props.data.authorId === currentUserId && (
        <Group position="right">
          <PostOptions handleDelete={handleDelete} postId={props.data.id} />
        </Group>
      )}
      <Grid gutter="xl" align="center">
        <Grid.Col span={2}>
          <Button
            onClick={async () => {
              try {
                const { data: updatedPost } = await axiosInstance.patch(
                  `/posts/${props.data.id}`
                );

                dispatch(updatePost(updatedPost));
              } catch (error: any) {
                if (error.response.data.error == "not_authenticated") {
                  showNotification({
                    message: "Log in first to interact",
                    color: "orange",
                  });
                }
              }
            }}
            leftIcon={<ArrowBigTop size={18} />}
            variant={
              props.data.likes.some((like) => {
                if (user) {
                  return like.authorId === currentUserId;
                }
              })
                ? "filled"
                : "outline"
            }
          >
            {props.data.likes.length}
          </Button>
        </Grid.Col>
        <Grid.Col span={8}>
          <Text weight="bold">{props.data.title}</Text>
          <Text>{props.data.body}</Text>
          <Group mt="sm">
            {props.data.tags.map((tag: string) => (
              <Badge radius="xs" key={tag}>
                {tag}
              </Badge>
            ))}
          </Group>
        </Grid.Col>
        {/* <Grid.Col span={2}>
          <Group>
            <Messages size={18} />
            <p>2</p>
          </Group>
        </Grid.Col> */}
      </Grid>
      <Text size="sm" mt="xs" align="right">
        {dayjs(props.data.createdAt).fromNow()}
      </Text>
    </Paper>
  );
}
