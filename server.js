const express    = require("express"),
      app        = express(),
      PORT       = process.env.PORT || 3000,
      dotenv     = require("dotenv"),
      bodyParser = require("body-parser"),      
      mongoose   = require('mongoose'),
      path       = require("path");

dotenv.config();

mongoose.connect(process.env.MONGOLAB_URI,{ useNewUrlParser: true },(err)=>{
    if(err) console.log(err);
    else console.log("connected to db");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
app.use("/static", express.static(path.join(__dirname,'static')));
app.use(require("./routes/user")); 

app.listen(PORT,err=>{
  if(err) {
    console.log(`there is an error: ${err}`);
  } else {
      console.log(`server running on port ${PORT}`);
  }
});
