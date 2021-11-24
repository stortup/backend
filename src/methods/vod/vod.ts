import { FastifyPluginCallback } from "fastify";
import proxy from "fastify-http-proxy";

const R1_APIKEY = process.env.R1_APIKEY;

if (!R1_APIKEY) throw new Error("R1_APIKEY not found in env");

export const vodPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(proxy, {
    upstream:
      "https://napi.arvancloud.com/vod/2.0/channels/ef158203-34ee-4314-8d04-0492dbb0120a",
    replyOptions: {
      rewriteRequestHeaders: (req, headers) => {
        headers["Authorization"] = R1_APIKEY;
        return headers;
      },
      rewriteHeaders: (headers) => {
        if (headers["location"]) {
          headers["location"] = h(headers["location"]).replace(
            "https://napi.arvancloud.com/vod/2.0/channels/ef158203-34ee-4314-8d04-0492dbb0120a",
            "http://localhost:4004/vod",
          );
        }
        return headers;
      },
    },
  });

  done();
};

function h<T>(a: T | T[]): T {
  if (Array.isArray(a)) {
    return a[0];
  }
  return a;
}
