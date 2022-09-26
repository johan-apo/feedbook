import React, { createContext, useContext } from "react";
import {
  Group,
  Menu,
  ActionIcon,
  Grid,
  Text,
  Badge,
  Anchor,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { Post } from "../../prisma/queries";
import PaperContainer from "./PaperContainer";
import { ArrowBigTop, Dots } from "tabler-icons-react";
import {
  deletePostByIdTHUNK,
  updatePostByIdTHUNK,
} from "../../app/features/posts/postsSlice";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const getTimeElapsedFromDate = (createdAt: Date) => dayjs(createdAt).fromNow();

interface PostCtx {
  data: Post;
  withAuthor?: boolean;
}

const PostContext = createContext<PostCtx | null>(null);

const PostEntry = ({
  children,
  data,
  withAuthor,
}: {
  children: React.ReactNode;
  data: Post;
  withAuthor?: boolean;
}) => {
  const providerValue = {
    data,
    withAuthor,
  };

  return (
    <PaperContainer mb="sm">
      <PostContext.Provider value={providerValue}>
        {children}
        {/* {React.Children.map(children, (child) =>
          React.cloneElement(child, { open, toggle })
        )} */}
      </PostContext.Provider>
    </PaperContainer>
  );
};

export default PostEntry;

/* --------------------------------- Header --------------------------------- */
const Header = () => {
  const state = useContext(PostContext)!;

  const currentLoggedInUser = useAppSelector((state) => state.user.value);
  const authorIsTheCurrentLoggedInUser =
    state.data.authorId === currentLoggedInUser?.id;

  return authorIsTheCurrentLoggedInUser ? (
    <OptionsFlyout postId={state.data.id} />
  ) : null;
};

const OptionsFlyout = ({ postId }: { postId: string }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deletePostByIdTHUNK(postId));
  };

  return (
    <Group position="right">
      <Menu>
        <Menu.Target>
          <ActionIcon>
            <Dots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item color="red" onClick={handleDelete}>
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

/* ---------------------------------- Body ---------------------------------- */
const Body = () => {
  const currentLoggedInUser = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();
  const state = useContext(PostContext)!;

  const {
    data: { id, likes, title, tags, body },
  } = state;

  const handleLikeButton = () => {
    dispatch(updatePostByIdTHUNK(id));
  };

  const isPostLikedByCurrentLoggedInUser = likes.some((like) => {
    if (currentLoggedInUser) return like.authorId === currentLoggedInUser.id;
  });

  return (
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
  );
};

/* --------------------------------- Footer --------------------------------- */
const Footer = () => {
  const currentLoggedInUser = useAppSelector((state) => state.user.value);
  const state = useContext(PostContext)!;

  const {
    withAuthor,
    data: {
      authorId,
      author: { username: authorOfPost },
      createdAt,
    },
  } = state;

  return (
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
  );
};

PostEntry.Header = Header;
PostEntry.Body = Body;
PostEntry.Footer = Footer;
