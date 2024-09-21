import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    isError: false,
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    try {
      const fetchBlog = async () => {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      };
      fetchBlog();
    } catch (error) {
      setNotificationMessage({
        message: "failed to fetch the data",
        isError: true,
      });
      setTimeout(() => {
        setNotificationMessage({
          message: null,
          isError: false,
        });
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const createNewBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(createNewBlog));
      setNotificationMessage({
        message: `a new blog ${createNewBlog.title} by ${createNewBlog.author} added`,
      });
      setTimeout(() => {
        setNotificationMessage({
          message: null,
        });
      }, 5000);
    } catch (error) {
      setNotificationMessage({
        message: "Failed to add new blog",
        isError: true,
      });
      setTimeout(() => {
        setNotificationMessage({
          message: null,
          isError: false,
        });
      }, 5000);
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject);
      const newBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
      setBlogs(newBlogs);
    } catch (error) {
      setNotificationMessage(`${error.response.data.error}`);
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject.id);
      const newBlogs = blogs.filter((blog) => blog.id !== blogObject.id);
      setBlogs(newBlogs);
      setNotificationMessage(
        `${blogObject.title} by $${blogObject.author} deleted`
      );
    } catch (error) {
      setNotificationMessage(`${error.response.data.error}`);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBloglistappUser",
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setNotificationMessage({
        message: "username or password is wrong",
        isError: true,
      });
      setTimeout(() => {
        setNotificationMessage({
          message: null,
          isError: false,
        });
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedBloglistappUser");
    setUser(null);
  };

  return (
    <div>
      <Notification
        message={notificationMessage.message}
        isError={notificationMessage.isError}
      />
      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      ) : (
        <div>
          <h2>blogs</h2>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new post" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                user={user}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
