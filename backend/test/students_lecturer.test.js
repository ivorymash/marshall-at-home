const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POST SUCCESSFUL /students/lecturer/** endpoint", () => {
  it("add new student to lecturer with JWT(admin only)", async () => {
    const response = await request
      .post("/students/lecturer/update")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoiZGFyZWthQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoyLCJpYXQiOjE2Mjc0NTQ1Njd9.CQRE77hQg_LYE25224I4vQbwsf2o0TRsTtdBrF2Thm4`
      )
      .send({ studentID: 4 });

    const result = response.body.result;
    expect(response.status).to.eql(202);
    expect(
      result,
      "You might have changed the response message in your html file"
    ).to.eql("Added student 4");
  });

  it("remove student from lecturer with JWT(admin only)", async () => {
    const response = await request
      .post("/students/lecturer/remove")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoiZGFyZWthQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoyLCJpYXQiOjE2Mjc0NTQ1Njd9.CQRE77hQg_LYE25224I4vQbwsf2o0TRsTtdBrF2Thm4`
      )
      .send({ studentID: 4 });

    const result = response.body.result;
    expect(response.status).to.eql(202);
    expect(
      result,
      "You might have changed the response message in your html file"
    ).to.eql("Removed student 4");
  });
});

describe("Testing POST UNSUCCESSFUL /students/lecturer/** endpoint", () => {
  it("add new student to lecturer without JWT", async () => {
    const response = await request
      .post("/students/lecturer/update")
      .send({ studentID: 4 });

    expect(response.status).to.eql(403);
  });

  it("remove student from lecturer without JWT", async () => {
    const response = await request
      .post("/students/lecturer/remove")
      .send({ studentID: 4 });
    expect(response.status).to.eql(403);
  });
});
