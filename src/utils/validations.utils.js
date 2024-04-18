import { phoneNumberRegex } from "../utils/regex.utils.js";

function validationRequestSendSMS(data) {
  if (
    typeof data?.message !== "string" ||
    typeof data?.phoneNumber !== "string"
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid input" }),
    };
  }

  if (data?.message?.length < 3 || data?.message?.length > 160) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid message length" }),
    };
  }

  if (!phoneNumberRegex.test(data.phoneNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid phone number format" }),
    };
  }

  return 'OK'
}

export { validationRequestSendSMS };