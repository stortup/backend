import { sweet } from "sweet-fastify";
import { otpCollection } from "../../collections/otp.js";

interface Params {
  phone: string;
}

const TWO_MINUTES = 1000 * 60 * 2;

// const CODE_ALREADY_SENT = createError(
//   "CODE_ALREADY_SENT",
//   "Code Already Send",
//   400,
// );

export const sendCode = sweet({
  method: "POST",
  url: "/send_code",
  params: {
    phone: "string",
  },
  async handler(params: Params) {
    // const otp = await otpCollection.findOne({ _id: params.phone });

    // if (otp) {
    //   if (!isExpired(otp.expire_at)) {
    //     // OTP is valid
    //     throw new CODE_ALREADY_SENT();
    //   }
    // }

    // const code = generateOtpCode(); TODO
    const code = "12345";

    const expire_at = new Date(Date.now() + TWO_MINUTES);

    await otpCollection.replaceOne(
      { _id: params.phone },
      {
        _id: params.phone,
        code,
        expire_at,
      },
      { upsert: true },
    );
  },
});

// function isExpired(date: Date) {
//   return date.getTime() < Date.now();
// }

// function generateOtpCode() {
//   return (Math.floor(Math.random() * 90000) + 10000).toString();
// }
