/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice,  } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  name: string; 
  email: string;
  password: string;
  _id?: string;
  id: string; 
};

// Define the type for the auth state
type TAuthState = {
  user: TUser | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      
    },
  },
});

export const { setUser, logout,} = authSlice.actions;


export default authSlice.reducer;

// Selector to get the current user state
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;