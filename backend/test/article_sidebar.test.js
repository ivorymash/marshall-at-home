const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /article/sidebar endpoint", () => {
  it("retrieve contents of article as a sidebar", async () => {
    const response = await request.get("/article/sidebar");

    expect(response.status).to.eql(200);
    expect(
      response.body,
      "You've probably changed the way data is returned"
    ).to.be.an("array");
    expect(
      response.body,
      "Might have removed some articles hence failure.\nEither remove this expect or add back that article"
    ).to.deep.include(
      {
        id: 20,
        title: "Introduction to Airplane Marshalling",
      },
      {
        id: 21,
        title: "Basic Marshalling Signals",
      },
      {
        id: 22,
        title: "Aircraft servicing",
      },
      {
        id: 23,
        title: "Ground Safety Training",
      }
    );
    expect(
      response.body.length,
      "Might have added more articles hence test failed.\nTry commenting out this comment and run test again"
    ).to.eql(4);
  });
});
