// /*eslint-disable */

const userHandler = require("../../handlers/user/user.handler");
const userService = require("../../services/user/user.service");
const { expect } = require("chai");
const sinon = require("sinon");
const httpMocks = require("node-mocks-http");

describe("User handler test suite", () => {
  describe("Test for createUser", () => {
    it("should return created user with given data", async () => {
      const mockData = {
        name: "navin",
        email: "navin@test.com",
      };
      const userServiceFunc = {
        create: function() {
          return mockData;
        },
      };
      const mockRequest = httpMocks.createRequest({
        method: "POST",
        url: "/users",
        mockFunction: userServiceFunc,
        body: {
          name: "navin",
          email: "navin@test.com",
        },
      });

      const res = {
        status: function() {
          return {
            json: function() {
              return mockData;
            },
          };
        },
      };

      const stub = sinon.stub(userService, "create").returns(mockData);
      const newUser = await userHandler.createUser(mockRequest, res);
      expect(newUser.name).to.eql(mockData.name);
      expect(newUser.email).to.eql(mockData.email);
      stub.restore();
    });
  });
});
