import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { usersCollection } from "../../collections/users.js";

interface Params {
  name?: string;
  phone?: string;
  resume?: string;
}

export const editProfile = sweet({
  method: "POST",
  url: "/edit_profile",
  auth: usersAuth,
  params: {
    name: "string|optional",
    phone: "email|optional",
    resume: "string|optional",
  },
  async handler(params: Params, { user_id }) {
    const user = await usersCollection.findOne({ _id: user_id });

    if (!user?.is_mentor) {
      delete params.resume;
    }

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
