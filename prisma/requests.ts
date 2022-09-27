import axiosInstance from "../lib/axios";
import {
  CreatePostRESULT,
  DeletePostRESULT,
  LikeOrDislikePostRESULT,
  NewPostData,
} from "./queries";

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
// TODO: ADD USER REQUESTS
export const createSignedS3UrlREQUEST = async (filename: string) => {
  return (
    await axiosInstance.put<{ signedUrl: string }>("users/sign-url-s3", {
      filename,
    })
  ).data;
};
