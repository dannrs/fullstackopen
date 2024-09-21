const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user.id });
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("unique identifier of blog posts is id", async () => {
  const response = await api.get("/api/blogs");

  const haveId = response.body.every((r) => r.hasOwnProperty("id"));

  assert.strictEqual(haveId, true);
});

test("a valid blog post can be added", async () => {
  const newBlog = {
    title: "Cool HTML tricks",
    author: "John Johansen",
    url: "https://john.co.uk/cool-html-tricks",
    likes: 9,
  };

  const user = await helper.userLogin();

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${user.token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((r) => r.url);
  assert(contents.includes("https://john.co.uk/cool-html-tricks"));
});

test("adding a blog fails with 401 if no token is provided", async () => {
  const newBlog = {
    title: "Cool HTML tricks",
    author: "John Johansen",
    url: "https://john.co.uk/cool-html-tricks",
    likes: 9,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("blog post without like is default to zero", async () => {
  const newBlog = {
    title: "Cool HTML tricks",
    author: "John Johansen",
    url: "https://john.co.uk/cool-html-tricks",
  };

  const user = await helper.userLogin();

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${user.token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
});

test("blog post without title or url is not added", async () => {
  const newBlog = {
    author: "John Johansen",
  };

  const user = await helper.userLogin();

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${user.token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("succeeds delete blog post with status code 204 if id is valid", async () => {
  const user = await helper.userLogin();
  console.log(user);

  const newBlog = {
    title: "CSS is awesome",
    author: user.name,
    url: "https://fikri.id/css-awesome",
    likes: 8,
    user: user.id,
  };

  const createdBlog = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${user.token}`)
    .send(newBlog)
    .expect(201);

  await api
    .delete(`/api/blogs/${createdBlog.body.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

  const url = blogsAtEnd.map((r) => r.url);
  assert(!url.includes(newBlog.url));
});

test("succeeds updated blog post with status code 200 if id is valid", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const user = await helper.userLogin();

  const updatedBlogObject = {
    ...blogToUpdate,
    author: user.name,
    likes: blogToUpdate.likes + 1,
    user: user.id,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .send(updatedBlogObject)
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

  const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

describe("add a new user", () => {
  test("fails with status code 400 if username is empty", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Son Chae Young",
      password: "strawberry",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username or password is missing"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test("fails with status code 400 if password is empty", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "chae",
      name: "Son Chae Young",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username or password is missing"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test("fails with status code 400 if username is invalid", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ch",
      name: "Son Chae Young",
      password: "strawberry",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "username or password length must be at least 3 characters"
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test("fails with status code 400 if password is invalid", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "chae",
      name: "Son Chae Young",
      password: "st",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "username or password length must be at least 3 characters"
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
