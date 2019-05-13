const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("static"));
//express.set(view engine = ejs)
app.set("view engine", "ejs");


// app.get("/", datafetch);
app.get("/", (req, res) =>
  res.render("pages/index", {
    data: null
  })
);


app.post("/", function (req, res) {
  var naam = req.body.user;
  var afstand = req.body.distance;
  var devide = distanceCheck(afstand);
  var chosenTrack = track(distanceCheck(afstand), afstand);
  console.log(chosenTrack);
  console.log(naam + " wordt gemeten op " + afstand + " meter.");
  var start = Date.now();
  var state = true;
  var time = "null";
  var test = distanceCheck(afstand);
  var einde = Date.now();
  var verstreken = einde - start;
  var objects = {
    afstand: "",
    tijd: ""
  };
  res.render("pages/setup", {
    data: start,
    name: naam,
    curr: "00:00.00",
    distance: afstand,
    started: state,
    time: start,
    chosen: chosenTrack,
    results: objects
  });
});
var objects = {
  afstand: "",
  tijd: ""
};
app.post("/started", function (req, res) {
  var distance = req.body.distance;
  var name = req.body.name;
  var oldTime = req.body.time;
  var chosenTrack = track(distanceCheck(distance), distance);
  var progress = 0;
  var startTime = req.body.time;
  var newTime = Date.now();
  var objects = {
    afstand: "",
    tijd: ""
  };
  res.render("pages/counting", {
    time: newTime,
    curr: "00:00.00",
    name: name,
    distance: distance,
    progress: progress,
    chosen: chosenTrack,
    results: objects,
    oldTime: "",
    amountOfResults: "",
    startTime: startTime,
    test: [{
      tijd: ""
    }, {
      tijd: ""
    }]
  });
});

app.post("/newRound", function (req, res) {
  var distance = req.body.distance;
  var name = req.body.name;
  var oldTime = req.body.time;
  var clockedTime = req.body.curr;
  var allresults = req.body;
  var startTime = req.body.startTime;
  var chosenTrack = track(distanceCheck(distance), distance);
  var progress = parseInt(req.body.progress) + 1;
  var newTime = Date.now();
  var between = newTime - oldTime;

  function checkBetween(x) {
    return newTime - x;
  }

  function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return mins + "." + secs + "." + ms;
  }

  var testresult = req.body.result1;
  var objects = {};

  function timeCheck(x) {
    if (x < progress - 1) {
      return oldTime;
    }
    if (x === progress - 1) {
      return msToTime(between);
    }
  }

  for (var x = 0; x < chosenTrack.length; x++) {
    objects[x] = {
      afstand: chosenTrack[x].meter,
      tijd: timeCheck(x)
    };
  }
  var clockedResults = {};

  for (var i = 0; i < x; i++) {
    resultCheck(x);
  }

  function ifElse(x) {
    if (resultCheck(x) !== undefined) {
      return resultCheck(x);
    } else {
      return msToTime(between);
    }
  }

  function kaboem() {
    var test = [];
    for (var x = 0; x < progress; x++) {
      test[x] = {
        tijd: ifElse(x)
      };
    }
    return test.reverse();
  }

  console.log(allresults);

  function resultCheck(x) {
    var fix;
    if (x < progress) {
      var fix2 = "req.body.result" + x;
      return eval(fix2);
    }
    if (x == progress) {
      var fix2 = "req.body.result" + progress;
      return eval(fix2);
    }
  }
  // resultCheck();
  console.log("jfiajfoiejaofj");
  console.log(objects);
  console.log(checkBetween(startTime));
  res.render("pages/counting", {
    time: newTime,
    curr: msToTime(between),
    name: name,
    distance: distance,
    progress: progress,
    chosen: chosenTrack,
    results: objects,
    oldTime: oldTime,
    amountOfResults: x,
    startTime: startTime,
    startTimeInMs: msToTime(checkBetween(startTime)),
    endTime: checkBetween(startTime),
    test: kaboem()
  });
});

app.get("/started", (req, res) => res.render("pages/counting"));

app.get("/index", (req, res) =>
  res.render("pages/index")
);

io.on("connection", async function (socket) {
  socket.emit('eventHere', {
    test: 'hey'
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});



function distanceCheck(x) {
  var check = x % 400;
  return check;
}

function track(eersteMeetpunt, afstand) {

  var afstand = afstand * 1;
  var arr = [];
  for (let i = eersteMeetpunt; i < afstand; i += 400) {
    arr.push({
      meter: i
    });
    if (i + 400 >= afstand) {
      arr.push({
        meter: afstand
      });
      return arr;
    }
  }
}

server.listen(port, function () {
  console.log("listening on *:3000");
});