import axiosInstance from "../lib/axios";
import {
  CreatePostRESULT,
  DeletePostRESULT,
  GetUserByIdRESULT,
  LikeOrDislikePostRESULT,
  NewPostData,
  UpdateUsernameRESULT,
  UpdateUserProfileRESULT,
} from "./queries";

/* ---------------------------------- POST ---------------------------------- */
export const createPostREQUEST = async (formValues: NewPostData) => {
  return (await axiosInstance.post<CreatePostRESULT>("/posts", formValues))
    .data;
};

export const updatePostByIdREQUEST = async (postId: string) => {
  return (
    await axiosInstance.patch<LikeOrDislikePostRESULT>(`/posts/${postId}`)
  ).data;
};

export const deletePostByIdREQUEST = async (postId: string) => {
  return (await axiosInstance.delete<DeletePostRESULT>(`/posts/${postId}`)).data
    .id;
};

/* ---------------------------------- USER ---------------------------------- */
export const createSignedS3UrlREQUEST = async (filename: string) => {
  return (
    await axiosInstance.put<{ signedUrl: string }>("users/sign-url-s3", {
      filename,
    })
  ).data;
};

export const getUserByIdREQUEST = async (id: string) => {
  return (await axiosInstance.get<GetUserByIdRESULT>(`/users/${id}`)).data;
};

export const updateUserPictureByIdREQUEST = async ({
  userId,
  uploadURL,
}: {
  userId: string;
  uploadURL: string;
}) => {
  return (
    await axiosInstance.patch<UpdateUserProfileRESULT>(
      `/users/${userId}/picture`,
      {
        picture: uploadURL,
      }
    )
  ).data;
};

export const updateUsernameByIdREQUEST = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  return (
    await axiosInstance.patch<UpdateUsernameRESULT>(`/users/${userId}`, {
      username,
    })
  ).data;
};
