import { FastifyPluginCallback } from "fastify";
import proxy from "fastify-http-proxy";

const R1_APIKEY = process.env.R1_APIKEY;
const R1_CHANNEL_ID = process.env.R1_CHANNEL_ID;

if (!R1_APIKEY) throw new Error("R1_APIKEY not found in env");
if (!R1_CHANNEL_ID) throw new Error("R1_CHANNEL_ID not found in env");

export const vodPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(proxy, {
    upstream: `https://napi.arvancloud.com/vod/2.0/channels/${R1_CHANNEL_ID}`,
    replyOptions: {
      rewriteRequestHeaders: (req, headers) => {
        headers["Authorization"] = R1_APIKEY;
        return headers;
      },
      rewriteHeaders: (headers) => {
        if (headers["location"]) {
          headers["location"] = h(headers["location"]).replace(
            `https://napi.arvancloud.com/vod/2.0/channels/${R1_CHANNEL_ID}`,
            "http://localhost:4004/vod", // TODO: change to real url
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
