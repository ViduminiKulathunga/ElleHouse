import stripe from "stripe";

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2022-11-15",
});

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      /* eslint-disable @typescript-eslint/camelcase */
      grant_type: "authorization_code",
      code,
      /* eslint-enable @typescript-eslint/camelcase */
    });

    return response;
  },
  disconnect: async (stripeUserId: string) => {
    // @ts-ignore
    const response = await client.oauth.deauthorize({
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: `${process.env.S_CLIENT_ID}`,
      stripe_user_id: stripeUserId,
      /* eslint-enable @typescript-eslint/camelcase */
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    /* eslint-disable @typescript-eslint/camelcase */
    const res = await client.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripeAccount,
      }
    );
    /* eslint-enable @typescript-eslint/camelcase */

    if (res.status !== "succeeded") {
      throw new Error("failed to create charge with Stripe");
    }
  },
};
