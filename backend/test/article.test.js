const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POST SUCCESSFUL /article endpoint", () => {
  it("retrieve contents of article(id 20)", async () => {
    const response = await request.post("/article").send({
      id: 20,
    });

    expect(response.status).to.eql(200);
    expect(
      response.body[0],
      "You might have removed it hence the failed test"
    ).to.eql({
      id: 20,
      authorid: "3",
      videolink: "https://www.youtube.com/watch?v=CBdWeKrbtJo",
      title: "Introduction to Airplane Marshalling",
      content:
        "Airplane Marshalling is is visual signalling between ground personnel and pilots on an airport, aircraft carrier or helipad. In this video you will look at an example of someone marshalling a Boeing-747-8F",
    });
  });

  it("retrieve contents of article(id 21)", async () => {
    const response = await request.post("/article").send({
      id: 21,
    });

    expect(response.status).to.eql(200);
    expect(
      response.body[0],
      "You might have removed it hence the failed test"
    ).to.eql({
      id: 21,
      authorid: "3",
      videolink:
        "https://www.youtube.com/watch?v=7siioLHPigg&ab_channel=AirSafetyInstitute",
      title: "Basic Marshalling Signals",
      content:
        "In this video you will learn the basic marshalling signals that would need as a marshaller, or simply to brush up your knowledge. Checkout this video and taxi into your next FBO or fly-in with more confidence!",
    });
  });
});

describe("Testing POST UNSUCCESSFUL /article endpoint", () => {
  it("retrieve empty contents of articles invalid id", async () => {
    const response = await request.post("/article").send({
      id: 918304913,
    });

    expect(response.status).to.eql(200);
    expect(response.body).to.eql([]).that.is.empty;
  });

  it("retrieve empty contents of article that does not exist", async () => {
    const response = await request.post("/article");

    expect(response.status).to.eql(200);
    expect(response.body).to.eql([]).that.is.empty;
  });
});
