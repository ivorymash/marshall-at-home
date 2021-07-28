const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POSTS SUCCESSFUL /user endpoint", () => {
  it("login with the correct credentials as a user", async () => {
    const response = await request
      .post("/user")
      .send({ email: "testingsubjectUser@gmail.com", password: "mrsexy" });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username).to.eql("testingSubjectUser");
    expect(body.id).to.eql(67);
    expect(body.userType).to.eql(1);
  });

  it("login with the correct credentials as an admin", async () => {
    const response = await request
      .post("/user")
      .send({ email: "testingsubjectAdmin@gmail.com", password: "mrsexy" });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username).to.eql("testingSubjectAdmin");
    expect(body.id).to.eql(68);
    expect(body.userType).to.eql(2);
  });
});

describe("Testing POSTS UNSUCCESSFUL /user endpoint", () => {
  it("get user with incorrect password", async () => {
    const response = await request
      .post("/user")
      .send({ email: "testingsubjectUser@gmail.com", password: "mrsexyBeast" });

    const body = response.body;
    expect(response.status).to.eql(401);
    expect(body.error).to.eql("password is wrong!");
  });

  it("get user with incorrect email(missing'@')", async () => {
    const response = await request
      .post("/user")
      .send({ email: "testingsubjectUsergmail.com", password: "mrsexy" });

    const body = response.body;
    expect(response.status).to.eql(400);
  });

  it("get user with incorrect email", async () => {
    const response = await request
      .post("/user")
      .send({ email: "testingsubject@gmail.com", password: "mrsexy" });

    const body = response.body;
    expect(response.status).to.eql(401);
    expect(body.error).to.eql("user does not exist!");
  });
});
