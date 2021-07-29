const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POST SUCCESSFUL /quiz/submit endpoint", () => {
  it("submits quiz after completeing it(userid 3)", async () => {
    const response = await request.post("/quiz/submit").send({
      userid: 3,
      totalQuestions: 5,
      correctQuestions: 5,
    });

    expect(response.status).to.eql(200);
  });

  it("submits quiz after completeing it(userid 1)", async () => {
    const response = await request.post("/quiz/submit").send({
      userid: 1,
      totalQuestions: 5,
      correctQuestions: 5,
    });

    expect(response.status).to.eql(200);
  });
});
