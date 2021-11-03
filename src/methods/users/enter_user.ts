import { sweet } from "sweet-fastify";
import createError from "fastify-error";
import { otpCollection } from "../../collections/otp.js";
import { User, usersCollection } from "../../collections/users.js";
import { TokenDocument, tokensCollection } from "../../collections/tokens.js";
import { ObjectId } from "mongodb";
import { toView, View } from "../../../utils.js";

interface Params {
  phone: string;
  code: string;
}

interface Response {
  user: View<User>;
  access_token: string;
}

const CODE_IS_WRONG = createError(
  "CODE_IS_WRONG",
  "Code is wrong",
  400,
);

export const enterUser = sweet({
  method: "POST",
  url: "/enter_user",
  params: {
    phone: "string",
    code: "string",
  },
  async handler(params: Params): Promise<Response> {
    const otp = await otpCollection.findOne({
      _id: params.phone,
      code: params.code,
    });

    if (!otp) throw new CODE_IS_WRONG();
    if (isExpired(otp.expire_at)) throw new CODE_IS_WRONG();

    await otpCollection.deleteOne({ _id: params.phone });

    const user = await usersCollection.findOne({ phone: params.phone });

    if (user) {
      // login
      const token: TokenDocument = {
        _id: new ObjectId(),
        user_id: user._id,
      };

      await tokensCollection.insertOne(token);

      return { access_token: token._id.toHexString(), user: toView(user) };
    }

    // register
    const newUser: User = {
      _id: new ObjectId(),
      phone: params.phone,
      is_mentor: false,
      is_admin: false,
      name: null,
      email: null,
      email_verified: false,
    };

    await usersCollection.insertOne(newUser);

    const token: TokenDocument = {
      _id: new ObjectId(),
      user_id: newUser._id,
    };

    await tokensCollection.insertOne(token);

    return { access_token: token._id.toHexString(), user: toView(newUser) };
  },
});

function isExpired(date: Date) {
  return date.getTime() < Date.now();
}
