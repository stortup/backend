import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { coursesCollection, Episode } from "../../collections/courses.js";

interface Params {
  course_id: string;
}

export const getCourse = sweet({
  method: "GET",
  url: "/get_course",
  params: {
    course_id: "string",
  },
  async handler({ course_id }: Params) {
    const results = await coursesCollection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(course_id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $set: {
            creator: {
              $first: "$creator",
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            creator: {
              _id: 1,
              name: 1,
              bio: 1,
            },
            episodes: 1,
          },
        },
      ])
      .toArray() as {
        _id: ObjectId;
        title: string;
        description: string;
        creator: {
          _id: ObjectId;
          name: string;
          bio: string;
        };
        episodes: Episode[];
      }[];

    const result = results[0];
    if (!result) return null;

    return toView({
      ...result,
      creator: toView(result.creator),
    });
  },
});
