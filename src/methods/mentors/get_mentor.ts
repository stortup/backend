import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { usersCollection } from "../../collections/users.js";

export const getMentor = sweet({
  method: "GET",
  url: "/get_mentor",
  params: {
    mentor_id: { type: "string" },
  },
  async handler({ mentor_id }) {
    const result: any = await usersCollection
      .aggregate([
        { $match: { _id: new ObjectId(mentor_id), is_mentor: true } },
        {
          $lookup: {
            from: "times",
            localField: "_id",
            foreignField: "_id",
            as: "lookup_result",
          },
        },
        {
          $set: {
            times: {
              $first: "$lookup_result.times",
            },
          },
        },
        {
          $project: {
            lookup_result: 0,
          },
        },
      ])
      .toArray();

    if (!result[0]) return null;
    return mentorToView(result[0]);
  },
});

function mentorToView(d: any) {
  const view = toView(d) as any;
  view.times = view.times.map((time: any) => {
    const d = toView(time) as any;
    return d;
  });

  return view;
}