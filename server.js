const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

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

app.get("/*", (req, res) => {
    res.status(404).json({ message: "404 not found." });
});

const PORT = process.env.PORT || 3131;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
