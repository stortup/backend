import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { assertAdmin, usersAuth } from "../../authentications/users.js";
import { mentoringRequestsCollection } from "../../collections/mentoring_requests.js";
import { usersCollection } from "../../collections/users.js";

interface Request {
  request_id: string;
}

export const grantMentoringAccess = sweet({
  method: "POST",
  url: "/grant_mentoring_access",
  auth: usersAuth,
  params: {
    request_id: "string",
  },
  async handler(params: Request, { user_id }) {
    const requestId = new ObjectId(params.request_id);
    await assertAdmin(user_id);

    const request = await mentoringRequestsCollection.findOne({
      _id: requestId,
    });

    if (!request) {
      throw new Error("Request not found"); // TODO
    }

    const user = await usersCollection.findOne({
      _id: request.user_id,
    });

    if (!user) {
      throw new Error("User not found"); // TODO
    }

    if (user?.is_mentor) {
      throw new Error("User is already a mentor"); // TODO
    }

    await usersCollection.updateOne(
      {
        _id: request.user_id,
      },
      {
        $set: {
          ...request.params,
          is_mentor: true,
        },
      },
    );

    await mentoringRequestsCollection.deleteOne({
      user_id: request.user_id,
    });
  },
});
