import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { InfoState, Data } from "../../../pages/test";
import { RootState } from "../../store";

enum Status {
  Idle = "idle",
  Loading = "loading",
}

type InitialState = {
  value: InfoState;
  status: Status;
};

const initialState: InitialState = {
  value: null,
  status: Status.Idle,
};

type CreateUserResponse = CreateUserBody & {
  id: string;
  createdAt: string;
};

type CreateUserBody = {
  name: string;
  job: string;
};

export const fetchInfo = createAsyncThunk("reqres/fetchInfo", async () => {
  const { data } = await axios.get<Data>("https://reqres.in/api/users?page=1");
  return data;
});

export const postUser = createAsyncThunk(
  "reqres/postUser",
  async (body: CreateUserBody) => {
    const { data } = await axios.post<CreateUserResponse>(
      "https://reqres.in/api/users",
      body
    );
    return data;
  }
);

export const reqresSlice = createSlice({
  name: "reqres",
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<Data>) => {
      state.value = action.payload;
    },
    // fetchInfo: (state) => {
    //   async function fetch() {
    //     const { data } = await axios.get<Data>(
    //       "https://reqres.in/api/users?page=1"
    //     );
    //     state.value = data;
    //   }
    //   fetch();
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfo.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchInfo.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = Status.Idle;
      })
      .addCase(postUser.fulfilled, (state, action) => {
        state.value?.data.push(action.payload);
      });
  },
});

export const { setInfo } = reqresSlice.actions;

export const selectReqres = (state: RootState) => state.reqres;

export default reqresSlice.reducer;
