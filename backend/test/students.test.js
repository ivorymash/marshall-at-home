const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /students endpoint", () => {
  it("get all students with JWT(admin only)", async () => {
    const response = await request
      .get("/students")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoiZGFyZWthQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoyLCJpYXQiOjE2Mjc0NTQ1Njd9.CQRE77hQg_LYE25224I4vQbwsf2o0TRsTtdBrF2Thm4`
      );

    const body = response.body;
    expect(response.status).to.eql(200);
    expect(body).to.be.an("array");
    expect(body.length).to.be.a("number");
    expect(body[0 && 1]).to.include(
      {
        id: 1,
        username: "salieri",
        email: "steins@gate",
        profile_pic_link:
          "https://64.media.tumblr.com/830a8da8fd117b70cb7391c7a977ab91/tumblr_pfguhcEida1sx8ybdo6_400.png",
        supervisor_id: 15,
        lecturer_name: "annoying lecturer",
      },
      {
        id: 3,
        username: "Jonny",
        email: "ce30116@gmail.com",
        profile_pic_link:
          "https:images-na.ssl-images-amazon.com/images/I/518QdtLUH-L._AC_.jpg",
        supervisor_id: 15,
        lecturer_name: "annoying lecturer",
      }
    );
  });
});

describe("Testing POST SUCCESSFUL /students/myStudents endpoint", () => {
  it("get my students with JWT(admin only)", async () => {
    const response = await request
      .post("/students/myStudents")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoiZGFyZWthQGdtYWlsLmNvbSIsInVzZXJUeXBlIjoyLCJpYXQiOjE2Mjc0NTQ1Njd9.CQRE77hQg_LYE25224I4vQbwsf2o0TRsTtdBrF2Thm4`
      );

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body).to.be.an("array");
    expect(body.length).to.be.a("number");
    expect(body[0 && 1]).to.include(
      {
        id: 1,
        username: "salieri",
        email: "steins@gate",
        profile_pic_link:
          "https://64.media.tumblr.com/830a8da8fd117b70cb7391c7a977ab91/tumblr_pfguhcEida1sx8ybdo6_400.png",
      },
      {
        id: 3,
        username: "Jonny",
        email: "ce30116@gmail.com",
        profile_pic_link:
          "https:images-na.ssl-images-amazon.com/images/I/518QdtLUH-L._AC_.jpg",
      }
    );
  });
});

describe("Testing GET UNSUCCESSFUL /students endpoint", () => {
  it("get all students without JWT", async () => {
    const response = await request.get("/students");

    expect(response.status).to.eql(403);
  });
});

describe("Testing POST UNSUCCESSFUL /students/myStudents endpoint", () => {
  it("get my students without JWT", async () => {
    const response = await request.post("/students/myStudents");

    expect(response.status).to.eql(403);
  });
});
