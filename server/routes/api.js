const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const {google} = require('googleapis');

var scheduleGenerator = require('../scheduleGenerator');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/rhythm', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response
let response = {
    status: 200,
    data: [],
    message: null
};

// Get tasks
router.get('/tasks/:usr', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find({ name: req.params.usr })
            .toArray()
            .then((tasks) => {
                response.data = tasks[0].tasks;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Add new task
router.post('/tasksAdd/:usr', (req, res) => {
    connection((db) => {
        db.collection('users')
            .update({ name: req.params.usr },
            {
                $push: { tasks: req.body } 
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Delete task
router.delete('/tasksDelete/:usr/:id', (req, res) => {
    connection((db) => {
        db.collection('users')
            .update({ name: req.params.usr },
            {
                $pull: { tasks: { id: req.params.id } } 
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Change task status
router.put('/tasksUpdate/:usr/:id', (req, res) => {
    connection((db) => {
        db.collection('users')
            .update({ name: req.params.usr, "tasks.id": req.params.id },
            { 
                $set:
                {
                    "tasks.$.status": req.body.status
                }
            })
    });
});

// Add new user
router.post('/addUser', (req, res) => {
    connection((db) => {
        db.collection('users').insert(req.body)
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Check if user exists
router.post('/loginUser', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find(req.body)
            .toArray()
            .then((users) => {
                if (users === undefined || users.length == 0)
                    response.isValid = false;
                else
                {
                    response.isValid = true;
                    response.wuTime = users[0].wakeUpTime;
                    response.gtbTime = users[0].goToBedTime;
                    response.token = users[0].token;
                }
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Save wake up and go to bed time
router.put('/wsTime/:usr/:wu/:gtb', (req, res) => {
    connection((db) => {
        db.collection('users')
            .update({ name: req.params.usr },
            { 
                $set:
                {
                    wakeUpTime: req.params.wu,
                    goToBedTime: req.params.gtb
                }
            })
    });
});

var OAuth2 = google.auth.OAuth2;
var oAuth2Client = new google.auth.OAuth2("376770685318-59uhlg6rfsu1fbs8du6h5qh5bh57po2m.apps.googleusercontent.com",
                                            "dfOmWhgKaoaVaRvef-ut0yPS", 
                                            "http://localhost:3000/oauthcallback");
var url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

router.get('/getOAuthURL', (req, res) => {
    response.data = url;
    res.json(response);
});

// Get OAuth token
router.get('/getToken', (req, res) => {
    var code = req.query.code;
    var username = req.query.user;

    oAuth2Client.getToken(code, function(err, tokens) {
        if (err) {
          console.log(err);
          res.send(err);
          return;
        }

        oAuth2Client.setCredentials(tokens);
        response.data = tokens;
        res.json(response);

        // Save token to DB
        connection((db) => {
            db.collection('users')
                .update({ name: req.query.user },
                { 
                    $set:
                    {
                        token: tokens
                    }
                })
        });
    });
});

// Generate a new schedule
router.post('/generateSchedule/:usr', (req, res) => {
    console.log("OK in api.js");
    scheduleGenerator.generate(req.params.usr, connection);
});

module.exports = router;