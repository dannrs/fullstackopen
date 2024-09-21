import { expect } from "@playwright/test";

const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new post" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

// const viewBlog = async (page) => {
//   await page.getByRole("button", { name: 'view'}).first().click();
//   const initialLike = page.getByTestId('like-count').first().innerText()
//   const initialLikeNumber = parseInt(initialLike, 10)

//   await page.getByRole('button', {name: 'like'}).first().click()

//   await expect()
// };

export { loginWith, createBlog };
