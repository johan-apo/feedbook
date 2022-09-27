import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../lib/axios";
import type {
  UpdateUsernameRESULT,
  UpdateUserProfileRESULT,
  getUserByIdRESULT,
} from "../../../prisma/queries";
import { getHexadecimalId } from "../../../utils";
import { RootState } from "../../store";

export const fetchUserByIdTHUNK = createAsyncThunk(
  "user/fetchById",
  async (userIdFromHook: string) => {
    const hexadecimalId = getHexadecimalId(userIdFromHook);
    const { data } = await axiosInstance.get<getUserByIdRESULT>(
      `/users/${hexadecimalId}`
    );
    return data;
  }
);

export const updateUserPictureByIdTHUNK = createAsyncThunk(
  "user/updateUserPictureById",
  async ({ userId, uploadURL }: { userId: string; uploadURL: string }) => {
    const { data } = await axiosInstance.patch<UpdateUserProfileRESULT>(
      `/users/${userId}/picture`,
      {
        picture: uploadURL,
      }
    );
    return data;
  }
);

export const updateUsernameByIdTHUNK = createAsyncThunk(
  "user/updateUsernameById",
  async ({ userId, username }: { userId: string; username: string }) => {
    const { data } = await axiosInstance.patch<UpdateUsernameRESULT>(
      `/users/${userId}`,
      { username }
    );
    return data;
  }
);

const initialState: { value: getUserByIdRESULT; isLoading: boolean } = {
  value: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<getUserByIdRESULT>) => {
      state.value = action.payload;
    },
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
        (state, action: PayloadAction<getUserByIdRESULT>) => {
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

export const { setUser, setLoadingFalse } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.value;

export default userSlice.reducer;
