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
  describe("GET /  (Service is alive)", () => {
    it("200: Returns a msg of API Running... ", () => {
      return request(app)
        .get("/")
        .expect(200)
        .then((response) => {
          const { msg } = response.body;
          expect(response.body).toBeInstanceOf(Object);
          expect(msg).toBe("API Running, use /api to see endpoints.");
        });
    });
  });

  describe("GET /api", () => {
    it("200: Returns an object of api endpoints and descriptions", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const { endpoints } = response.body;
          expect(endpoints).toBeInstanceOf(Object);
          expect(endpoints).toMatchObject({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/users": expect.any(Object),
            "GET /api/articles/:article_id": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "DELETE /api/comments/:comment_id": expect.any(Object),
            "PATCH /api/articles/:article_id": expect.any(Object),
          });
        });
    });
  });

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

  describe("GET /api/users (09)", () => {
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

  describe("GET /api/users/:username (17)", () => {
    it("200: Returns an object containing specified user by ID", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then((response) => {
          const { user } = response.body;
          expect(user).toBeInstanceOf(Object);
          expect(user.username).toBe("rogersop");
          expect(user.name).toBe("paul");
          expect(user.avatar_url).toBe(
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
          );
        });
    });
  });

  describe("GET /api/articles/:article_id (05)", () => {
    it("200: Returns object with a single article, selected by id", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toBeInstanceOf(Object);
          expect(article.article_id).toBe(3);
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            created_at: expect.any(String),
            title: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
    });
  });

  describe("GET /api/articles (20) L=5, P=1", () => {
    it("200: Returns an array of objects containing articles with limit, page, & totals", () => {
      return request(app)
        .get("/api/articles?limit=5&p=1&sort_by=article_id&order=asc")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(5);
          expect(articles[0].article_id).toBe(1);
          expect(articles[4].article_id).toBe(5);
          expect(articles).toBeSorted({ key: "article_id", ascending: true }); // leave default
          articles.forEach((article) => {
            expect(article.total_count).toBe("12");
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

  describe("GET /api/articles (20) L=6, P=2", () => {
    it("200: Returns an array of objects containing articles with limit, page, & totals", () => {
      return request(app)
        .get("/api/articles?limit=6&p=2&sort_by=article_id&order=asc")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(6);
          expect(articles[0].article_id).toBe(7);
          expect(articles[5].article_id).toBe(12);
          expect(articles).toBeSorted({ key: "article_id", ascending: true }); // leave default
          articles.forEach((article) => {
            expect(article.total_count).toBe("12");
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

  describe("GET /api/articles Sort by comment_count asc", () => {
    it("200: Returns an array of objects containing articles with limit, page, & totals with comment_count", () => {
      return request(app)
        .get("/api/articles?limit=6&p=2&sort_by=comment_count&order=asc")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(6);
          expect(articles[0].article_id).toBe(12);
          expect(articles[5].article_id).toBe(1);
          expect(articles).toBeSortedBy("comment_count", {
            ascending: true,
            coerce: true,
          });
          articles.forEach((article) => {
            expect(article.total_count).toBe("12");
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

  describe("GET /api/articles (20) L=default(10), P=2, default sort", () => {
    it("200: Returns an array of objects containing articles with limit, page, & totals", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(2);
          expect(articles[0].article_id).toBe(11);
          expect(articles[1].article_id).toBe(7);
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          }); // leave default
          articles.forEach((article) => {
            expect(article.total_count).toBe("12");
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

  describe("GET /api/articles/ (11)", () => {
    it("200: Returns object with a single article, selected by id to include comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toBeInstanceOf(Object);
          expect(article.article_id).toBe(1);
          expect(article.comment_count).toBe("11");
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article).toMatchObject({
            article_id: expect.any(Number),
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

  describe("GET /api/articles/:article_id/comments (Pagination) (21) L=5, P=1", () => {
    it("200: Returns an array of objects containing comments with limit, page, & totals", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5&p=1")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(5);
          expect(comments[0].comment_id).toBe(5);
          expect(comments[4].comment_id).toBe(7);
          expect(comments).toBeSorted({ key: "created_at", descending: true });
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
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

  describe("GET /api/articles/:article_id/comments (Pagination) (21) L=5, P=2", () => {
    it("200: Returns an array of objects containing comments with limit, page, & totals", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5&p=2")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(5);
          expect(comments[0].comment_id).toBe(8);
          expect(comments[4].comment_id).toBe(4);
          expect(comments).toBeSorted({ key: "created_at", descending: true });
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
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

  describe("GET /api/articles/:article_id/comments (Pagination) (21) L=7, P=2", () => {
    it("200: Returns an array of objects containing comments with limit, page, & totals", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=7&p=2")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(4); // 2nd page with limit 7, from 11 total, leaves 4
          expect(comments[0].comment_id).toBe(12); // 12
          expect(comments[3].comment_id).toBe(9); // 9
          expect(comments).toBeSorted({ key: "created_at", descending: true });
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
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
            const { articles, total_count } = response.body;
            expect(articles).toBeInstanceOf(Array);
            expect(+total_count).toBe(12);
            expect(articles).toHaveLength(10); // new default limit
            expect(articles).toBeSorted({
              key: "created_at",
              descending: true,
            });
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

  describe("GET /api/articles (04)", () => {
    it("200: Returns an array of objects containing articles", () => {
      return request(app)
        .get("/api/articles?limit=20")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12); // new default limit
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
        .get("/api/articles?topic=cats&limit=20") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(1);
          expect(articles).toBeSorted({ key: "created_at", descending: true }); //default
          articles.forEach((article) => {
            expect(article.author).toBe("rogersop");
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
        .get("/api/articles?topic=mitch&limit=20")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11); // 11 mitch articles
          expect(articles).toBeSorted({ key: "created_at", descending: true }); //default
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
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
        .get("/api/articles?sort_by=title&limit=20") // has one cat article
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12); // all articles
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
    it("200: Returns an array of objects containing articles sorted > desc", () => {
      return request(app)
        .get("/api/articles?order=desc&limit=20")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12); // all articles
          expect(articles).toBeSorted({ key: "created_at", descending: true }); // specified desc
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
        .get("/api/articles?sort_by=title&order=asc&limit=20")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12); // 11 mitch articles + 1 cat
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
        .get("/api/articles?topic=mitch&sort_by=votes&order=asc&limit=20")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11); // 11 mitch articles
          expect(articles).toBeSorted({ key: "votes", ascending: true });
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
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

  describe("PATCH /api/comments/:comment_id (08)", () => {
    it("200: Returns an object of updated comment", () => {
      const updateBody = { inc_votes: 4 };
      return request(app)
        .patch("/api/comments/5")
        .send(updateBody)
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toBeInstanceOf(Object);
          expect(comment.comment_id).toBe(5);
          expect(comment.author).toBe("icellusedkars");
          expect(comment.votes).toBe(4);
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            created_at: expect.any(String),
            body: expect.any(String),
          });
        });
    });
  });
});

describe("POST Endpoints", () => {
  describe("POST: /api/topics (22)", () => {
    const newTopic = {
      slug: "dogs",
      description: "All things dogs & dog related",
    };

    it("201: Adds a new topic to topics", () => {
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then((response) => {
          const { topic } = response.body;
          expect(topic).toBeInstanceOf(Object);
          expect(topic.slug).toBe("dogs");
          expect(topic.description).toBe("All things dogs & dog related");
        });
    });
  });

  describe("POST: /api/articles/:article_id/comments (07)", () => {
    const newComment = {
      username: "rogersop",
      body: "Some new comment for article with id: 3",
    };

    it("201: Adds a new comment to article, if article exists", () => {
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

  describe("POST: /api/articles/ (19)", () => {
    const newArticle = {
      author: "rogersop",
      title: "Got cats?",
      body: "Something to do with some cats evidently",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    };

    it("201: Adds a new article", () => {
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then((response) => {
          const { article } = response.body;
          expect(article).toBeInstanceOf(Object);
          expect(article.article_id).toBe(13);
          expect(article.author).toBe("rogersop");
          expect(article.title).toBe("Got cats?");
          expect(article.votes).toBe(0);
          expect(article.topic).toBe("cats");
          expect(article.comment_count).toBe(0);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          );
          expect(article.body).toBe("Something to do with some cats evidently");
          expect(article).toMatchObject({
            created_at: expect.any(String),
          });
        });
    });
  });
});

describe("DELETE Endpoints", () => {
  describe("DELETE: /api/comments/:comment_id (12)", () => {
    it("204: Deletes a comment and returns 204 & no content", () => {
      return request(app)
        .delete("/api/comments/10")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
          return request(app).delete("/api/comments/10");
        })
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body.msg).toBe(
            "Cannot find article with ID provided"
          );
        });
    });
  });

  describe("DELETE: /api/articles/:article_id (23)", () => {
    it("204: Deletes an article and returns 204 & no content", () => {
      return request(app)
        .delete("/api/articles/2")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
          return request(app).delete("/api/articles/2"); // lookup freshly deleted article (404)
        })
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body.msg).toBe(
            "Cannot find article with ID provided"
          );
        });
    });
  });
});

describe("Error handling tests", () => {
  describe("GET Error Handlers", () => {
    it("404: GET /api/unknown/path Any 404's from incorrect paths", () => {
      return request(app)
        .get("/api/unknown/path")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid path requested");
        });
    });

    it("404: GET /api/articles/:article_id. When Article ID not found. ", () => {
      return request(app)
        .get("/api/articles/49999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });

    it("404: GET /api/articles/:article_id/comments. Invalid article ID when pulling comments.", () => {
      return request(app)
        .get("/api/articles/200/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });

    it("404: GET /api/articles/:article_id/comments. Invalid value passed to limit when pulling comments.", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=plectrum")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: limit value type");
        });
    });

    it("404: GET /api/articles/:article_id/comments. Invalid value passed to p (page) when pulling comments.", () => {
      return request(app)
        .get("/api/articles/1/comments?p=capo")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: page value type");
        });
    });

    it("400: GET /api/articles/:article_id. Invalid id type supplied", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter type provided");
        });
    });

    it("404: GET /api/articles. Non-existant topic supplied.", () => {
      return request(app)
        .get("/api/articles?topic=capybaras")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No Articles Found");
        });
    });

    it("400: GET /api/articles. Bad sort_by string.", () => {
      return request(app)
        .get("/api/articles?sort_by=capybaras")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: sort by");
        });
    });

    it("400: GET /api/articles. Bad order string.", () => {
      return request(app)
        .get("/api/articles?order=dave")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: order direction");
        });
    });

    it("400: GET /api/articles. Bad limit value. (20)", () => {
      return request(app)
        .get("/api/articles?limit=dave")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: limit value type");
        });
    });

    it("400: GET /api/articles. Bad page value. (20)", () => {
      return request(app)
        .get("/api/articles?limit=10&p=bob")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: page value type");
        });
    });

    it("404: GET /api/users/:username conceivably they could have a numeric username? ", () => {
      return request(app)
        .get("/api/users/23423") // any, as long as it doesn't exist
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });
  });

  describe("POST Error Handlers", () => {
    it("404: POST /api/articles/:article_id/comments. Article not found on POST new article.", () => {
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

    it("404: POST /api/articles/:article_id/comments. Empty object / no object passed in request.", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });

    it("400: POST /api/articles/:article_id/comments. Empty object 'body' passed in request.", () => {
      const newComment = { username: "rogersop" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("No content provided");
        });
    });

    it("404: POST /api/articles/:article_id/comments. Invalid user provided.", () => {
      const newComment = {
        username: "twsbidiamond580",
        body: "Ich bin keine kartoffel",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });

    it("400: POST /api/articles/:article_id/comments. Invalid type passed as article_id.", () => {
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

    it("404: POST /api/articles/:article_id/comments. No user provided.", () => {
      const newComment = {
        username: "",
        body: "Capybara, Kapibara, Kapivar, Kapübara, Carpincho, Wasserschwein",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });

    it("404: POST /api/articles/ No user provided.", () => {
      const newArticle = {
        author: "",
        title: "Got cats?",
        body: "Something to do with some cats evidently",
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });

    it("400: POST /api/articles/ No title provided.", () => {
      const newArticle = {
        author: "rogersop",
        title: "",
        body: "Something to do with some cats evidently",
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing title");
        });
    });

    it("400: POST /api/articles/ No body provided.", () => {
      const newArticle = {
        author: "rogersop",
        title: "Got cats?",
        body: "",
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing content");
        });
    });

    it("400: POST /api/articles/ No topic provided.", () => {
      const newArticle = {
        author: "rogersop",
        title: "Got cats?",
        body: "Something to do with some cats evidently",
        topic: "",
        article_img_url:
          "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing topic");
        });
    });

    it("404: POST /api/articles/ Empty object OR no content.", () => {
      const newArticle = {};
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found"); // Nothing provided, skip to first missing item
        });
    });

    it("400: POST /api/topics. Slug not provided (22)", () => {
      //      slug: "dogs",
      const newTopic = {
        description: "All things dogs & dog related",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Slug not provided (required)");
        });
    });

    it("400: POST /api/topics. Description not provided (22)", () => {
      const newTopic = {
        slug: "dogs",
        description: "",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Description not provided (required)");
        });
    });

    it("400: POST /api/topics. Topic already exists (22)", () => {
      const newTopic = {
        slug: "cats",
        description: "Something about cats",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Duplicate entry: Key (slug)=(cats) already exists."
          );
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

    /*************** comments */
    it("404: PATCH /api/comments/:comment_id (negative id provided)", () => {
      const updateBody = { inc_votes: 5 };
      return request(app)
        .patch("/api/comments/-4")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type for comment id");
        });
    });

    it("400: PATCH /api/comments/:comment_id (Wrong or non-existent key)", () => {
      const updateBody = { spudulike: 2 };
      return request(app)
        .patch("/api/comments/2")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Object does not contain correct key(s)");
        });
    });

    it("400: PATCH /api/comments/:comment_id (Wrong key value type)", () => {
      const updateBody = { inc_votes: "twelfty" };
      return request(app)
        .patch("/api/comments/2")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid value type in object");
        });
    });

    it("400: PATCH /api/comments/:comment_id (No comment found)", () => {
      const updateBody = { inc_votes: 7 };
      return request(app)
        .patch("/api/comments/99999999")
        .send(updateBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment Not Found");
        });
    });

    it("400: PATCH /api/comments/:comment_id (Bad comment ID provided)", () => {
      const updateBody = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/pasta")
        .send(updateBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter type provided");
        });
    });

    /****************** */
  });

  describe("DELETE Error Handlers", () => {
    it("404: DELETE /api/comments/:comment_id non existent ID", () => {
      return request(app)
        .delete("/api/comments/10000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Cannot find article with ID provided");
        });
    });

    it("400: DELETE /api/comments/:comment_id non valid ID type", () => {
      return request(app)
        .delete("/api/comments/capybara")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid parameter type provided");
        });
    });

    it("400: DELETE /api/articles/:article_id non valid ID type (23)", () => {
      return request(app)
        .delete("/api/articles/tikky")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Article id should be a number");
        });
    });

    it("404: DELETE /api/articles/:article_id no article found (23)", () => {
      return request(app)
        .delete("/api/articles/10990")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Cannot find article with ID provided");
        });
    });

    it("400: DELETE /api/articles/:article_id negative number sent as id (23)", () => {
      return request(app)
        .delete("/api/articles/-23")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid type for article id");
        });
    });
  });
});
