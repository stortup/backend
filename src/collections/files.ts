import { GridFSBucket } from "mongodb";
import { client } from "../../mongo.js";

const db = client.db("stortup");
export const bucket = new GridFSBucket(db, { bucketName: "files" });
