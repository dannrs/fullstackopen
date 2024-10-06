import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comments";

export const createComment = createAsyncThunk(
  "blogs/createComment",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const newComment = await commentService.create(id, { content });
      return newComment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: [],
  reducers: {
    setComments(state, action) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        console.error("Failed to create comment:", action.payload);
      });
  },
});

export const { setComments } = commentSlice.actions;

export const getAllComments = (id) => {
  return async (dispatch) => {
    const comments = await commentService.getAll(id);
    console.log("comments:", comments);
    dispatch(setComments(comments));
  };
};

export default commentSlice.reducer;
