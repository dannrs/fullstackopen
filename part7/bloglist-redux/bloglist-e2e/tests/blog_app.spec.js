const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/tests/reset");
    await request.post("/api/users", {
      data: {
        name: "Alan Woke",
        username: "alan",
        password: "wokwokwok",
      },
    });

    await page.goto("/");
  });

  test("login form is shown", async ({ page }) => {
    await expect(page.getByText("Login to application")).toBeVisible();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "alan", "wokwokwok");
      await expect(page.getByText("Alan Woke logged in")).toBeVisible();
      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });

    test("login fails with wrong password", async ({ page }) => {
      await loginWith(page, "alan", "wrong");

      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("username or password is wrong");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(page.getByText("Alan Woke logged-in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "alan", "wokwokwok");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "test title", "alan", "https://example.com");

      await expect(
        page.getByText("a new blog test title by test author added")
      ).toBeVisible();
      await expect(page.getByText("test title test author")).toBeVisible();
      await expect(page.getByRole("button", { name: "view" })).toBeVisible();
    });

    describe("add several notes", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "test title1", "alan", "https://example.com");
        await createBlog(page, "test title2", "alan", "https://example.com");
        await createBlog(page, "test title3", "alan", "https://example.com");
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).first().click();
        const locator = page.getByTestId("like-count").first();
        const initialLike = await locator.innerText();
        const initialLikeNumber = parseInt(initialLike, 10);

        await page.getByRole("button", { name: "like" }).first().click();

        await expect(locator).toHaveText(String(initialLikeNumber + 1));
      });

      test("delete a blog post when the remove button is clicked", async ({
        page,
      }) => {
        const blog = page.locator(".blog").first();
        await blog.getByRole("button", { name: "view" }).click();
        await expect(
          blog.getByRole("button", { name: "remove" })
        ).toBeVisible();

        page.on("dialog", async (dialog) => {
          await dialog.accept();
        });
        await page.getByRole("button", { name: "remove" }).click();

        await expect(blog.getByText("test title1")).not.toBeVisible();
      });

      test("only the user who added the blog sees the delete button", async ({
        page,
        request,
      }) => {
        const blog = page.locator(".blog").first();
        await blog.getByRole("button", { name: "view" }).click();
        await expect(
          blog.getByRole("button", { name: "remove" })
        ).toBeVisible();

        await page.getByRole("button", { name: "logout" }).click();
        await request.post("/api/users", {
          data: {
            username: "fikri",
            name: "fikri",
            password: "fikri123",
          },
        });

        await loginWith(page, "fikri", "fikri123");

        await blog.getByRole("button", { name: "view" }).click();

        await expect(
          blog.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });

      test("the blogs are ordered by the number of likes", async ({ page }) => {
        const blog1 = page.locator(".blog").filter({ hasText: "title1" });
        const blog2 = page.locator(".blog").filter({ hasText: "title2" });
        const blog3 = page.locator(".blog").filter({ hasText: "title3" });

        await blog1.getByRole("button", { name: "view" }).click();
        await blog2.getByRole("button", { name: "view" }).click();
        await blog3.getByRole("button", { name: "view" }).click();

        await blog2.getByRole("button", { name: "like" }).click();
        await blog2.getByRole("button", { name: "like" }).click();
        await blog3.getByRole("button", { name: "like" }).click();

        expect(blog2.getByTestId("like-count")).toContainText("2");
        expect(blog3.getByTestId("like-count")).toContainText("1");
        expect(blog1.getByTestId("like-count")).toContainText("0");

        expect(page.locator(".blog").first()).toContainText("test title2");
        expect(page.locator(".blog").nth(1)).toContainText("test title3");
        expect(page.locator(".blog").last()).toContainText("test title1");
      });
    });
  });
});
