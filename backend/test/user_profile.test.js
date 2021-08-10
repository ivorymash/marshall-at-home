const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /user/profile endpoint", () => {
  it("get user profile with JWT", async () => {
    const response = await request
      .get("/user/profile")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6IkplcmVteUxpbTk2QGljaGF0LnNwLmVkdS5zZyIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjg1Mzg4ODh9.tclbiJGs-vsZkBN5K_B1FROoIIFgCWlojl88EoHRNsg`
      );

    const body = response.body[0];
    expect(response.status).to.eql(200);
    expect(body.username, "You might have changed your username").to.eql(
      "Jeremy"
    );
    expect(body.email, "You might have changed your email").to.eql(
      "JeremyLim96@ichat.sp.edu.sg"
    );
    expect(
      body.profile_pic_link,
      "You might have updated a profile picture"
    ).to.eql(
      "https://static.billboard.com/files/media/jeremy-zucker-2018-billboard-1548-compressed.jpg"
    );
  });
});

describe("Testing PUT SUCCESSFUL /user/profile/update endpoint", () => {
  it("update user username with JWT", async () => {
    const response = await request
      .put("/user/profile/update")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6IkplcmVteUxpbTk2QGljaGF0LnNwLmVkdS5zZyIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjg1Mzg4ODh9.tclbiJGs-vsZkBN5K_B1FROoIIFgCWlojl88EoHRNsg`
      )
      .send({
        username: "Jeremy2",
        email: "JeremyLim96@ichat.sp.edu.sg",
        pfp: "https://static.billboard.com/files/media/jeremy-zucker-2018-billboard-1548-compressed.jpg",
      });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username).to.eql("Jeremy2");
    expect(body.id).to.eql(430);
  });

  it("update user email with JWT", async () => {
    const response = await request
      .put("/user/profile/update")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6IkplcmVteUxpbTk2QGljaGF0LnNwLmVkdS5zZyIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjg1Mzg4ODh9.tclbiJGs-vsZkBN5K_B1FROoIIFgCWlojl88EoHRNsg`
      )
      .send({
        username: "Jeremy2",
        email: "Jeremy2@gmail.com",
        pfp: "https://static.billboard.com/files/media/jeremy-zucker-2018-billboard-1548-compressed.jpg",
      });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username).to.eql("Jeremy2");
    expect(body.id).to.eql(430);
  });

  it("update user pfp with JWT", async () => {
    const response = await request
      .put("/user/profile/update")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6IkplcmVteUxpbTk2QGljaGF0LnNwLmVkdS5zZyIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjg1Mzg4ODh9.tclbiJGs-vsZkBN5K_B1FROoIIFgCWlojl88EoHRNsg`
      )
      .send({
        username: "Jeremy2",
        email: "Jeremy2@gmail.com",
        pfp: "https://www.canr.msu.edu/contentAsset/image/9c8f1a21-90e3-486d-9ca0-dd4a7b4b439d/fileAsset/filter/Resize,Jpeg/resize_w/750/jpeg_q/80",
      });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username).to.eql("Jeremy2");
    expect(body.id).to.eql(430);
  });

  it("update all user details with JWT", async () => {
    const response = await request
      .put("/user/profile/update")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6IkplcmVteUxpbTk2QGljaGF0LnNwLmVkdS5zZyIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjg1Mzg4ODh9.tclbiJGs-vsZkBN5K_B1FROoIIFgCWlojl88EoHRNsg`
      )
      .send({
        username: "Jeremy",
        email: "JeremyLim96@ichat.sp.edu.sg",
        pfp: "https://static.billboard.com/files/media/jeremy-zucker-2018-billboard-1548-compressed.jpg",
      });

    const body = response.body;
    expect(response.status).to.eql(202);
    expect(body.username).to.eql("Jeremy");
    expect(body.id).to.eql(430);
  });
});

describe("Testing GET UNSUCCESSFUL /user/profile/ endpoint", () => {
  it("get user profile without JWT", async () => {
    const response = await request.get("/user/profile");

    expect(response.status).to.eql(403);
  });
});

describe("Testing PUT UNSUCCESSFUL /user/profile/update endpoint", () => {
  it("update user username without JWT", async () => {
    const response = await request.put("/user/profile/update").send({
      username: "Jeremy",
      email: "JeremyLim96@ichat.sp.edu.sg",
      pfp: "https://static.billboard.com/files/media/jeremy-zucker-2018-billboard-1548-compressed.jpg",
    });

    expect(response.status).to.eql(403);
  });

  it("update user email without JWT", async () => {
    const response = await request.put("/user/profile/update").send({
      username: "Jeremy",
      email: "Jeremy2@gmail.com",
      pfp: "https://static.billboard.com/files/media/jeremy-zucker-2018-billboard-1548-compressed.jpg",
    });

    expect(response.status).to.eql(403);
  });

  it("update user pfp without JWT", async () => {
    const response = await request.put("/user/profile/update").send({
      username: "Jeremy",
      email: "Jeremy2@gmail.com",
      pfp: "https://www.canr.msu.edu/contentAsset/image/9c8f1a21-90e3-486d-9ca0-dd4a7b4b439d/fileAsset/filter/Resize,Jpeg/resize_w/750/jpeg_q/80",
    });

    expect(response.status).to.eql(403);
  });
});

describe("Testing GET SUCCESSFUL /user/profile/history endpoint", () => {
  it("get user history with JWT(empty history)", async () => {
    const response = await request
      .get("/user/profile/history")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6IkplcmVteUxpbTk2QGljaGF0LnNwLmVkdS5zZyIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjg1Mzg4ODh9.tclbiJGs-vsZkBN5K_B1FROoIIFgCWlojl88EoHRNsg`
      );
    const body = response.body;
    expect(response.status).to.eql(200);
    expect(body).to.eql([]).that.is.empty;
  });

  it("get user history with JWT(with history data[Jonny])", async () => {
    const response = await request
      .get("/user/profile/history")
      // ! DO NOT EDIT TOKEN
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJjZTMwMTE2QGdtYWlsLmNvbSIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjc0NTM1NTF9.dVNS0X7PSyLONjG_owUaEzd6ep-g1mihPk9v3bCcMgc`
      );
    const body = response.body;
    expect(response.status).to.eql(200);
    expect(body).to.be.an("array");
    expect(body.length).to.be.a("number");
  });
});

describe("Testing GET UNSUCCESSFUL /user/profile/history endpoint", () => {
  it("get user history without JWT(empty history)", async () => {
    const response = await request.get("/user/profile/history");

    const body = response.body;
    expect(response.status).to.eql(403);
  });

  it("get user history without JWT(with history data[Jonny])", async () => {
    const response = await request.get("/user/profile/history");

    expect(response.status).to.eql(403);
  });
});
