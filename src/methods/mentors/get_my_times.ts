import createError from "fastify-error";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { usersAuth } from "../../authentications/users.js";
import { timesCollection } from "../../collections/times.js";
import { usersCollection } from "../../collections/users.js";

const UNAUTHORIZED = createError("FORBIDDEN", "user is not mentor", 403);

export const getMyTimes = sweet({
  method: "GET",
  url: "/get_my_times",
  auth: usersAuth,
  async handler(body, { user_id }) {
    const user = await usersCollection.findOne({
      _id: user_id,
      is_mentor: true,
    });

    if (!user) {
      throw new UNAUTHORIZED();
    }

    const timeDocument = await timesCollection.findOne({
      _id: user_id,
    });

    if (!timeDocument) return [];

    return timeDocument.times.map(toView);
  },
});
