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