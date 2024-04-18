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

  const phoneNumberRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/;

  if (!phoneNumberRegex.test(data.phoneNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid phone number format" }),
    };
  }

  return 'OK'
}

export { validationRequestSendSMS };