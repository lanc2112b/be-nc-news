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
  describe("/api/topics (03)", () => {
    // Returns a list of topics (as array of topic objects)
    // Each topic object has properties 'slug' & 'description'
    it("200: Returns an array of objects containing topic & description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          //console.log(topics);
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
});
