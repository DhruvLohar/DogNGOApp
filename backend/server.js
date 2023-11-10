const express = require("express");
const app = express();
// const multer = require('multer');
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { default: mongoose } = require("mongoose");


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "/uploads")); // Define the directory where uploaded files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp as the filename
//   },
// });

// const fileUpload = multer({ storage });

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/uploads")));

app.use("/", require("./routes/root"));
app.use("/user", require("./routes/UserRoutes"));
app.use("/dog", require("./routes/DogRoutes"));

app.use('/uploads', express.static(path.join(__dirname, "/uploads")));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/DogNGOApp").then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, '192.168.1.5', () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.log(err);
});
