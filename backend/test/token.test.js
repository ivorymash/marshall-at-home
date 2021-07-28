const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /baka", () => {
  it("get userType with JWT(user)", async () => {
    const response = await request
      .get("/baka")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJjZTMwMTE2QGdtYWlsLmNvbSIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjc0NTM1NTF9.dVNS0X7PSyLONjG_owUaEzd6ep-g1mihPk9v3bCcMgc`
      );

    expect(response.status).to.eql(200);
  });

  it("get userType with JWT(admin)", async () => {
    const response = await request
      .get("/baka")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoiZGFyZWthQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoyLCJpYXQiOjE2Mjc0NTQ1Njd9.CQRE77hQg_LYE25224I4vQbwsf2o0TRsTtdBrF2Thm4`
      );

    expect(response.status).to.eql(200);
  });
});
