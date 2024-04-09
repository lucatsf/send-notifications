"use strict";

import { DynamoDB, SNS } from "../factories/aws/aws.factory.js";

async function sendSMS(event) {
  const body = JSON.parse(event?.body || "{}");

  if (
    typeof body?.message !== "string" ||
    typeof body?.phoneNumber !== "string"
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid input" }),
    };
  }

  if (body?.message?.length < 3 || body?.message?.length > 160) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid message length" }),
    };
  }

  const phoneNumberRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/;

  if (!phoneNumberRegex.test(body.phoneNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid phone number format" }),
    };
  }

  const params = {
    Message: body.message,
    PhoneNumber: body.phoneNumber,
  };

  const result = await SNS.publish(params);
  const status = result["$metadata"]?.httpStatusCode === 200 ? "SENT" : "FAILED";

  await DynamoDB.putItem({
    TableName: "SMS",
    Item: {
      id: { S: result.MessageId },
      phoneNumber: { S: params.PhoneNumber },
      message: { S: params.Message },
      status: { S: status },
      time: { S: new Date().toISOString() },
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        status: "SMS sent",
        id: result?.MessageId,
      },
      null,
      2
    ),
  };
}

export { sendSMS };
