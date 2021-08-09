const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POST SUCCESSFUL /quiz/submit endpoint", () => {
  it("submits quiz after completeing it(Jonny)", async () => {
    const response = await request
      .post("/quiz/submit")
      .send({
        totalQuestions: 5,
        correctQuestions: 5,
      })
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJjZTMwMTE2QGdtYWlsLmNvbSIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjc0NTM1NTF9.dVNS0X7PSyLONjG_owUaEzd6ep-g1mihPk9v3bCcMgc`
      );

    expect(response.status).to.eql(200);
  });
});
