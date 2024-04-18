"use strict";

import { DynamoDB, SNS } from "../factories/aws/aws.factory.js";
import { validationRequestSendSMS } from "../utils/validations.utils.js";

async function sendSMS(event) {
  const body = JSON.parse(event?.body || "{}");

  const isValidate = validationRequestSendSMS(body);

  if (isValidate !== "OK") {
    return isValidate;
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
