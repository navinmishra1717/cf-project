/*eslint-disable*/
const userServices = require("../../services/user/user.service");
const User = require("../../models/user.model");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

describe("UserService Test Suite", () => {
  const mockData = {
    name: "navin",
    email: "navin@test.com",
  };
  describe("Test for create function", () => {
    it("should add a new user to db with given data", async () => {
      const userFunc = {
        create: function() {
          return mockData;
        },
      };
      const stub = sinon.stub(User, "create").resolves(mockData);
      const user = await userServices.create(mockData, {
        model: userFunc,
        mode: "test",
      });
      expect(user.name).to.eql(mockData.name);
      expect(user.email).to.eql(mockData.email);
      stub.restore();
    });
  });
});
