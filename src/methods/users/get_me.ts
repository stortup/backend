import { sweet } from "sweet-fastify";
import createError from "fastify-error";
import { usersAuth } from "../../authentications/users.js";
import { usersCollection } from "../../collections/users.js";
import { toView } from "../../../utils.js";

interface Params {
  phone: string;
}

const USER_NOT_FOUND = createError("USER_NOT_FOUND", "User not found", 404);

export const getMe = sweet({
  method: "GET",
  url: "/get_me",
  auth: usersAuth,
  async handler(params: Params, { user_id }) {
    const user = await usersCollection.findOne({ _id: user_id });
    if (!user) {
      throw USER_NOT_FOUND();
    }

    return toView(user);
  },
});
