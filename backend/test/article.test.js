const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing POST SUCCESSFUL /article endpoint", () => {
  it("retrieve contents of article(id 5)", async () => {
    const response = await request.post("/article").send({
      id: 5,
    });

    expect(response.status).to.eql(200);
    expect(
      response.body[0],
      "You might have removed it hence the failed test"
    ).to.eql({
      id: 5,
      authorid: "1",
      videolink:
        "https://www.youtube.com/watch?v=F64yFFnZfkI&list=RDVkhEnvIy0yU&index=3",
      title: "言って。",
      content: "あのね, \n わたし \n ずっと実は \n 築いてるね",
    });
  });

  it("retrieve contents of article(id 7)", async () => {
    const response = await request.post("/article").send({
      id: 7,
    });

    expect(response.status).to.eql(200);
    expect(
      response.body[0],
      "You might have removed it hence the failed test"
    ).to.eql({
      id: 7,
      authorid: "2",
      videolink: "https://www.youtube.com/watch?v=lz5yiVBtPvs",
      title: "Is Liking Anime a Sin?",
      content:
        "Hey, vsauce here, \n is anime a sin? \n Not really lmao but here is a nhentai link have fun",
    });
  });
});

describe("Testing POST UNSUCCESSFUL /article endpoint", () => {
  it("retrieve empty contents of articles invalid id", async () => {
    const response = await request.post("/article").send({
      id: 918304913,
    });;

    expect(response.status).to.eql(200);
    expect(response.body).to.eql([]).that.is.empty;
  });

  it("retrieve empty contents of article that does not exist", async () => {
    const response = await request.post("/article");

    expect(response.status).to.eql(200);
    expect(response.body).to.eql([]).that.is.empty;
  });
});
