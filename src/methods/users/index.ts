import { FastifyPluginCallback } from "fastify";
import { sendCode } from "./send_code.js";

export const usersPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route(sendCode);

  done();
};
