const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (mostLiked, currentBlog) => {
    return currentBlog.likes > mostLiked.likes ? currentBlog : mostLiked;
  };

  return blogs.length === 0 ? null : blogs.reduce(reducer, blogs[0]);
};

const mostBlogs = (blogs) => {
  const authorsGrouped = lodash.groupBy(blogs, "author");
  const authorsBlogCount = lodash.map(authorsGrouped, (authorBlogs, author) => {
    return {
      author: author,
      blogs: authorBlogs.length,
    };
  });

  return lodash.maxBy(authorsBlogCount, "blogs") || null;
};

const mostLikes = (blogs) => {
  const authorsGrouped = lodash.groupBy(blogs, "author");
  const authorsLikesCount = lodash.map(
    authorsGrouped,
    (authorBlogs, author) => {
      const totalLikes = lodash.sumBy(authorBlogs, "likes");
      return {
        author: author,
        likes: totalLikes,
      };
    }
  );

  return lodash.maxBy(authorsLikesCount, "likes") || null;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
