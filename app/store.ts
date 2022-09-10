import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./features/posts/postsSlice";

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["posts/setPosts"],
        ignoredPaths: ["posts.value"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
