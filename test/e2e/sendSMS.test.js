import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

import { DynamoDB } from "./../../src/factories/aws/aws.factory.js";
import { handleSendSMS } from "./../../src/index.js";

describe("Testing AWS Servicess offline with LocalStack", () => {
  async function deleteTable() {
    await DynamoDB.deleteTable({
      TableName: "SMS",
    });
  }

  beforeAll(async () => {
    await DynamoDB.createTable({
      TableName: "SMS",
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

  it("it should return an error 400 Invalid input when not body", async () => {
    const expected = { error: "Invalid input" };
    const response = await handleSendSMS(
      {
        body: JSON.stringify({}),
      },
      {}
    );
    const { error } = JSON.parse(response.body);
    expect(error).toStrictEqual(expected.error);
    expect(response.statusCode).toStrictEqual(400);
  });

  it("it should return an error 400 Invalid input when not message", async () => {
    const expected = { error: "Invalid input" };
    const response = await handleSendSMS(
      {
        body: JSON.stringify({ phoneNumber: "+551100000000" }),
      },
      {}
    );
    const { error } = JSON.parse(response.body);
    expect(error).toStrictEqual(expected.error);
    expect(response.statusCode).toStrictEqual(400);
  });

  it("it should return an error 400 Invalid input when not phoneNumber", async () => {
    const expected = { error: "Invalid input" };
    const response = await handleSendSMS(
      {
        body: JSON.stringify({ message: "Hello World" }),
      },
      {}
    );
    const { error } = JSON.parse(response.body);
    expect(error).toStrictEqual(expected.error);
    expect(response.statusCode).toStrictEqual(400);
  });

  it("it should return an error 400 Invalid message length when message is less than 3 characters", async () => {
    const expected = { error: "Invalid message length" };
    const response = await handleSendSMS(
      {
        body: JSON.stringify({ message: "Hi", phoneNumber: "+551100000000" }),
      },
      {}
    );
    const { error } = JSON.parse(response.body);
    expect(error).toStrictEqual(expected.error);
    expect(response.statusCode).toStrictEqual(400);
  });

  it("it should return an error 400 Invalid message length when message is more than 160 characters", async () => {
    const expected = { error: "Invalid message length" };
    const response = await handleSendSMS(
      {
        body: JSON.stringify({
          message: "a".repeat(161),
          phoneNumber: "+551100000000",
        }),
      },
      {}
    );
    const { error } = JSON.parse(response.body);
    expect(error).toStrictEqual(expected.error);
    expect(response.statusCode).toStrictEqual(400);
  });

  it("it should return an error 400 Invalid phone number format when phone number is invalid", async () => {
    const expected = { error: "Invalid phone number format" };
    const response = await handleSendSMS(
      {
        body: JSON.stringify({ message: "Hello World", phoneNumber: "123" }),
      },
      {}
    );
    const { error } = JSON.parse(response.body);
    expect(error).toStrictEqual(expected.error);
    expect(response.statusCode).toStrictEqual(400);
  });

  it("it should return an success 200 when phone number and message is valid", async () => {
    const response = await handleSendSMS(
      {
        body: JSON.stringify({
          message: "Hello World",
          phoneNumber: "+551100000000",
        }),
      },
      {}
    );
    const { status } = JSON.parse(response.body);
    expect(status).toStrictEqual("SMS sent");
    expect(response.statusCode).toStrictEqual(200);
  });
});
