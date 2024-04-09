import { describe, it, expect, jest } from "@jest/globals";

import { SNS } from "./../../src/factories/aws/aws.factory.js";
import { handleSendSMS } from "./../../src/index.js";

describe("Unit Tests", () => {
  it("it should return success when the SNS publish is successful", async () => {
    jest.spyOn(SNS, "publish").mockResolvedValue({ MessageId: "123" });
    const headers = {
      Authorization: "suaChaveDeApiValida",
    };
    const event = {
      body: JSON.stringify({
        message: "Hello, World!",
        phoneNumber: "+5511999999999",
      }),
      headers,
    };
    const response = await handleSendSMS(event);

    const { id } = JSON.parse(response.body);

    expect(SNS.publish).toBeCalledTimes(1);
    expect(id).toStrictEqual("123");
    expect(response.statusCode).toStrictEqual(200);
  });
});
