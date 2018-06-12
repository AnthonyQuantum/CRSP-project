const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

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

// Get OAuth token
router.post('/getToken', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find(req.body)
            .toArray()
            .then((users) => {
                if (users[0].token == null)
                    response.token = null;
                else
                {
                    response.token = users[0].token;
                }
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Create OAuth token
router.post('/allowCalendarAccess', (req, res) => {
    console.log('Got request');
    try {
        const content = fs.readFileSync('../../client_secret.json');
        authorize(JSON.parse(content), listEvents);
      } catch (err) {
        return console.log('Error loading client secret file:', err);
      }
});

/**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   * @return {function} if error in reading credentials.json asks for a new one.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    let token = {};
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    try {
      token = fs.readFileSync(TOKEN_PATH);
    } catch (err) {
      return getAccessToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        try {
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
          console.log('Token stored to', TOKEN_PATH);
        } catch (err) {
          console.error(err);
        }
        callback(oAuth2Client);
      });
    });
  }
  
  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }

module.exports = router;