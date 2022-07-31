import { Post } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface PostsState {
  value: Post[];
}

const initialState: PostsState = {
  value: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.value = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.value.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
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
