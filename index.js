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

app.get("/", (req, res) =>
    res.render("pages/index")
);

data = {
    startWith: "00:00.00",
}

// console.log(data.test);

app.post("/", function (req, res) {
    data.naam = req.body.user;
    data.afstand = req.body.distance;
    data.chosenTrack = track(distanceCheck(data.afstand), data.afstand);
    res.render("pages/setup", data);
});

app.post("/started", function (req, res) {
    data.allTimes = [],
        data.allTimesTimeStamps = [],
        data.progress = 0,
        data.startTime = Date.now(),
        data.newTime = Date.now(),
        res.render("pages/counting", data);
});

app.post("/newRound", function (req, res) {

    data.oldTime = data.newTime;
    data.newTime = Date.now();
    data.timeDifference = data.newTime - data.oldTime;
    metenIsWeten(data.progress)
    data.progress = Number(data.progress) + 1;
    data.startTimeInMs = msToTime(checkBetween(data.startTime))

    function metenIsWeten(progress) {
        var allCounts = data.allTimes;
        var clockedTime = msToTime(checkBetween(data.oldTime))
        allCounts.push(clockedTime)
        data.allTimes = allCounts

        if (data.progress + 1 === data.chosenTrack.length) {
            data.endTime = msToTime(checkBetween(data.startTime))
            data.endTimeInMs = checkBetween(data.startTime)
        }
    }



    function resultCheck(x) {
        if (x < data.progress) {
            var fix2 = "req.body.result" + x;
            return eval(fix2);
        }
        if (x == data.progress) {
            var fix2 = "req.body.result" + data.progress;
            return eval(fix2);
        }
    }

    // console.log(data);
    // // resultCheck();

    console.log(data);
    res.render("pages/counting", data);

});

app.get("/started", (req, res) => res.render("pages/counting"));

app.get("/index", (req, res) =>
    res.render("pages/index")
);

function checkBetween(oldTime) {
    return data.newTime - oldTime;
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


// function calcNextTime(params) {

//     console.log(data);
//     console.log(data.progress);
//     // allCounts.push(clockedTime)
//     // data.allTimes = allCounts


//     if (data.progress === 0) {
//         firstPredictionMultiplier = 400 / data.chosenTrack[data.progress].meter;
//         nextRoundPrediction = data.timeDifference * firstPredictionMultiplier;
//         nextRoundPredictionToMS = msToTime(nextRoundPrediction + data.timeDifference)
//         data.predictedTimes = [nextRoundPredictionToMS]
//         console.log('predicted time = ' + data.predictedTimes);
//     }
// }

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

server.listen(port, function () {});