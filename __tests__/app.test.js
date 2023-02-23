const request = require("supertest");

const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

const app = require("../app.js");

/** Imports & BP above here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET Endpoints", () => {
  
  describe("GET /api/topics (03)", () => {
    // Returns a list of topics (as array of topic objects)
    // Each topic object has properties 'slug' & 'description'
    it("200: Returns an array of objects containing topic & description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3); // some length (count sql rows), arrg, mitch is a user here, run away!
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  describe("GET /api/articles/ (05)", () => {
    //returns an article slected by id
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
            article_id: expect.any(Number), //FIXME: DONE, additional expect article_id to be 2
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
  });

  describe("GET /api/articles/:article_id/comments (06)", () => {
    //returns comments for an article selected by id
    // Has: comment_id, votes, created_at, author, body, article_id. 
    it("200: Returns object with array containing all comments belonging to a specific article id", () => {
      return request(app)
        .get("/api/articles/3/comments") // currently 2 comments
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeInstanceOf(Array); //Array of comment objects
          expect(comments).toHaveLength(2);
          expect(comments).toBeSorted({ key: "created_at", descending: true }); // desc recent first
          // check each obj in array
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(3);
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            });
          });
        });
    });
  });



  describe("GET /api/articles (04)", () => {
    // Returns a list of articles (as array of topic objects)
    // Returns a count of comments belonging to the article as comment_count
    // array is sorted by date, ascending
    it("200: Returns an array of objects containing articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(5);
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
              comment_count: expect.any(String), // Counted comments on join
            });
          });
        });
    });
  });
});

describe("POST Endpoints", () => {
  
  describe("POST: /api/articles/:article_id/comments (07)", () => {
    const newComment = {
      username: 'rogersop',
      body: 'Some new comment for article with id: 3',
    };

    it('Adds a new comment to article, if article exists', () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toBeInstanceOf(Object); //Array of comment objects
          expect(comment.article_id).toBe(3);
          expect(comment.author).toBe('rogersop');
          expect(comment.body).toBe('Some new comment for article with id: 3');
          // extracted some of the properties to be specifics.
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

  /* Ok Beth's bad url is breaking everything, or at least my handling of it is! */
  it("400: Invalid id type supplied to /api/articles/.", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid parameter type provided");
      });
  });

  //* client posts a comment to an article that doesnt exist
  // Already handled in postArtCommentById() with selectArticleById(article_id)
  // It's rejected with error or exists
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

  //client posts a comment to an article id that is not a number
  // Handled in the error handler as per GET /api/articles/banana
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

  // client does a post requests to a valid article but forgets to send any content
  it("400: Empty object / no object passed in request.", () => {
    const newComment = {}; // no 'body' or username, bad username as that's the first check.
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad username");
      });
  });

  // client does a post requests to a valid article but forgets to send content
  it("400: Empty object 'body' passed in request.", () => {
    const newComment = {username: 'rogersop'}; // no 'body', reject with no content
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No content provided");
      });
  });

  // client posts a comment but the username doesn't exist in your database
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

  // client forgets to provide a username
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
