const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3');

let db = new sqlite3.Database("./db/content.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.log("Error: " + err.message);
  } else {
    console.log("db connection succesful");
  }
});


app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.send("404"));

app.listen(80, () => {
  console.log("App listening on 80");
});
