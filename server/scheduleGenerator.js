const {google} = require('googleapis');
const MongoClient = require('mongodb').MongoClient;

var OAuth2 = google.auth.OAuth2;
var oAuth2Client = new google.auth.OAuth2("376770685318-59uhlg6rfsu1fbs8du6h5qh5bh57po2m.apps.googleusercontent.com",
                                            "dfOmWhgKaoaVaRvef-ut0yPS", 
                                            "http://localhost:3000/oauthcallback");

class Slot {
    constructor(number, value, task, taskType) {
        this.number = number;
        this.value = value;
        this.task = task;
        this.taskType = taskType;
    }

    setTask(task, taskType) {
        this.task = task;
        this.taskType = taskType;
    }
}

var replaceFlag;
var fromNowFlag;
var userWuTime;
var userGtbTime;
var slots = [];
var tasks = [];
var tasksAD = [];
var tasksAND = [];
var tasksBD = [];
var tasksBND = [];
var tasksTB = [];
var event;

function generate(username, replace, fromNow, connection) {

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
                replaceFlag = (replace == 'true');
                fromNowFlag = (fromNow == 'true');
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
        currentSlot = new Slot(2*i+1, values[i], null, null);
        slots.push(currentSlot);
        currentSlot = new Slot(2*i+2, Math.round(((values[i] + values[i+1]) / 2) * 100) / 100, null, null);
        slots.push(currentSlot);
    }
    currentSlot = new Slot(96, values[47], null, null);
    slots.push(currentSlot);

    if (fromNowFlag) excludePassed();
    assignSleep();
    assignTB();
    assignND('A');
    assignND('B');
    assignD('A');
    assignD('B');
    createCalendar();

    showSlots();
}

function excludePassed()
{
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var total = hour*4 + Math.floor(minutes / 15) + 1;
    
    for(i = 0; i < total; ++i)
        slots[i].task = "passed";
}

function assignSleep() {
    for (i = 1; i < userWuTime; i++)
    {
        if (slots[i-1].task != "passed")
            slots[i-1].setTask("Sleep", "Sleep");
    }

    for (i = userGtbTime; i < 96; ++i)
    {
        if (slots[i-1].task != "passed")
            slots[i-1].setTask("Sleep", "Sleep");
    }
}

function assignTB() {
    distributeTasks();

    tasksTB.forEach(task => {
        for (i = 0; i < task.time; ++i)
        {
            slots[task.startTime + i - 1].task = task.title;
            slots[task.startTime + i - 1].taskType = "TB";
        }
    });
}

function assignND(type) {
    var tasks;
    var maxSum = -1;
    var maxPos = -1;
    var flag = true;
    var sum;

    if (type == 'A')
        tasks = tasksAND;
    else if (type == 'B')
        tasks = tasksBND;

    tasks.forEach(task => {
        for (i = 0; i < 96-task.time; ++i)
        {
            sum = 0;
            for (j = 0; j < task.time; ++j)
            {
                if (slots[i+j].task != null)
                {
                    flag = false;
                    break;
                }
                sum += slots[i+j].value;
            }
            if (flag && sum > maxSum)
            {
                maxPos = i;
                maxSum = sum;
            }
            else
                flag = true;
        }

        if (maxPos != -1)
        {
            for (i = maxPos; i < maxPos + task.time; ++i)
            {
                slots[i].task = task.title;
                slots[i].taskType = type;
            }
        }

        maxSum = -1;
        maxPos = -1;
    });
}

function assignD(type) {
    var tasks;
    var maxVal = -1;
    var maxPos = -1;
    var timeLeft = 0;

    if (type == 'A')
        tasks = tasksAD;
    else if (type == 'B')
        tasks = tasksBD;

    tasks.forEach(task => {
        timeLeft = parseInt(task.time);
        while (timeLeft > 0)
        {
            for (i = 0; i < 95; ++i)
            {
                if (slots[i].task == null && parseFloat(slots[i].value) > maxVal)
                {
                    maxPos = i;
                    maxVal = parseFloat(slots[i].value);
                }
            }

            if (maxPos != -1)
            {
                slots[maxPos].task = task.title;
                slots[maxPos].taskType = type;
            }

            maxVal = -1;
            maxPos = -1;

            --timeLeft;
        }
    });
}

function distributeTasks() {
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

function createCalendar()
{
    var startDate = new Date();
    var endDate = new Date();
    var duration;
    var i = 0;
    var color;
    var type;

    while (i < 95)
    {
        duration = 1;
        if (slots[i].task != null && slots[i].task != "passed")
        {
            for (j = i+1; j < 95; ++j)
                if (slots[j].task == slots[i].task)
                    ++duration;
                else
                    break;

            startDate.setHours(Math.floor((slots[i].number-1) / 4));
            startDate.setMinutes(((slots[i].number-1) % 4)*15);
            endDate.setHours(Math.floor((slots[i].number+duration-1) / 4));
            endDate.setMinutes(((slots[i].number+duration-1) % 4)*15);
            if (slots[i].number+duration == 96)
                endDate.setMinutes(endDate.getMinutes()+15);

            type = slots[i].taskType;
            color = 11;
            if (type == "Sleep")
                color = 3;
            else if (type == "TB")
                color = 5;
            else if (type == "A")
                color = 10;
            else if (type == "B")
                color = 9;

            event = {
                'summary': slots[i].task,
                'colorId': color,
                'start': {
                  'dateTime': startDate.toISOString()
                },
                'end': {
                  'dateTime': endDate.toISOString()
                }
            };

            addEvent(oAuth2Client);
        }
        i += duration;
        console.log("Dur: " + duration);
    }
}

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

function showSlots()
{
    slots.forEach(slot => {
        console.log(slot.number + ": " + slot.task);
    });
}

module.exports.generate = generate;