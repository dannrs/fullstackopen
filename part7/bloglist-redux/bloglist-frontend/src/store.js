import { configureStore } from "@reduxjs/toolkit";

import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import usersReducer from "./reducers/usersReducer";
import commentReducer from "./reducers/commentReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    blogs: blogReducer,
    comments: commentReducer,
  },
});

export default store;
