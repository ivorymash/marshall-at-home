const expect = require("chai").expect;
const app = require("../app");

describe("Testing function verifyJWT()", () => {
  it("verifies that the JWT is decoded correctly", async () => {
    // ! DO NOT EDIT TOKEN
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJjZTMwMTE2QGdtYWlsLmNvbSIsInVzZXJUeXBlIjoxLCJpYXQiOjE2Mjc0NTM1NTF9.dVNS0X7PSyLONjG_owUaEzd6ep-g1mihPk9v3bCcMgc";
    const decoded = await app.verifyJWT(token);

    expect(decoded, "You might have changed the user details").to.deep.equal({
      id: 3,
      email: "ce30116@gmail.com",
      userType: 1,
      iat: 1627453551,
    });
  });
});

describe("Testing function generateAccessToken()", () => {
  it("generates JWT correctly", async () => {
    const id = 3;
    const email = "ce30116@gmail.com";
    const userType = 1;
    const token = await app.generateAccessToken(id, email, userType);

    expect(token, "It has to be a string lol no choice").to.be.a("string");
  });
});
