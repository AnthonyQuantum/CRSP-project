const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const app = express();

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/crsp-project', (err, db) => {
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

// Response handling
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
                console.log("Got tasks");
                console.log(tasks[0].tasks);
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

// Delete task //TODO
router.delete('/tasksDelete/:id', (req, res) => {
    connection((db) => {
        db.collection('tasks').remove({ id: req.params.id })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

//TODO
router.put('/tasksUpdate/:id', (req, res) => {
    connection((db) => {
        db.collection('tasks').update({ id: req.params.id },
            { $set:
                {
                    status: req.body.status
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
                    response.isValid = true;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;