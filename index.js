const express = require("express");
const mongoose = require("mongoose");
const dbConnect = require("./src/config/dbConnect");
const app = express();
const cors=require('./')
const bodyParser = require("body-parser");
const config = require("./src/config/config");
const PORT = config.PORT || 5000;
const authRouter = require("./src/routes/auth.routes");
const { notAFound, errorHandlers } = require("./src/middlewares/errorHandler");

dbConnect();

// app.use("/", (req, res) => {
//   console.log(req);
//   res.send("Server is running");
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);
app.use(errorHandlers);
// app.use(notAFound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
