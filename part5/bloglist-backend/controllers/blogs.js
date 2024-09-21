const blogsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end();
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  ).populate("user", { username: 1, name: 1 });

  updatedBlog
    ? response.status(200).json(updatedBlog)
    : response.status(404).end();
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blogId = request.params.id;

    const user = request.user;
    const blog = await Blog.findById(blogId);

    if (!blog)
      return response.status(404).json({ error: "blog post not found" });

    if (user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(blogId);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: "operation is not allowed" });
    }
  }
);

module.exports = blogsRouter;
