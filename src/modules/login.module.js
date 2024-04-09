"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { DynamoDB } = require("../factories/aws/aws.factory");

async function findUserByUsername(username) {
  const user = await DynamoDB.getItem({
    TableName: "Users",
    Key: {
      username: { S: username },
    },
  });

  if (!user.Item) {
    return null;
  }

  return {
    id: user.Item.id.S,
    username: user.Item.username.S,
    passwordHash: user.Item.passwordHash.S,
  };
}

function generateToken(user) {
  return jwt.sign({ userId: user.id }, "segredoSuperSecreto", {
    expiresIn: "1h",
  });
}

async function login(event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const { username, password } = requestBody;

    const user = await findUserByUsername(username);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Usuário não encontrado" }),
      };
    }

    const passwordIsValid = bcrypt.compareSync(password, user.passwordHash);

    if (!passwordIsValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Senha inválida" }),
      };
    }

    const token = generateToken(user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login bem-sucedido",
        token: token,
      }),
    };
  } catch (error) {
    console.error("Erro no login", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno do servidor" }),
    };
  }
}

exports = { login };
