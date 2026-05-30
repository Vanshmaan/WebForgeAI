export const PLANS = {
  free: {
    price: 0, // free
    priceId: null,
    credits: 100,
    plan: "free",
  },

  pro: {
    price: 900, // $9.00 in cents
    priceId: "price_pro_id_from_stripe", // you will replace later
    credits: 500,
    plan: "pro",
  },

  enterprise: {
    price: 1900, // $19.00 in cents
    priceId: "price_enterprise_id_from_stripe",
    credits: 1000,
    plan: "enterprise",
  },
};