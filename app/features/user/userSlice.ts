import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetUserByIdRESULT } from "../../../prisma/queries";
import {
  getUserByIdREQUEST,
  updateUsernameByIdREQUEST,
  updateUserPictureByIdREQUEST,
} from "../../../prisma/requests";
import { getHexadecimalId } from "../../../utils";
import { RootState } from "../../store";

export const fetchUserByIdTHUNK = createAsyncThunk(
  "user/fetchById",
  async (userIdFromHook: string) => {
    const userId = getHexadecimalId(userIdFromHook);
    const retrievedUser = await getUserByIdREQUEST(userId);
    return retrievedUser;
  }
);

export const updateUserPictureByIdTHUNK = createAsyncThunk(
  "user/updateUserPictureById",
  async ({ userId, uploadURL }: { userId: string; uploadURL: string }) => {
    const updatedUser = await updateUserPictureByIdREQUEST({
      userId,
      uploadURL,
    });
    return updatedUser;
  }
);

export const updateUsernameByIdTHUNK = createAsyncThunk(
  "user/updateUsernameById",
  async ({ userId, username }: { userId: string; username: string }) => {
    const updatedUser = await updateUsernameByIdREQUEST({ userId, username });
    return updatedUser;
  }
);

const initialState: { value: GetUserByIdRESULT; isLoading: boolean } = {
  value: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByIdTHUNK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchUserByIdTHUNK.fulfilled,
        (state, action: PayloadAction<GetUserByIdRESULT>) => {
          state.value = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(updateUserPictureByIdTHUNK.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(updateUsernameByIdTHUNK.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export const { setLoadingFalse } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.value;

export default userSlice.reducer;
