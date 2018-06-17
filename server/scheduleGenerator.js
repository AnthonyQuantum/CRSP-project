const {google} = require('googleapis');
const MongoClient = require('mongodb').MongoClient;

var OAuth2 = google.auth.OAuth2;
var oAuth2Client = new google.auth.OAuth2("376770685318-59uhlg6rfsu1fbs8du6h5qh5bh57po2m.apps.googleusercontent.com",
                                            "dfOmWhgKaoaVaRvef-ut0yPS", 
                                            "http://localhost:3000/oauthcallback");

class Slot {
    constructor(number, value, task) {
        this.number = number;
        this.value = value;
        this.task = task;
    }

    setTask(task) {
        this.task = task;
    }
}

var userWuTime;
var userGtbTime;
var slots = [];
var tasks = [];
var tasksAD = [];
var tasksAND = [];
var tasksBD = [];
var tasksBND = [];
var tasksTB = [];

function generate(username, connection) {

    // Get user's token from DB
    connection((db) => {
        db.collection('users')
            .find({ name: username })
            .toArray()
            .then((user) => {
                // Authorize the user
                oAuth2Client.setCredentials(user[0].token);
                userWuTime = parseInt(user[0].wakeUpTime);
                userGtbTime = parseInt(user[0].goToBedTime);
                tasks = user[0].tasks;
                generateSlots();
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

function generateSlots() {
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

    var currentSlot;

    for (i = 0; i < 47; ++i)
    {
        currentSlot = new Slot(2*i+1, values[i], null);
        slots.push(currentSlot);
        currentSlot = new Slot(2*i+2, Math.round(((values[i] + values[i+1]) / 2) * 100) / 100, null);
        slots.push(currentSlot);
    }
    currentSlot = new Slot(96, values[47], null);
    slots.push(currentSlot);

    assignSleep();
}

function assignSleep() {
    console.log("WU: " + userWuTime);
    console.log("GTB: " + userGtbTime);
    for (i = 1; i < userWuTime; i++)
    {
        slots[i-1].setTask("Sleep");
    }

    for (i = userGtbTime-1; i < 96; ++i)
    {
        slots[i-1].setTask("Sleep");
    }

    assignTB();
}

function assignTB() {
    sortTasks();

    tasksTB.forEach(task => {
        for (i = 0; i < task.time; ++i)
        {
            slots[task.startTime + i - 1].task = task.title;
        }
    });

    assignND('A');
}

function assignAND(type) {
    var tasks;
    if (type == 'A')
        tasks = tasksAND;
    else
        tasks = tasksBND;

    /*tasks.forEach(task => {
        for (i = 0; i < task.time; ++i)
        {
            slots[task.startTime + i - 1].task = task.title;
        }
    });*/

    console.log(slots);
}




function sortTasks() {
    tasks.forEach(task => {
        if (task.priority == "A")
        {
            if (task.divisible)
                tasksAD.push(task);
            else
                tasksAND.push(task);
        } else if (task.priority == "B")
        {
            if (task.divisible)
                tasksBD.push(task);
            else
                tasksBND.push(task);
        } else
            tasksTB.push(task);
    });
}

var startDate = new Date();
startDate.setHours(7);
startDate.setMinutes(0);

var endDate = new Date();
endDate.setHours(8);
endDate.setMinutes(0)

var event = {
    'summary': 'Hello world',
    'start': {
      'dateTime': startDate.toISOString()
    },
    'end': {
      'dateTime': endDate.toISOString()
    }
};

function addEvent(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created successfully');
    });
}

module.exports.generate = generate;