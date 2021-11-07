import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { meetsCollection } from "../../collections/meets.js";
import { Mentor, User } from "../../collections/users.js";

type Result = {
  id: ObjectId;
  date: Date;
  duration: number;
  peer: {
    id: ObjectId;
    name: string;
    bio: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}[];

export const getMyMeets = sweet({
  method: "GET",
  url: "/get_my_meets",
  auth: usersAuth,
  async handler(body, { user_id }) {
    const meetDocs = await meetsCollection.aggregate([
      {
        $match: {
          $or: [
            {
              mentor_id: user_id,
            },
            {
              user_id: user_id,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mentor_id",
          foreignField: "_id",
          as: "mentor",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $set: {
          user: { $first: "$user" },
          mentor: { $first: "$mentor" },
        },
      },
    ]).toArray() as {
      _id: ObjectId;
      date: Date;
      duration: number;
      user: User;
      mentor: Mentor;
    }[];

    const result: Result = [];

    for (const meet of meetDocs) {
      const peer: User | Mentor = meet.user._id.equals(user_id)
        ? meet.mentor
        : meet.user;

      result.push({
        id: meet._id,
        date: meet.date,
        duration: meet.duration,
        peer: {
          id: peer._id,
          name: peer.name ?? "",
          email: peer.email,
          bio: peer.is_mentor ? peer.bio : null,
          avatar_url: peer.is_mentor ? peer.avatar_url : null,
        },
      });
    }

    return result;
  },
});
