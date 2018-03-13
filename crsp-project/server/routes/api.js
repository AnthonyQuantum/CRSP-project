const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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
router.get('/tasks', (req, res) => {
    connection((db) => {
        db.collection('tasks')
            .find()
            .toArray()
            .then((tasks) => {
                response.data = tasks;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get task by id
function getTaskById(cId)
{
    connection((db) => {
        db.collection('tasks')
            .find()
            .toArray()
            .then((tasks) => {
                return JSON.parse(tasks);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

// Add new task
router.post('/tasksAdd', (req, res) => {
    connection((db) => {
        db.collection('tasks').insert(req.body)
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Delete task
router.delete('/tasksDelete/:id', (req, res) => {
    connection((db) => {
        db.collection('tasks').remove({ id: req.params.id })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

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

module.exports = router;