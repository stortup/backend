import { ObjectId } from "bson";
import { client } from "../../mongo";

export interface Time {
  _id: ObjectId;
  start_date: number; // timestamp is seconds
  end_date: number; // timestamp is seconds
  reserved: boolean;
  meet_id?: ObjectId;
}

export interface MentorTimesCollection {
  _id: ObjectId; // equals to mentor_id
  times: Time[];
}

const timesCollection = client.db("mentor-times").collection<
  MentorTimesCollection
>(
  "meets",
);

export class MentorTimes {
  _id: ObjectId; // equals to mentor_id
  times: Time[] = [];

  constructor(
    times: MentorTimesCollection,
  ) {
    this._id = times._id;
    this.times = times.times;
  }

  static async of(userId: ObjectId): Promise<MentorTimes> {
    const hit = await timesCollection.findOne({ _id: userId });
    if (hit) return new MentorTimes(hit);
    return new MentorTimes({ _id: userId, times: [] });
  }

  addTime(start_date: number, end_date: number): Time {
    if (start_date >= end_date) throw new Error("Bad start_date, end_date");
    const now = ~~(Date.now() / 100);
    if (start_date < now) throw new Error("Bad start_date");
    if (end_date < now) throw new Error("Bad end_date");

    const t: TimeWithoutId = { start_date, end_date };

    for (const time of this.times) {
      if (timesHasConflict(t, time)) {
        throw new Error("Time Conflict");
      }
    }

    const time: Time = {
      _id: new ObjectId(),
      start_date,
      end_date,
      reserved: false,
    };

    this.times.push(time);
    this.sort();

    return time;
  }

  sort() {
    // TODO
  }

  async save() {
    await timesCollection.replaceOne({ _id: this._id }, {
      _id: this._id,
      times: this.times,
    }, { upsert: true });
  }
}

interface TimeWithoutId {
  start_date: number;
  end_date: number;
}

function timesHasConflict(a: TimeWithoutId, b: TimeWithoutId) {
  if (a.start_date < b.start_date && a.end_date < b.start_date) return false;
  if (b.start_date < a.start_date && b.end_date < a.start_date) return false;
  return true;
}
