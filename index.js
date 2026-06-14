// index.js
const express = require("express");
const connectDB = require("./src/config/database.js");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./src/routes/user.routes.js");
const urlRouter = require("./src/routes/url.routes.js");
const analyticsRouter = require("./src/routes/analytics.routes");
const redisClient = require("./src/config/redis.js");



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/url', urlRouter);
app.use('/api/analytics', analyticsRouter);

async function startServer() {
  await connectDB();

  app.listen(process.env.PORT || 3500, () => {
    console.log(`server is running at ${process.env.PORT || 3500 }`);
  });
}

startServer();
