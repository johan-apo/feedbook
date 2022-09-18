import axiosInstance from "../lib/axios";
import { CreatedPost, NewPostData } from "./queries";

export const createPostRequest = async (data: NewPostData) => {
  return (await axiosInstance.post<CreatedPost>("/posts", data)).data;
};
