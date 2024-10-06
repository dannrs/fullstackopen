import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("blog component", () => {
  const blog = {
    title: "test blog",
    author: "test author",
    url: "https://example.com",
    likes: 0,
    user: {
      username: "test username",
      name: "test name",
    },
  };

  const likesMockHandler = vi.fn();

  beforeEach(() => {
    render(<Blog blog={blog} user={blog.user} updateBlog={likesMockHandler} />);
  });

  test("render blog title and author", () => {
    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined();
    expect(screen.queryByText(blog.url)).toBeNull();
    expect(screen.queryByText("like")).toBeNull();
  });

  test("the blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    expect(screen.getByText(blog.url)).toBeDefined();
    expect(screen.getByText("like")).toBeDefined();
    expect(button).toHaveTextContent("hide");
  });

  test("the event handler the component received as props is called twice", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likesMockHandler.mock.calls).toHaveLength(2);
  });
});
