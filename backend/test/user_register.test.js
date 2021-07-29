const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

// Comment in at the end
// ! MAKE SURE TO CHANGE EMAIL AFTER EACH TEST TO ENSURE TESTING IS SUCCESSFUL
describe("Testing POSTS SUCCESSFUL /user/create endpoint", () => {
  it("creates user with email, password, username and usertype", async () => {
    var randomNumber = Math.floor(Math.random() * 934823);
    const response = await request.post("/user/create").send({
      username: "testing2",
      password: "mrsexy",
      email: `sexybeast${randomNumber}@gmail.com`,
      userType: 1
    });

    expect(response.status, "Very little chance but the account exist in the database already.\nRerun the test and it will pass").to.eql(201);
  });
});

describe("Testing POSTS UNSUCCESSFUL /user/create endpoint", () => {
  it("registering with null fields", async () => {
    const response = await request.post("/user/create").send({
      username: "",
      password: "",
      email: "",
      userType: 1,
    });

    expect(response.status).to.eql(400);
  });

  it("registering with xss attack in username field", async () => {
    const response = await request.post("/user/create").send({
      username: "<xss onafterscriptexecute=alert(1)><script>1</script>",
      password: "mrsexy",
      email: "sexybeast2gmail.com",
      userType: 1,
    });

    expect(response.status).to.eql(400);
  });

  it("registering with xss attack in email field", async () => {
    const response = await request.post("/user/create").send({
      username: "testing2",
      password: "mrsexy",
      email: "<xss onafterscriptexecute=alert(1)><script>1</script>",
      userType: 1,
    });

    expect(response.status).to.eql(400);
  });

  it("registering with existing email in database", async () => {
    const response = await request.post("/user/create").send({
      username: "testing2",
      password: "mrsexy",
      email: "sexybeast2@gmail.com",
      userType: 1,
    });

    expect(response.status).to.eql(401);
    expect(response.body.message, "You might have deleted the account that's being used for testing lol").to.eql("email already exists!");
  });

  it("registering with invalid email", async () => {
    const response = await request.post("/user/create").send({
      username: "testing2",
      password: "mrsexy",
      email: "sexybeast2gmail.com",
      userType: 1,
    });

    expect(response.status).to.eql(400);
  });
});
