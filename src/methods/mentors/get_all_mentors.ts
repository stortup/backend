import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { usersCollection } from "../../collections/users.js";

export interface ResultMentor {
  id: ObjectId;
  name: string;
  resume: string;
  avatar_url: string;
  bio: string;
  times: ResultTime[];
  hourly_cost: number;
}

export interface ResultTime {
  id: ObjectId;
  start_date: string;
  reserved: boolean;
}

export const getAllMentors = sweet({
  method: "GET",
  url: "/get_all_mentors",
  async handler(): Promise<ResultMentor[]> {
    const page = 0;
    const result = await usersCollection
      .aggregate([
        { $match: { is_mentor: true } },
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
            id: 1,
            name: 1,
            resume: 1,
            avatar_url: 1,
            bio: 1,
            times: 1,
            hourly_cost: 1,
          },
        },
      ])
      .limit(20)
      .skip(page * 20)
      .toArray() as any[];

    return result.map(mentorToView);
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
