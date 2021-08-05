const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POST SUCCESSFUL /server/ip endpoint", () => {
  it("host ip server when VR game starts", async () => {
    const response = await request.post("/server/ip").send({
      ip: "123.123.123.123",
    });

    expect(response.status).to.eql(200);
    expect(response.body, "How did you even mess this up?!").to.eql({}).that.is
      .empty;
  });
});

describe("Testing POST SUCCESSFUL /server/ip/check endpoint", () => {
  it("check if ip exists or expired", async () => {
    const response = await request.post("/server/ip/check").send({
      ip: "123.123.123.123",
    });

    expect(response.status).to.eql(200);
    expect(
      response.body.message,
      "Previous test didn't update the timing of specified ip address.\nDo it manually on Postman then."
    ).to.eql("LETS GO");
  });
});

describe("Testing POST UNSUCCESSFUL /server/ip endpoint", () => {
  it("no ip address is entered", async () => {
    const response = await request.post("/server/ip").send({
      ip: "",
    });

    expect(
      response.status,
      "Someone changed my code.. I don't allow empty ip addresses"
    ).to.eql(400);
  });
});

describe("Testing POST UNSUCCESSFUL /server/ip/check endpoint", () => {
  it("session doesn't exist", async () => {
    const response = await request.post("/server/ip/check").send({
      ip: "123.123",
    });

    expect(
      response.status,
      "If this test fails, this IP address is probably in use."
    ).to.eql(401);
  });

  it("session probably ended", async () => {
    const response = await request.post("/server/ip/check").send({
      ip: "127.0.0.1",
    });

    expect(
      response.status,
      "Session is still fresh; lesser than 20 mins upon updating."
    ).to.eql(401);
  });
});
