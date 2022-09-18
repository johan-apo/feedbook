import { UserProfile } from "@auth0/nextjs-auth0";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../lib/axios";
import type { UserData } from "../../../prisma/queries";
import { getHexadecimalId } from "../../../utils";
import { RootState } from "../../store";

export const fetchUserById = createAsyncThunk<any, string | null>(
  "users/fetchByIdStatus",
  async (userIdFromHook) => {
    // If user is not authenticated, return null and stop execution
    if (userIdFromHook == null) return null;

    const hexadecimalId = getHexadecimalId(userIdFromHook);
    const { data } = await axiosInstance.get<UserData>(`/users/${hexadecimalId}`);
    return data;
  }
);

const initialState: { value: UserData; isLoading: boolean } = {
  value: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.value = action.payload;
    },
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.value = action.payload;
      state.isLoading = false;
    });
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.value;

export default userSlice.reducer;
