import { FastifyPluginCallback } from "fastify";
import FMP from "fastify-multipart";
import { promisify } from "util";
import { pipeline } from "stream";
import { bucket } from "../../collections/files.js";
import { ObjectId } from "bson";

const pump = promisify(pipeline);

export const filesPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(FMP);

  fastify.route({
    method: "POST",
    url: "/upload",
    handler: async (request, reply) => {
      const data = await request.file();
      console.log(data);

      const id = new ObjectId();
      await pump(
        data.file,
        bucket.openUploadStreamWithId(id, data.filename, {
          contentType: data.mimetype,
        }),
      );

      return { id };
    },
  });

  fastify.route({
    method: "GET",
    url: "/:id",
    handler: async (request, reply) => {
      const id = new ObjectId((request.params as any).id);
      const files = await bucket.find({ _id: id }).toArray();

      if (files.length === 0) return reply.code(404).send();

      return reply.header("Content-Type", files[0].contentType).send(
        bucket.openDownloadStream(id),
      );
    },
  });

  done();
};
