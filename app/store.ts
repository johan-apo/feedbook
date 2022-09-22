import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./features/posts/postsSlice";
import userReducer from "./features/user/userSlice";
import reqresReducer from "./features/reqres/reqresSlice";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    reqres: reqresReducer,
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
