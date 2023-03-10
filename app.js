var express = require("express");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.port || 3000;

var db = require("./config/database");
const e = require("express");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
}).then(function () {
    console.log("Connected to MongoDB");
}).catch(function (error) {
    console.log(error);
})

require("./models/Game");
require("./models/Unity");
var Game = mongoose.model("game");
var Unity = mongoose.model("unity");

// Example routes
app.get("/", function (req, res) {
    // res.send("Hello World");
    res.redirect("gameList.html");
})

app.get("/poop", function (req, res) {
    res.send("What's crackin dude?");
})

app.post("/saveGame", function (req, res) {
    console.log(req.body);
    //res.send(req.body);

    new Game(req.body).save()
        .then(function () {
            res.redirect("gameList.html");
        })
})

app.get("/getGames", function (req, res) {
    Game.find({})
        .then(function (game) {
            //console.log({ game });
            res.json({ game });
        })
})

app.get("/getGamesAlpha", function (req, res) {
    Game.find({})
        .sort('game')
        .then(function (game) {
            //console.log({ game });
            res.json({ game });
        })
})

app.get("/getGamesReverse", function (req, res) {
    Game.find({})
        .sort('-game')
        .then(function (game) {
            //console.log({ game });
            res.json({ game });
        })
})

app.post("/deleteGame", function (req, res) {
    console.log(`Game Deleted: ${req.body.game._id}`)
    Game.findByIdAndDelete(req.body.game._id).exec();
    res.redirect('gameList.html');
})

app.get("/getID::id", function (req, res) {
    console.log(req.params.id)
    res.redirect('updatePage.html?id=' + req.params.id);
})

//update route
app.post("/updateGame", function (req, res) {
    console.log(req.body)
    //res.redirect('gameList.html')
    Game.findByIdAndUpdate(req.body.id, { game: req.body.game }, function () {
        res.redirect('gameList.html')
    })
})

app.post('/searchGame', (req, res) => {
    console.log(req.body)
    Game.find({ game: req.body.game }).exec((err, game) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error searching the database');
        } else {
            if (game[0] == undefined) {
                res.redirect('searchGame.html?game=game_not_found')
                console.log('Search results:', req.body.game, 'was not found!');
            }
            else {
                //res.json(game);
                res.redirect('searchGame.html?game=' + req.body.game)
                console.log('Search results:', game[0].game, 'was found in the database!');
            }
        }
    });
});

//Unity Route
app.post("/unity", function (req, res) {
    console.log("Reached By Unity")
    var data = {
        "name": req.body.name,
        "level": req.body.level,
        "timeElapsed": req.body.timeElapsed
    }
    console.log(data);
})

app.get("/SendUnityData", function (req, res) {
    console.log("Recieved Request from Unity")
    var newData = {
        "name": "Shmoovement",
        "level": 3,
        "timeElapsed": 43.33
    }
    res.send(newData);
})

//unity insert
app.post("/saveUnityEntry", function (req, res) {
    //console.log(req.body);
    //res.send(req.body);
    new Unity(req.body).save()
        .then(function () {
            console.log("Player saved.");
        })
})

//unity delete
app.post("/deleteUnityEntry", function (req, res) {
    //console.log(`User Deleted: ${req.body.screenName}`)
    Unity.findOneAndDelete(req.body.screenName).exec();
})

app.post("/updateUnityEntry", function (req, res) {
    //console.log(req.body)
    Unity.findOneAndUpdate(req.body.screenName, { unity: req.body }, { new: true }).exec();
    console.log("Updated record.")
})

app.get("/getAllUnityEntries", function (req, res) {
    Unity.find({})
        .then(function (Entries) {
            console.log({ Entries });
            res.json({ Entries });
        })
})

//search one unity entry
app.get('/searchUnityEntries', (req, res) => {
    //console.log(req.query.screenName)
    Unity.findOne({ screenName: req.query.screenName }).exec((err, unity) => {
        if (err) {
            console.error(err);
        }
        if (!unity) {
            //console.log("Player not found")
            res.sendStatus(404);
        }
        else {
            //console.log(unity);
            res.send(unity)
        }
    });
});

app.use(express.static(__dirname + "/pages"));
app.listen(port, function () {
    console.log(`Running on port ${port}.`)
})