const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const request = require("supertest")
const app = require("../app")
const endpointDataJson = require("../endpoints.json")


beforeEach(() => { return seed(testData)})
afterAll(() => { return db.end() })

describe("GET /api" ,() => {
    test("status: 200, responds with all endpoints and their description", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then((res) => {
    expect(res.body.endpointData).toEqual(endpointDataJson)
    })
    })
})

describe("GET /api/topics", () => {
    test("status: 200, responds with an array of topics with properties of slug and description", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
            expect(res.body.topics).toHaveLength(3)
            res.body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("status: 200, responds with an article of a specific ID from the GET request", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
            expect(res.body).toMatchObject( {
                article: {
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                }
            })
        })
    })
    test("status: 404, responds with 'Article not found', when the article ID does not exist", () => {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Article not found')
        })
    })
    test("status 400: responds with 'Invalid input', when the article ID is not of valid type", () => {
        return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid Input')
        })
    })
})

describe("GET /api/non-existing-endpoint", () => {
    test("status 404: responds with 'The request path does not exist' if the endpoint does not exist", () => {
        return request(app)
        .get("/api/artivles/1")
        .expect(404)
        .then((res) => {
        expect(res.body.msg).toBe('The request path does not exist')
    })
    })
    test("status 404: responds with 'The request path does not exist' if the endpoint does not exist", () => {
        return request(app)
        .get("/api/artibles")
        .expect(404)
        .then((res) => {
        expect(res.body.msg).toBe('The request path does not exist')
    })
    })
    test("status 404: responds with 'The request path does not exist' if the endpoint does not exist", () => {
        return request(app)
        .get("/api/articles/1/commentzz")
        .expect(404)
        .then((res) => {
        expect(res.body.msg).toBe('The request path does not exist')
        })
    })
})

describe("GET /api/articles", () => {
    test("status 200: responds with all articles with properties of author, title, article_id, topc, created_at, votes, article_img_url and comment_count", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
            res.body.articles.forEach((article) => {
                expect(article).toMatchObject( {
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
            expect(res.body.articles).toBeSortedBy('created_at', { descending: true })
        })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("status 200: responds with all comments for a specified article", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
            res.body.comments.forEach((comment) => {
                expect(comment).toMatchObject( {
                   comment_id: expect.any(Number),
                   votes: expect.any(Number),
                   created_at: expect.any(String),
                   author: expect.any(String),
                   body: expect.any(String),
                   article_id: expect.any(Number)
                })
            })
            expect(res.body.comments).toBeSortedBy('created_at', { descending: true })
        })
    })
    test.only("status 200: responds with an empty array when requested with a valid article ID but article has no comments", () => {
        return request(app)
        .get("/api/articles/11/comments")
        .expect(200)
        .then((res) => {
            expect(res.body.comments).toEqual([])
        })
    })
    test("status 400: responds with 'Invalid input', when the article ID is not of valid type and comments cannot be selected", () => {
        return request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid Input')
    })
    })
    test("status 404: responds with 'Article not found', when the article ID does not exist", () => {
        return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Article not found and comments are unavailable')
        })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("status 201: responds with a new comment", () => {
        const requestBody = {
            username: "butter_bridge",
            body: "Crumpets with butter are my favourite!"
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(requestBody)
        .expect(201)
        .then((res) => {
            expect(res.body.comment).toMatchObject(  {
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: "butter_bridge",
                body: "Crumpets with butter are my favourite!",
                article_id: expect.any(Number)
            })
        })
    })
    test("status 400: responds with 'Cannot post empty comment', when body is empty", () => {
        const requestBody = {
            username: "butter_bridge",
            body: ""
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(requestBody)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Cannot post empty comment')
        })
    })
    test("status 400: responds with 'This user does not exist', when user is not in the database", () => {
        const requestBody = {
            username: "potato_king",
            body: "Hello world!"
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(requestBody)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('This user does not exist')
        })
    })
    test("status 400: responds with 'Invalid input', when the article ID is not of valid type and comment cannot be posted", () => {
        return request(app)
        .post("/api/articles/notAnId/comments")
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid Input')
    })
    })
    test("status: 404, responds with 'Article not found', when the article ID does not exist", () => {
        return request(app)
        .post("/api/articles/99999/comments")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Article not found and comment cannot be posted')
        })
    })
})