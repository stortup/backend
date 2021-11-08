import createError from "fastify-error";

export const NO_AUTH_HEADER = createError(
  "NO_AUTH_HEADER",
  "No authentication header",
  401,
);
export const INVALID_JWT = createError(
  "INVALID_AUTH_HEADER",
  "Outdated or invalid access-token",
  401,
);
export const UNAUTHORIZED = createError(
  "UNAUTHORIZED",
  "UNAUTHORIZED",
  401,
);
export const FORBIDDEN = createError(
  "FORBIDDEN",
  "FORBIDDEN",
  403,
);
