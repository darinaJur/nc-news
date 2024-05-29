const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const request = require("supertest")
const app = require("../app")
const fs = require("fs")


beforeEach(() => { return seed(testData)})
afterAll(() => { return db.end() })

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
describe("GET /api" ,() => {
    test("status: 200, responds with all endpoints and their description", () => {
    const jsonFileData = fs.readFileSync("/Users/darina/Documents/Northcoders/be-nc-news/endpoints.json", "utf-8")

    return request(app)
    .get("/api")
    .expect(200)
    .then((res) => {
    expect(res.body.endpoints).toEqual(JSON.parse(jsonFileData))
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
    test("status: 404, responds with 'The request path does not exist' if the endpoint does not exist", () => {
        return request(app)
        .get("/api/artivles/1")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('The request path does not exist')
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
})