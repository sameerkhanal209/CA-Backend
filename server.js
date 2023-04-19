const express = require('express')
const cors = require('cors')
const app = express()
const cookieSession = require("cookie-session");
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    cookieSession({
      name: "color-library-session",
      secret: "my-secret-token",
      httpOnly: true
    })
);

const dbConfig = require("./api/config/db.config.js");
const db = require("./api/models");

db.mongoose
  .connect(`${dbConfig.MONGODB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
    res.json({ message: "ColorLibrary API CA3 Project." });
});

require("./api/routes/user.routes")(app);
require("./api/routes/color.routes")(app);

app.get("/*", (req, res) => {
    res.status(404).json({ message: "404 not found." });
});

const PORT = process.env.PORT || 3131;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
