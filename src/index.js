"use strict";

import { authorizer } from "./modules/authorizer.module.js";
import { sendSMS } from "./modules/sms.module.js";
import { login } from "./modules/login.module.js";

async function handleAuthorizer(event, context) {
  return authorizer(event, context);
}

async function handleLogin(event) {
  return login(event);
}

async function handleSendSMS(event) {
  return sendSMS(event);
}

export { handleLogin, handleSendSMS, handleAuthorizer };
