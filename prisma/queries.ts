import prismaClient from "../lib/prisma";

type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type GetPostsRESULT = Awaited<ReturnType<typeof getPosts>>;
export type Post = ArrElement<GetPostsRESULT>;
export type CreatePostRESULT = Awaited<ReturnType<typeof createPost>>;
export type getUserByIdRESULT = Awaited<ReturnType<typeof getUserById>>;
export type LikeOrDislikePostRESULT = Awaited<
  ReturnType<typeof likeOrDislikePost>
>;
export type DeletePostRESULT = Awaited<ReturnType<typeof deletePostById>>;
export type UpdateUsernameRESULT = Awaited<
  ReturnType<typeof updateUsernameByUserId>
>;
export type UpdateUserProfileRESULT = Awaited<
  ReturnType<typeof updateUserPictureByUserId>
>;

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

export const getPostsByUserId = async (userId: string) => {
  return prismaClient.user.findFirst({
    where: {
      id: userId,
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

export const getUserById = async (id: string) => {
  return prismaClient.user.findUnique({
    where: {
      id,
    },
  });
};

export const updateUsernameByUserId = async (
  userId: string,
  username: string
) => {
  return prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
    },
  });
};

export const updateUserPictureByUserId = async (
  userId: string,
  picture: string
) => {
  return prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      picture,
    },
  });
};

export const getPictureByUserId = async (userId: string) => {
  return prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      picture: true,
    },
  });
};
