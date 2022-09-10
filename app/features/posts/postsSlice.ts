import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Posts, Post, CreatedPost } from "../../../prisma/queries";
import { RootState } from "../../store";

const initialState: { value: Posts } = {
  value: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Posts>) => {
      state.value = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.value.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<any>) => {
      const updatedPostId = action.payload.id;
      const expiredPostIndex = state.value.findIndex((post) => {
        return post.id === updatedPostId;
      });
      state.value[expiredPostIndex] = action.payload;
    },
    removePost: (state, action) => {
      const updatedPosts = state.value.filter((post) => {
        return post.id !== action.payload;
      });
      state.value = updatedPosts;
    },
  },
});

export const { addPost, setPosts, updatePost, removePost } = postsSlice.actions;

export const selectPosts = (state: RootState) => state.posts.value;

export default postsSlice.reducer;
