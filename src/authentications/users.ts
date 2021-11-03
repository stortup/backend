import { ObjectId } from "mongodb";
import { authDataSymbol, SweetAuth } from "sweet-fastify";
import { TokenDocument, tokensCollection } from "../collections/tokens.js";
import { INVALID_JWT, NO_AUTH_HEADER } from "./errors.js";

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
