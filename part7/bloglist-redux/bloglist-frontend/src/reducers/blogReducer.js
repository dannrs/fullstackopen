import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blog, { rejectWithValue }) => {
    try {
      const newBlog = await blogService.create(blog);
      return newBlog;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/likeBlog",
  async (blog, { rejectWithValue }) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      return returnedBlog;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteBlog.fulfilled, (state, action) => {
        return state.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        console.error("Failed to delete blog:", action.payload);
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        console.error("Failed to create blog:", action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        return state.map((blog) =>
          blog.id !== updatedBlog.id ? blog : updatedBlog
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        console.error("Failed to update blog:", action.payload);
      });
  },
});

export const { setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;
