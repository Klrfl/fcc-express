require("dotenv").config();
const bodyParser = require("body-parser");
let express = require('express');
let app = express();

app.get("/", function(req, res) {
  const absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
});

// middleware
app.use(function(req, res, next){
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next();
})

app.use(bodyParser.urlencoded({extended: false}))

app.use("/public", express.static(`${__dirname}/public`))

app.get("/json", (req, res) => {
  let message = "Hello json";
  if (process.env.MESSAGE_STYLE == "uppercase") {
    message = message.toUpperCase()
  }
  res.json({ "message": message })
})

// chained middleware
app.get("/now",(req, res, next) => {
  req.time = new Date().toString();
  next();
},  (req, res) => {
  res.json({"time": req.time});
})

app.get("/:word/echo", (req, res) => {
  const {echo, word} = req.params;
  res.json({echo: word});
})

app.get("/name", (req, res) => {
  const {first, last} = req.query;
  res.json({"name": `${first} ${last}`})
  console.log(first, last);
})

app.post("/name", (req, res) => {
  const {first, last} = req.body;
  res.json({name: `${first} ${last}`})
})

module.exports = app;
