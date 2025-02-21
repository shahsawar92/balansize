import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getFromLocalStorage } from "@/lib/helper";

// Define types for state
interface AuthState {
  user: any | null;
  token: string | null;
  role: string;
  isAuthenticated: boolean;
}

// Initialize the state with types
const initialState: AuthState = {
  user: getFromLocalStorage("balansize-user"),
  token: getFromLocalStorage("balansize-token"),
  role: getFromLocalStorage("balansize-role") || "Guest",
  isAuthenticated: !!getFromLocalStorage("balansize-token"),
};

// Define the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: any;
        role?: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.user.user_type || "Guest";
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("balansize-token", action.payload.token);
        localStorage.setItem("balansize-role", JSON.stringify(state.role));
        localStorage.setItem(
          "balansize-user",
          JSON.stringify(action.payload.user)
        );
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = "Guest";
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("balansize-token");
        localStorage.removeItem("balansize-user");
        localStorage.removeItem("balansize-role");
      }
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("balansize-role", JSON.stringify(action.payload));
      }
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("balansize-user", JSON.stringify(action.payload));
      }
    },
  },
});

// Export actions
export const { loginSuccess, logout, setUserRole, updateUser } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.role;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
