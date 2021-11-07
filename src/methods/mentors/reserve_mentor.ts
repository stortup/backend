import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { meetsCollection } from "../../collections/meets.js";
import { timesCollection } from "../../collections/times.js";

interface Params {
  mentor_id: string;
  date: Date;
  price_paid: number;
}

export const reserveMentor = sweet({
  method: "POST",
  url: "/reserve_mentor",
  auth: usersAuth,
  params: {
    mentor_id: "string",
    date: "date|convert",
    price_paid: "number",
  },
  async handler(params: Params, { user_id }) {
    const mentorId = new ObjectId(params.mentor_id);

    const { value } = await timesCollection.findOneAndUpdate(
      { _id: mentorId, "times.date": params.date, "times.reserved": false },
      { $set: { "times.$.reserved": true } },
    );

    if (!value) throw new Error("Time not found");

    const time = value.times.find((time) =>
      time.date.getTime() === params.date.getTime()
    );

    await meetsCollection.insertOne({
      _id: new ObjectId(),
      mentor_id: mentorId,
      user_id,
      price_paid: params.price_paid,
      date: time!.date,
      duration: time!.duration,
    });
  },
});
