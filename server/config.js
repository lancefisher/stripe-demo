module.exports = {
  PORT: process.env.PORT || 3000,
  HOSTNAME: process.env.HOSTNAME || 'localhost',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/stripe-demo',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
