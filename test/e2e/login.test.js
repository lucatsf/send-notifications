import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import { DynamoDB } from "./../../src/factories/aws/aws.factory.js";
import { handleLogin } from "./../../src/index.js";

describe("Testing AWS Servicess offline with LocalStack", () => {
  async function deleteTable() {
    await DynamoDB.deleteTable({
      TableName: "USERS",
    });
  }

  async function createUser() {
    
  }

  beforeAll(async () => {
    await DynamoDB.createTable({
      TableName: "USERS",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });
  });

  afterAll(async () => {
    await deleteTable();
  });

  it("it should return an error 400 Invalid input when incorrect password", async () => {
    const event = {
      body: JSON.stringify({
        username: "admin",
        password: "admin",
      }),
    };

    const response = await handleLogin(event);

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({
      message: "Senha inválida",
    });
  });
});
