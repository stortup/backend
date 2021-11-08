import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { assertAdmin, usersAuth } from "../../authentications/users.js";
import { mentoringRequestsCollection } from "../../collections/mentoring_requests.js";

interface Params {
  request_id: string;
}

export const rejectMentoringAccess = sweet({
  method: "POST",
  url: "/reject_mentoring_access",
  auth: usersAuth,
  params: {
    request_id: "string",
  },
  async handler(params: Params, { user_id }) {
    await assertAdmin(user_id);

    await mentoringRequestsCollection.deleteOne({
      _id: new ObjectId(params.request_id),
    });
  },
});
