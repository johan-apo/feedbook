import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetPostsRESULT, NewPostData } from "../../../prisma/queries";
import {
  createPostREQUEST,
  deletePostByIdREQUEST,
  updatePostByIdREQUEST,
} from "../../../prisma/requests";
import { showNotificationOnError } from "../../../utils";
import { RootState } from "../../store";

export const addPostTHUNK = createAsyncThunk(
  "posts/addPost",
  async (formValues: NewPostData) => {
    try {
      const createdPost = await createPostREQUEST(formValues);
      return createdPost;
    } catch (error) {
      showNotificationOnError(error);
    }
  }
);

export const updatePostByIdTHUNK = createAsyncThunk(
  "posts/updatePostById",
  async (postId: string) => {
    try {
      const updatedPost = await updatePostByIdREQUEST(postId);
      return updatedPost;
    } catch (error) {
      showNotificationOnError(error);
    }
  }
);

export const deletePostByIdTHUNK = createAsyncThunk(
  "posts/deletePostById",
  async (postId: string) => {
    try {
      const idOfDeletedPost = await deletePostByIdREQUEST(postId);
      return idOfDeletedPost;
    } catch (error) {
      showNotificationOnError(error);
    }
  }
);

const initialState: {
  value: GetPostsRESULT;
} = {
  value: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // For getServerSideProps fetching on home page
    setPosts: (state, action: PayloadAction<GetPostsRESULT>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPostTHUNK.fulfilled, (state, action) => {
        if (action.payload) {
          state.value.unshift(action.payload);
        }
      })
      .addCase(updatePostByIdTHUNK.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedPostId = action.payload.id;
          const expiredPostIndex = state.value.findIndex((post) => {
            return post.id === updatedPostId;
          });
          state.value[expiredPostIndex] = action.payload;
        }
      })
      .addCase(deletePostByIdTHUNK.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedPosts = state.value.filter((post) => {
            return post.id !== action.payload;
          });
          state.value = updatedPosts;
        }
      });
  },
});

export const { setPosts } = postsSlice.actions;
export const selectPosts = (state: RootState) => state.posts.value;
export default postsSlice.reducer;
