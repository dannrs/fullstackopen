const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "CSS is awesome",
    author: "Bill Door",
    url: "https://billdor.com/css-awesome",
    likes: 8,
  },
  {
    title: "Javascript is dead",
    author: "Steven Stevansson",
    url: "https://stevens.com/javascript-dead",
    likes: 4,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Cool HTML tricks",
    author: "John Johansen",
    url: "https://john.co.uk/cool-html-tricks",
    likes: 9,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const userLogin = async () => {
  const newUser = {
    username: "Fikri",
    name: "Fikri",
    password: "fikri",
  };

  await api.post("/api/users").send(newUser);
  const result = await api.post("/api/login").send(newUser);
  return result.body;
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  userLogin,
};
