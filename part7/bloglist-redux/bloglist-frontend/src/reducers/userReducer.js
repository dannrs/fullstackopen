import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import loginService from "../services/login";

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem(
        "loggedBloglistappUser",
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(loginUser.rejected, () => {
        return null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem("loggedBloglistappUser");
    blogService.setToken(null);
    dispatch(clearUser());
  };
};

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  };
};

export default userSlice.reducer;
