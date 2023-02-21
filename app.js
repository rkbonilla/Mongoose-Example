var express = require("express");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.port || 3000;

var db = require("./config/database")

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
var Game = mongoose.model("game");

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
    Game.find(req.body.game).exec((err, game) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error searching the database');
        } else {
            console.log('Search results:', game);
            res.json(game);
        }
    });
});

app.use(express.static(__dirname + "/pages"));
app.listen(port, function () {
    console.log(`Running on port ${port}.`)
})