import { ObjectId } from "mongodb";
import { authDataSymbol, SweetAuth } from "sweet-fastify";
import { TokenDocument, tokensCollection } from "../collections/tokens.js";
import { usersCollection } from "../collections/users.js";
import { FORBIDDEN, INVALID_JWT, NO_AUTH_HEADER } from "./errors.js";

export const usersAuth: SweetAuth<TokenDocument> = async (req, rep) => {
  const authValue = req.headers["authorization"];
  if (!authValue || !authValue.startsWith("Bearer ")) {
    throw new NO_AUTH_HEADER();
  }

  const accessToken = authValue.slice(7);

  const token = await tokensCollection.findOne({
    _id: new ObjectId(accessToken),
  });

  if (!token) {
    throw new INVALID_JWT();
  }

  req[authDataSymbol] = token;
};

export const mentorsAuth: SweetAuth<TokenDocument> = async (req, rep) => {
  const authValue = req.headers["authorization"];
  if (!authValue || !authValue.startsWith("Bearer ")) {
    throw new NO_AUTH_HEADER();
  }

  const accessToken = authValue.slice(7);

  const token = await tokensCollection.findOne({
    _id: new ObjectId(accessToken),
  });

  if (!token) {
    throw new INVALID_JWT();
  }

  req[authDataSymbol] = token;
};

export async function assertAdmin(userId: ObjectId) {
  const user = await usersCollection.findOne({
    _id: userId,
  });

  if (user?.is_admin) return user;
  throw new FORBIDDEN();
}
