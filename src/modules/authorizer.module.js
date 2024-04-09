"use strict";

async function authorizer(event, context) {
  console.log("Evento recebido:", JSON.stringify(event, null, 2));
  const token =
    event.headers["Authorization"] || event.headers["authorization"];

  if (token === "suaChaveDeApiValida") {
    return generatePolicy("user", "Allow", event.routeArn);
  } else {
    return generatePolicy("user", "Deny", event.routeArn);
  }
}

function generatePolicy(principalId, effect, resource) {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export { authorizer };
