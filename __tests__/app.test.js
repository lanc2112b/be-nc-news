const request = require("supertest");

const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

const app = require("../app.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET Endpoints", () => {
  describe("GET /api/topics (03)", () => {
    it("200: Returns an array of objects containing topic & description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  describe("/api/users (09)", () => {

    it("200: Returns an array of objects containing users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4); // currently 4 users in DB
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles/ (05)", () => {
    it("200: Returns object with a single article, selected by id", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toBeInstanceOf(Object);
          expect(article.article_id).toBe(2);
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
  });

  describe("GET /api/articles/:article_id/comments (06)", () => {
    it("200: Returns object with array containing all comments belonging to a specific article id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(2);
          expect(comments).toBeSorted({ key: "created_at", descending: true });
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(3);
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles (04)", () => {
    it("200: Returns an array of objects containing articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSorted({ key: "created_at", descending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles (10) filtered by queries", () => {
    it("200: Returns an array of objects containing articles filtered by topic > cats", () => {
      return request(app)
        .get("/api/articles?topic=cats") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(1); // 1 cat article
          expect(articles).toBeSorted({ key: "created_at", descending: true }); //default
          articles.forEach((article) => {
            expect(article.author).toBe('rogersop');
            expect(article.topic).toBe("cats");
            expect(article).toMatchObject({
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles (10) filtered by queries", () => {
    it("200: Returns an array of objects containing articles filtered by topic > mitch", () => {
      return request(app)
        .get("/api/articles?topic=mitch") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11); // 11 mitch articles
          expect(articles).toBeSorted({ key: "created_at", descending: true }); //default
          articles.forEach((article) => {
            expect(article.topic).toBe('mitch');
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              });
          });
        });
    });
  });

  describe("GET /api/articles (10) filtered by queries", () => {
    it("200: Returns an array of objects containing articles sorted by column > title", () => {
      return request(app)
        .get("/api/articles?sort_by=title") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12); // 11 mitch articles
          expect(articles).toBeSorted({ key: "title", descending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              topic: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles (10) filtered by queries", () => {
    it("200: Returns an array of objects containing articles sorted by column > title", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12); // 11 mitch articles
          expect(articles).toBeSorted({ key: "title", ascending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              topic: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles (10) filtered by queries", () => {
    it("200: Returns an array of objects containing articles topic=mitch, sort_by=votes, order=asc", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=votes&order=asc") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11); // 11 mitch articles
          expect(articles).toBeSorted({ key: "votes", ascending: true });
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              topic: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
  });



}); // END GET

describe("PATCH Endpoints", () => {
  describe("PATCH /api/articles/:article_id (08)", () => {
    it("200: Returns an object of updated article", () => {
      const updateBody = { inc_votes: 2 }; // expect votes to be increment by 2
      return request(app)
        .patch("/api/articles/2")
        .send(updateBody)
        .expect(201)
        .then((response) => {
          const { article } = response.body;
          expect(article).toBeInstanceOf(Object);
          expect(article.votes).toBe(2); // whatever votes are + 2,  currently 0 in DB
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
  });
});

describe("POST Endpoints", () => {
  describe("POST: /api/articles/:article_id/comments (07)", () => {
    const newComment = {
      username: "rogersop",
      body: "Some new comment for article with id: 3",
    };

    it("Adds a new comment to article, if article exists", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toBeInstanceOf(Object);
          expect(comment.article_id).toBe(3);
          expect(comment.author).toBe("rogersop");
          expect(comment.body).toBe("Some new comment for article with id: 3");
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
  });
});

describe("Error handling tests", () => {

  describe("GET Error Handlers", () => {
    it("404: Any 404's from incorrect paths", () => {
      return request(app)
        .get("/api/unknown/path")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid path requested");
        });
    });

    it("404: When Article ID not found. ", () => {
      return request(app)
        .get("/api/articles/49999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });

    it("404: Invalid article ID when pulling comments.", () => {
      return request(app)
        .get("/api/articles/200/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });

    it("400: Invalid id type supplied to /api/articles/.", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter type provided");
        });
    });

    it("404: Non-existant topic supplied to /api/articles/.", () => {
      return request(app)
        .get("/api/articles?topic=capybaras")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No Articles Found");
        });
    });

    it("400: Bad sort_by string to /api/articles/.", () => {
      return request(app)
        .get("/api/articles?sort_by=capybaras")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: sort by");
        });
    });

    it("400: Bad order string to /api/articles/.", () => {
      return request(app)
        .get("/api/articles?order=dave")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: order direction");
        });
    });

  });

  describe("POST Error Handlers", () => {

    it("404: Article not found on POST new article.", () => {
      const newComment = {
        username: "rogersop",
        body: "Some new comment for article with id: 3",
      };
      return request(app)
        .post("/api/articles/1000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });

    it("400: Empty object / no object passed in request.", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad username");
        });
    });

    it("400: Empty object 'body' passed in request.", () => {
      const newComment = { username: "rogersop" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("No content provided");
        });
    });

    it("400: Invalid user provided.", () => {
      const newComment = {
        username: "twsbidiamond580",
        body: "Ich bin keine kartoffel",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad username");
        });
    });

    it("400: Invalid type passed as article_id.", () => {
      const newComment = {
        username: "rogersop",
        body: "Diese Woche esse ich hauptsächlich Kimchee",
      };
      return request(app)
        .post("/api/articles/banana/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter type provided");
        });
    });

    it("400: No user provided.", () => {
      const newComment = {
        username: "",
        body: "Capybara, Kapibara, Kapivar, Kapübara, Carpincho, Wasserschwein",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad username");
        });
    });
  });

  describe("PATCH Error Handlers", () => {

    it("404: PATCH /api/articles/:article_id (negative id provided)", () => {
      const updateBody = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/-4")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type for article id");
        });
    });

    it("400: PATCH /api/articles/:article_id (Wrong or non-existent key)", () => {
      const updateBody = { kartoffel: 2 };
      return request(app)
        .patch("/api/articles/3")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Object does not contain correct key(s)");
        });
    });

    it("400: PATCH /api/articles/:article_id (Wrong key value type)", () => {
      const updateBody = { inc_votes: "two" };
      return request(app)
        .patch("/api/articles/3")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid value type in object");
        });
    });

    it("400: PATCH /api/articles/:article_id (No article found)", () => {
      const updateBody = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/10000")
        .send(updateBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });

    it("400: PATCH /api/articles/:article_id (Bad Article ID provided)", () => {
      const updateBody = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/potato")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter type provided");
        });
    });

  });
});
