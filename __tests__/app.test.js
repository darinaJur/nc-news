const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpointDataJson = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("status: 200, responds with all endpoints and their description", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body.endpointData).toEqual(endpointDataJson);
  });
});

describe("GET /api/topics", () => {
  test("status: 200, responds with an array of topics with properties of slug and description", async () => {
    const res = await request(app).get("/api/topics");
    expect(res.status).toBe(200);
    expect(res.body.topics).toHaveLength(3);
    res.body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an article of a specific ID from the GET request", async () => {
    const res = await request(app).get("/api/articles/1");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      article: {
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      },
    });
  });
  test("status 200: responds with a specified article with added property of comment_count", async () => {
    const res = await request(app).get("/api/articles/1");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      article: {
        comment_count: expect.any(Number),
      },
    });
  });
  test("status 404: responds with 'Article not found', when the article ID does not exist", async () => {
    const res = await request(app).get("/api/articles/99999");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Article not found");
  });
  test("status 400: responds with 'Invalid input', when the article ID is not of valid type", async () => {
    const res = await request(app).get("/api/articles/notAnId");
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Input");
  });
});

describe("GET /api/non-existing-endpoint", () => {
  test("status 404: responds with 'The request path does not exist' if the endpoint does not exist", async () => {
    const res = await request(app).get("/api/artivles/1");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("The request path does not exist");
  });
});

describe("GET /api/articles", () => {
  test("status 200: responds with all articles with properties of author, title, article_id, topc, created_at, votes, article_img_url and comment_count", async () => {
    const res = await request(app).get("/api/articles");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
    expect(res.body.articles).toBeSortedBy("created_at", { descending: true });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: responds with all comments for a specified article", async () => {
    const res = await request(app).get("/api/articles/1/comments");
    expect(res.status).toBe(200);
    res.body.comments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_id: 1,
      });
    });
    expect(res.body.comments).toBeSortedBy("created_at", { descending: true });
  });
  test("status 200: responds with an empty array when requested with a valid article ID but article has no comments", async () => {
    const res = await request(app).get("/api/articles/11/comments");
    expect(res.status).toBe(200);
    expect(res.body.comments).toEqual([]);
  });
  test("status 400: responds with 'Invalid input', when the article ID is not of valid type and comments cannot be selected", async () => {
    const res = await request(app).get("/api/articles/notAnId/comments");
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Input");
  });
  test("status 404: responds with 'Article not found', when the article ID does not exist", async () => {
    const res = await request(app).get("/api/articles/99999/comments");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Article not found");
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: responds with a new comment", async () => {
    const requestBody = {
      username: "butter_bridge",
      body: "Crumpets with butter are my favourite!",
    };

    const res = await request(app)
      .post("/api/articles/1/comments")
      .send(requestBody);
    expect(res.status).toBe(201);
    expect(res.body.comment).toMatchObject({
      comment_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      author: "butter_bridge",
      body: "Crumpets with butter are my favourite!",
      article_id: expect.any(Number),
    });
  });
  test("status 400: responds with 'Cannot post empty comment', when body is empty", async () => {
    const requestBody = {
      username: "butter_bridge",
      body: "",
    };

    const res = await request(app)
      .post("/api/articles/1/comments")
      .send(requestBody);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Cannot post empty comment");
  });
  test("status 400: responds with 'This user does not exist', when user is not in the database", async () => {
    const requestBody = {
      username: "potato_king",
      body: "Hello world!",
    };

    const res = await request(app)
      .post("/api/articles/1/comments")
      .send(requestBody);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("This user does not exist");
  });
  test("status 400: responds with 'Invalid input', when the article ID is not of valid type and comment cannot be posted", async () => {
    const res = await request(app).post("/api/articles/notAnId/comments");
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Input");
  });
  test("status: 404, responds with 'Article not found', when the article ID does not exist", async () => {
    const res = await request(app).post("/api/articles/99999/comments");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Article not found and comment cannot be posted");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: updates vote count when passed a positive value", async () => {
    const res = await request(app).patch("/api/articles/1").send({ votes: 42 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      article: {
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: 142,
        article_img_url: expect.any(String),
      },
    });
  });
  test("status 200: updates vote count when passed a negative value", async () => {
    const res = await request(app)
      .patch("/api/articles/1")
      .send({ votes: -42 });
    expect(res.status).toBe(200);
    expect(res.body.article.votes).toBe(58);
  });
  test("status 400: responds with 'Invalid Input' if votes value is not a valid syntax type", async () => {
    const res = await request(app)
      .patch("/api/articles/1")
      .send({ votes: "four" });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Input");
  });
  test("status 400: responds with 'Invalid input', when the article ID is not of valid type", async () => {
    const res = await request(app).patch("/api/articles/notAnId");
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Input");
  });
  test("status: 404, responds with 'Article not found', when the article ID does not exist", async () => {
    const res = await request(app).patch("/api/articles/99999");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Article not found");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: responds with no content", async () => {
    const res = await request(app).delete("/api/comments/1");
    expect(res.status).toBe(204);
  });
  test("status 400: responds with 'Invalid Input'", async () => {
    const res = await request(app).delete("/api/comments/notAnId");
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid Input");
  });
  test("status 404: responds with 'Not found'", async () => {
    const res = await request(app).delete("/api/comments/99999");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Not found");
  });
});

describe("GET /api/users", () => {
  test("status 200: responds with an array of user objects", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    res.body.users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
});

describe("GET /api/articles?topic", () => {
  test("status 200: responds with articles of specified topic", async () => {
    const res = await request(app).get("/api/articles?topic=cats");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: "cats",
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });
    expect(res.body.articles).toHaveLength(1);
  });
  test("status 200: responds with all articles when topic query is omitted", async () => {
    const res = await request(app).get("/api/articles?topic");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
  });
  test("status 200: responds with an empty array when the queried topic has no associated articles", async () => {
    const res = await request(app).get("/api/articles?topic=paper");
    expect(res.status).toBe(200);
    expect(res.body.articles).toEqual([]);
  });
  test("status 404: responds with 'No topic matching the topic query' if the topic does not exist", async () => {
    const res = await request(app).get("/api/articles?topic=dogs");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("No topic matching the topic query");
  });
});
describe("GET /api/articles (sorting queries)", () => {
  test("status 200: responds with all articles sorted by created_at in ascending order", async () => {
    const res = await request(app).get(
      "/api/articles?sort_by=created_at&order=ASC"
    );
    expect(res.status).toBe(200);
    expect(res.body.articles).toBeSortedBy("created_at");
  });
  test("status 200: responds with all articles sorted by created_at in ascending order if URL has queries in an opposite case", async () => {
    const res = await request(app).get(
      "/api/articles?sort_by=CREATED_AT&order=asc"
    );
    expect(res.status).toBe(200);
    expect(res.body.articles).toBeSortedBy("created_at");
  });
  test("status 200: responds with all articles sorted by title in ascending order (A - Z)", async () => {
    const res = await request(app).get("/api/articles?sort_by=title&order=asc");
    expect(res.status).toBe(200);
    expect(res.body.articles).toBeSortedBy("title");
  });
});
describe("GET /api/users/:username", () => {
  test("status 200: responds with an object of a user with corresponding properties", async () => {
    const res = await request(app).get("/api/users/lurker");
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      username: "lurker",
      name: expect.any(String),
      avatar_url: expect.any(String),
    });
  });
  test("status 404: responds with 'User not found' if a searched user does not exist", async () => {
    const res = await request(app).get("/api/users/banana_king");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("User not found");
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status 200: updates vote count when passed a positive value", async () => {
    const res = await request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 10 });
    expect(res.status).toBe(200);
    expect(res.body.comment).toMatchObject({
      comment_id: 1,
      votes: 26,
      created_at: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      article_id: expect.any(Number),
    });
  });
  test("status 200: updates vote count when passed a negative value", async () => {
    const res = await request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -10 });
    expect(res.status).toBe(200);
    expect(res.body.comment).toMatchObject({
      comment_id: 1,
      votes: 6,
      created_at: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      article_id: expect.any(Number),
    });
  });
  test("status 404: updates vote count when passed a negative value", async () => {
    const res = await request(app)
      .patch("/api/comments/100000")
      .send({ inc_votes: 10 });
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Comment not found");
  });
});

describe("POST /api/articles", () => {
  test("status 201: responds with a new article", async () => {
    const requestBody = {
      author: "butter_bridge",
      title: "TitleTest",
      body: "BodyTest",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    };

    const res = await request(app).post("/api/articles").send(requestBody);
    expect(res.status).toBe(201);
    expect(res.body.article).toMatchObject({
      article_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      comment_count: expect.any(Number),
      author: "butter_bridge",
      title: "TitleTest",
      body: "BodyTest",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    });
  });

  test("status 201: responds with a new article and a new topic added to the database", async () => {
    const requestBody = {
      author: "butter_bridge",
      title: "TitleTest",
      body: "BodyTest",
      topic: "dogs",
      article_img_url:
        "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    };

    const res = await request(app).post("/api/articles").send(requestBody);
    expect(res.status).toBe(201);
    expect(res.body.article).toMatchObject({
      article_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      comment_count: expect.any(Number),
      author: "butter_bridge",
      title: "TitleTest",
      body: "BodyTest",
      topic: "dogs",
      article_img_url:
        "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    });
  });

  test("status 400: responds with 'Cannot post empty article', when body is empty", async () => {
    const requestBody = {
      author: "butter_bridge",
      title: "TitleTest",
      body: "",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    };

    const res = await request(app).post("/api/articles").send(requestBody);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Cannot post empty article");
  });
});

describe("GET /api/articles (pagination)", () => {
  test("status 200: responds with a correct count of articles per page", async () => {
    const res = await request(app).get("/api/articles?limit=10&p=1");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
    expect(res.body.total_count).toBe(10);
  });

  test("status 200: responds with a correct count of articles per page", async () => {
    const res = await request(app).get("/api/articles?limit=10&p=2");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
    expect(res.body.total_count).toBe(3);
  });

  test("status 200: responds with a correct count of articles per page", async () => {
    const res = await request(app).get("/api/articles?limit=20&p=1");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
    expect(res.body.total_count).toBe(13);
  });

  test("status 200: responds with a correct count of articles per page when no values are set in limit or page", async () => {
    const res = await request(app).get("/api/articles?limit&p");
    expect(res.status).toBe(200);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
    expect(res.body.total_count).toBe(10);
  });
});
