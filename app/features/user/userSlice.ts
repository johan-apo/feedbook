import { UserProfile } from "@auth0/nextjs-auth0";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../lib/axios";
import type { User } from "../../../prisma/queries";
import { getHexadecimalId } from "../../../utils";
import { RootState } from "../../store";

export const fetchUserById = createAsyncThunk<any, string>(
  "users/fetchByIdStatus",
  async (userIdFromHook) => {
    const hexadecimalId = getHexadecimalId(userIdFromHook);
    const { data } = await axiosInstance.get<User>(`/users/${hexadecimalId}`);
    return data;
  }
);

const initialState: { value: User; isLoading: boolean } = {
  value: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
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
