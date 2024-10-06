import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import BlogForm from "./BlogForm";

describe("blog form component", () => {
  test("the form calls the event handler it received as props with the right details when a new blog is created", async () => {
    const createBlogMockHandler = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <BlogForm createBlog={createBlogMockHandler} />
    );

    const titleInput = container.querySelector('input[name="title"]');
    const authorInput = container.querySelector('input[name="author"]');
    const urlInput = container.querySelector('input[name="url"]');
    const createButton = screen.getByText("create");

    await user.type(titleInput, "test title");
    await user.type(authorInput, "test author");
    await user.type(urlInput, "https://example.com");
    await user.click(createButton);

    expect(createBlogMockHandler.mock.calls).toHaveLength(1);
    expect(createBlogMockHandler.mock.calls[0][0]).toEqual({
      title: "test title",
      author: "test author",
      url: "https://example.com",
    });
  });
});
