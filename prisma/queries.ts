import axiosInstance from "../lib/axios";
import prismaClient from "../lib/prisma";

type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type Posts = Awaited<ReturnType<typeof getPosts>>;
export type Post = ArrElement<Posts>;
export type CreatedPost = Awaited<ReturnType<typeof createPost>>;

export type NewPostData = Pick<Post, "title" | "body" | "tags">;
type NewPostDataWithAuthorId = NewPostData & Pick<Post, "authorId">;

export const createPost = async (data: NewPostDataWithAuthorId) => {
  return prismaClient.post.create({
    data,
    include: {
      likes: {
        select: {
          authorId: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const getPosts = async () => {
  return prismaClient.post.findMany({
    include: {
      likes: {
        select: {
          authorId: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPostsByUsername = async (username: string) => {
  return prismaClient.user.findFirst({
    where: {
      username,
    },
    include: {
      posts: {
        include: {
          likes: true,
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

interface AuthorPostIds {
  authorId: string;
  postId: string;
}

export const getLikeByAuthorIdAndPostId = async ({
  authorId,
  postId,
}: AuthorPostIds) => {
  return prismaClient.like.findFirst({
    where: {
      authorId,
      postId,
    },
  });
};

type UpdatePostData = {
  postId: string;
  body: string;
  title: string;
  tags: string[];
};

export const updatePost = async ({
  postId,
  body,
  title,
  tags,
}: UpdatePostData) => {
  return prismaClient.post.update({
    where: {
      id: postId,
    },
    data: {
      body,
      title,
      tags,
    },
  });
};

interface PostLikeUserIds {
  postId: string;
  idFromLike?: string;
  idFromUser?: string;
}

export const likeOrDislikePost = async ({
  postId,
  idFromLike,
  idFromUser,
}: PostLikeUserIds) => {
  if (idFromLike) {
    return prismaClient.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          delete: {
            id: idFromLike,
          },
        },
      },
      include: {
        likes: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  if (idFromUser) {
    return prismaClient.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          create: {
            authorId: idFromUser,
          },
        },
      },
      include: {
        likes: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }
};

export const deletePostById = async (postId: string) => {
  return prismaClient.post.delete({
    where: {
      id: postId,
    },
    include: {
      likes: true,
    },
  });
};
