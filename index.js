const express = require("express");
const dbConnect = require("./src/config/dbConnect");
const app = express();
const bodyParser = require("body-parser");
const config = require("./src/config/config");
const PORT = config.PORT || 5000;
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth.routes");
const { notAFound, errorHandlers } = require("./src/middlewares/errorHandler");

dbConnect();

// app.use("/", (req, res) => {
//   console.log(req);
//   res.send("Server is running");
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use(errorHandlers);
// app.use(notAFound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
