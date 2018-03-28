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

generate()
{
    // TODO get from user
    tasks = [];

    tasksAD = [];
    tasksAND = [];
    tasksBD = [];
    tasksBND = [];

    SlotsNum = 48;
    values = [87.5,82.5,77.5,72.5,67.5,
              62.5,58,54.5,61.5,75,
              85,95,102.5,107.5,112.5,
              117.5,121.5,126,130,131.5,
              131.5,128,122.5,117.5,113,
              108.5,104,101.5,100.5,100,
              100,100.5,102,104,105.5,
              106.5,107.5,109,110.5,111,
              110.5,109,106.5,104,101.5,
              98,94.5,91.5];
    slots = values;

    // TODO get from user
    wu = 6.5 * 2;
    gtb = 22.5 * 2;

    for (i = 0; i < wu; ++i)
        slots[i] = -1;
    for (i = gtb; i < SlotsNum; ++i)
        slots[i] = -1;
    
    tasks.forEach(task => {
        if (task.priority == "A")
        {
            if (task.divisible)
                tasksAD.push(task);
            else
                tasksAND.push(task);
        }
        if (task.priority == "B")
        {
            if (task.divisible)
                tasksBD.push(task);
            else
                tasksBND.push(task);
        }
    });

}

module.exports = router;