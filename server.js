const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  console.log("DB connection successful!");
});

const port = process.env.PORT || 8080;

app.listen(port);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  ServerApiVersion.close(() => {
    process.exit(1);
  });
});
