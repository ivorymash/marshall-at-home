const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POSTS SUCCESSFUL /user endpoint", () => {
  it("login with the correct credentials as a user", async () => {
    const response = await request
      .post("/user")
      .send({
        email: "JeremyLim96@ichat.sp.edu.sg",
        password: "&FT6J#^y<DwRpwsB",
      });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username, "You might have changed the username").to.eql(
      "Jeremy"
    );
    expect(body.id).to.eql(430);
    expect(body.userType).to.eql(1);
  });

  it("login with the correct credentials as an admin", async () => {
    const response = await request
      .post("/user")
      .send({
        email: "stanley1994@ichat.sp.edu.sg",
        password: "bxP(cgBx7-)2E%'b",
      });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username, "You might have changed the username").to.eql(
      "Stanley"
    );
    expect(body.id).to.eql(446);
    expect(body.userType).to.eql(2);
  });
});

describe("Testing POSTS UNSUCCESSFUL /user endpoint", () => {
  it("get user with incorrect password", async () => {
    const response = await request
      .post("/user")
      .send({ email: "JeremyLim96@ichat.sp.edu.sg", password: "mrsexyBeast" });

    const body = response.body;
    expect(response.status).to.eql(401);
    expect(body.error).to.eql("password is wrong!");
  });

  it("get user with incorrect email(missing'@')", async () => {
    const response = await request
      .post("/user")
      .send({
        email: "JeremyLim96ichat.sp.edu.sg",
        password: "&FT6J#^y<DwRpwsB",
      });

    const body = response.body;
    expect(response.status).to.eql(400);
  });

  it("get user with incorrect email", async () => {
    const response = await request
      .post("/user")
      .send({
        email: "JeremyTanAhBeng@gmail.com",
        password: "&FT6J#^y<DwRpwsB",
      });

    const body = response.body;
    expect(response.status).to.eql(401);
    expect(body.error).to.eql("user does not exist!");
  });
});
