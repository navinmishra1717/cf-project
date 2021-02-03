/*eslint-disable*/
const userServices = require("../../services/user/user.service");
const User = require("../../models/user.model");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

describe("UserService Test Suite", () => {
  describe("Test for get function", () => {
    it("should get all the user in db", async () => {
      const mockData = {
        id: 123,
        name: "navin",
        email: "navin@test.com",
      };
      const mockData1 = {
        id: 456,
        name: "mishra",
        email: "mishra@test.com",
      };
      const userMock = {
        find: function() {
          return {
            skip: function() {
              return {
                limit: function() {
                  return {
                    exec: function() {
                      return [mockData, mockData1];
                    },
                  };
                },
              };
            },
          };
        },
      };
      const users = await userServices.get({}, userMock);
      expect(users[0].name).to.be.eql(mockData.name);
    });
  });
  describe("Test for create function", () => {
    const mockData = {
      name: "navin",
      email: "navin@test.com",
    };
    it("should add a new user to db with given data", async () => {
      // mock a class
      class userFunc {
        constructor() {
          this.user = User;
        }
        async create() {
          return {
            name: "navin",
            email: "navin@test.com",
          };
        }
      }
      const stub = sinon.stub(User, "create").resolves(mockData);
      const user = await userServices.create(mockData, userFunc);
      expect(user.name).to.eql(mockData.name);
      expect(user.email).to.eql(mockData.email);
      stub.restore();
    });
  });
  describe("Test for getOne function", () => {
    it("should get the user with given id", async () => {
      const mockData = {
        id: 123,
        name: "navin",
        email: "navin@test.com",
      };
      const userMock = {
        findOne: function() {
          return {
            exec: function() {
              return mockData;
            },
          };
        },
      };
      const user = await userServices.getOne(mockData.id, userMock);
      expect(user.id).to.eql(mockData.id);
      expect(user.name).to.eql(mockData.name);
    });
  });
});
