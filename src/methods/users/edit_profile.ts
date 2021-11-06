import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { usersCollection } from "../../collections/users.js";

interface Params {
  phone: string;
}

export const editProfile = sweet({
  method: "POST",
  url: "/edit_profile",
  auth: usersAuth,
  params: {
    name: "string|optional",
  },
  async handler(params: Params, { user_id }) {
    await usersCollection.updateOne(
      { _id: user_id },
      {
        $set: {
          ...params,
        },
      },
    );
  },
});
