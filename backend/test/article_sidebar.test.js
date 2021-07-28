const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /article/sidebar endpoint", () => {
  it("retrieve contents of article", async () => {
    const response = await request.get("/article/sidebar");

    expect(response.status).to.eql(200);
    expect(response.body.length).to.eql(11);
  });
});
