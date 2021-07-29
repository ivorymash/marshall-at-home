const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /article/sidebar endpoint", () => {
  it("retrieve contents of article", async () => {
    const response = await request.get("/article/sidebar");

    expect(response.status).to.eql(200);
    expect(response.body, "You've probably changed the way data is returned").to.be.an("array");
    expect(response.body, "Might have removed some articles hence failure.\nEither remove this expect or add back that article").to.deep.include(
      {
        id: 5,
        title: "言って。",
      },
      {
        id: 6,
        title: "Is Liking traps gay?",
      },
      {
        id: 7,
        title: "Is Liking Anime a Sin?",
      },
      {
        id: 8,
        title: "VF20 by playing Apex : This can't be clickbait!",
      },
      {
        id: 11,
        title: "言って。",
      },
      {
        id: 12,
        title: "言って。",
      },
      {
        id: 13,
        title: "言って。",
      },
      {
        id: 14,
        title: "言って。",
      },
      {
        id: 15,
        title: "言って。",
      },
      {
        id: 16,
        title: "bruh",
      },
      {
        id: 17,
        title: "夜に駆ける",
      }
    );
    expect(
      response.body.length,
      "Might have added more articles hence test failed.\nTry commenting out this comment and run test again"
    ).to.eql(11);
  });
});
