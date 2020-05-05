let express = require("express");
let app = express();
let path = require("path");
let querystring = require("querystring");
let bodyParser = require("body-parser");
let fs = require("fs");
let serveIndex = require("serve-index");
let csvtojson=require("csvtojson");
var pondJson=require("./public/data/pond.json");
// console.log(pondJson);

var outputPond=[pondJson[0]["field1"],pondJson[0]["V1"],pondJson[0]["V2"]]+"\n";

var currFishN='16';

pondJson.forEach((line,index)=>{
  if(line["V1"].endsWith('Fish1_FishLatency')){
    currFishN=(60/Number(line["V2"])).toString();
    pondJson[index-3]["V2"]=(60/Number(line["V2"])).toString();
  }

  if(line["V1"]==='FishN'){
    pondJson[index]["V2"]=currFishN;
  }
});

pondJson.forEach((line,index)=>{
  outputPond+=[pondJson[index]["field1"],pondJson[index]["V1"],pondJson[index]["V2"]]+"\n";
});



let pathX="public/data";
let nameF = pathX + "/PFF2.csv";
var wsx=fs.createWriteStream(nameF);
wsx.write(outputPond);










let exphbs = require("express-handlebars");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/data', serveIndex('public/data', { icons: true }));


var hbs = exphbs.create({
  helpers: {
    ifEqual: function(val1, val2, options) {
      return val1 === val2 ? options.fn(this) : options.inverse(this);
    },
    ifNotEqueal: function(val1, val2, options) {
      return val1 !== val2 ? options.fn(this) : options.inverse(this);
    }
  },
  defaultLayout: "main"
});

// app.engine('handlebars', hbs.engine);
app.engine(
  "handlebars",
  exphbs({
    extname: "handlebars",
    helpers: {
      ifEqual: function(val1, val2, options) {
        return val1 === val2 ? options.fn(this) : options.inverse(this);
      },
      ifNotEqueal: function(val1, val2, options) {
        return val1 !== val2 ? options.fn(this) : options.inverse(this);
      }
    },
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
  })
);

let Alea = require("alea");
// import Alea from "alea";
let prng = new Alea();

app.set("view engine", "handlebars");

let port = 3008;
var server = app.listen(process.env.PORT || port, () => {
  console.log("listening on port :" + port);
});

var gameSettings = {
  pond1: 15,
  pond1Type: "RD",
  pond2: 15,
  pond2Type: "RD",
  pond3: 15,
  pond3Type: "RD",
  pond4: 15,
  pond4Type: "RD",
  pond5: 15,
  pond5Type: "RD",
  pond6: 15,
  pond6Type: "RD",
  pond7: 15,
  pond7Type: "RD",
  pond8: 15,
  pond8Type: "RD",
  pond9: 15,
  pond9Type: "RD",
  pond10: 15,
  pond10Type: "RD",
  pond11: 15,
  pond11Type: "RD",
  pond12: 15,
  pond12Type: "RD",
  fishProps: {
    RD: {
      golden: { probability: 0.1, ev: 5 },
      green: { probability: 0, ev: 3 },
      blue: { probability: 0.2, ev: 4 },
      purple: { probability: 0.3, ev: 2 },
      gray: { probability: 0.4, ev: 1 }
    },
    RT: {
      golden: { probability: 0.1, ev: 5 },
      green: { probability: 0, ev: 3 },
      blue: { probability: 0.2, ev: 4 },
      purple: { probability: 0.3, ev: 2 },
      gray: { probability: 0.4, ev: 1 }
    },
    N: {
      golden: { probability: 0, ev: 0 },
      green: { probability: 1, ev: 3 },
      blue: { probability: 0, ev: 0 },
      purple: { probability: 0, ev: 0 },
      gray: { probability: 0, ev: 0 }
    }
  },
  gameTime: 20,
  minNumberOfFishes: 10,
  maxNumberOfFishes: 20,
  minIntroTime: 5,
  maxIntroTime:7,
  fishVisibilityTime: 2,
  fishPerSecondRatio: 30,
  missingThreshold: 5
};










app.get("/", (req, res) => {
  console.log("new visitor");
  res.render("index", { settings: gameSettings });
});

app.get("/admin", (req, res) => {
  res.render("admin", { settings: gameSettings });
});

app.get("/settings", (req, res) => {
  res.send(gameSettings);
});

app.post("/admin", (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  gameSettings.pond1 = Number(req.body.pond1);
  gameSettings.pond1Type = req.body.pond1Type;
  gameSettings.pond2 = Number(req.body.pond2);
  gameSettings.pond2Type = req.body.pond2Type;
  gameSettings.pond3 = Number(req.body.pond3);
  gameSettings.pond3Type = req.body.pond3Type;
  gameSettings.pond4 = Number(req.body.pond4);
  gameSettings.pond4Type = req.body.pond4Type;
  gameSettings.pond5 = Number(req.body.pond5);
  gameSettings.pond5Type = req.body.pond5Type;
  gameSettings.pond6 = Number(req.body.pond6);
  gameSettings.pond6Type = req.body.pond6Type;
  gameSettings.pond7 = Number(req.body.pond7);
  gameSettings.pond7Type = req.body.pond7Type;
  gameSettings.pond8 = Number(req.body.pond8);
  gameSettings.pond8Type = req.body.pond8Type;
  gameSettings.pond9 = Number(req.body.pond9);
  gameSettings.pond9Type = req.body.pond9Type;
  gameSettings.pond10 = Number(req.body.pond10);
  gameSettings.pond10Type = req.body.pond10Type;
  gameSettings.pond11 = Number(req.body.pond11);
  gameSettings.pond11Type = req.body.pond11Type;
  gameSettings.pond12 = Number(req.body.pond12);
  gameSettings.pond12Type = req.body.pond12Type;

  gameSettings.fishProps.RD.golden.probability = Number(req.body.goldenPrRD);
  gameSettings.fishProps.RD.blue.probability = Number(req.body.bluePrRD);
  gameSettings.fishProps.RD.green.probability = Number(req.body.greenPrRD);
  gameSettings.fishProps.RD.purple.probability = Number(req.body.purplePrRD);
  gameSettings.fishProps.RD.gray.probability = Number(req.body.grayPrRD);
  gameSettings.fishProps.RD.golden.ev = Number(req.body.goldenEvRD);
  gameSettings.fishProps.RD.blue.ev = Number(req.body.blueEvRD);
  gameSettings.fishProps.RD.green.ev = Number(req.body.greenEvRD);
  gameSettings.fishProps.RD.purple.ev = Number(req.body.purpleEvRD);
  gameSettings.fishProps.RD.gray.ev = Number(req.body.grayEvRD);

  gameSettings.fishProps.RT.golden.probability = Number(req.body.goldenPrRT);
  gameSettings.fishProps.RT.blue.probability = Number(req.body.bluePrRT);
  gameSettings.fishProps.RT.green.probability = Number(req.body.greenPrRT);
  gameSettings.fishProps.RT.purple.probability = Number(req.body.purplePrRT);
  gameSettings.fishProps.RT.gray.probability = Number(req.body.grayPrRT);
  gameSettings.fishProps.RT.golden.ev = Number(req.body.goldenEvRT);
  gameSettings.fishProps.RT.blue.ev = Number(req.body.blueEvRT);
  gameSettings.fishProps.RT.green.ev = Number(req.body.greenEvRT);
  gameSettings.fishProps.RT.purple.ev = Number(req.body.purpleEvRT);
  gameSettings.fishProps.RT.gray.ev = Number(req.body.grayEvRT);

  gameSettings.fishProps.N.golden.probability = Number(req.body.goldenPrN);
  gameSettings.fishProps.N.blue.probability = Number(req.body.bluePrN);
  gameSettings.fishProps.N.green.probability = Number(req.body.greenPrN);
  gameSettings.fishProps.N.purple.probability = Number(req.body.purplePrN);
  gameSettings.fishProps.N.gray.probability = Number(req.body.grayPrN);
  gameSettings.fishProps.N.golden.ev = Number(req.body.goldenEvN);
  gameSettings.fishProps.N.blue.ev = Number(req.body.blueEvN);
  gameSettings.fishProps.N.green.ev = Number(req.body.greenEvN);
  gameSettings.fishProps.N.purple.ev = Number(req.body.purpleEvN);
  gameSettings.fishProps.N.gray.ev = Number(req.body.grayEvN);
  gameSettings.minNumberOfFishes = Number(req.body.minNumberOfFishes);
  gameSettings.maxNumberOfFishes = Number(req.body.maxNumberOfFishes);
  gameSettings.gameTime = Number(req.body.gameTime);
  gameSettings.minIntroTime = Number(req.body.minIntroTime);
  gameSettings.maxIntroTime = Number(req.body.maxIntroTime);
  gameSettings.fishVisibilityTime = Number(req.body.fishVisibilityTime);
  gameSettings.fishPerSecondRatio = Number(req.body.fishPerSecondRatio);
  gameSettings.missingThreshold = Number(req.body.missingThreshold);

  res.send({ ok: "ok" });
  console.log("new gameSettings:");
  console.log(gameSettings);
});

app.post("/output", (req, res) => {
  userID = req.body.userID;

  console.log("this it the userID:");
  console.log(userID);

  let dateForPath1=new Date();
  let dateString=dateForPath1.getDate()+"_"+(dateForPath1.getMonth()+1)+"_"+dateForPath1.getFullYear()+"/";
  path1="public/data/"+dateString;

  if (!fs.existsSync(path1)) {
    fs.mkdirSync(path1);
  }

  let name = path1 + "/" + userID + ".csv";
  var ws = fs.createWriteStream(name);
  ws.write(req.body.output);
});
