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
var quantityOfEvents;
var slotsLeft = 96;
var hasError = false;

function generate(username, replace, fromNow, connection, callback) {

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
                generateSlots(callback);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

function generateSlots(callback) {
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
    assignSleep(callback);
    if (!hasError)
        distributeTasks();
    if (!hasError)
        assignTB(callback);
    if (!hasError)
        assignND('A', callback);
    if (!hasError)
        assignND('B', callback);
    if (!hasError)
        assignD('A', callback);
    if (!hasError)
        assignD('B', callback);
    if (!hasError)
        createCalendar(callback);

    //showSlots();
}

function excludePassed()
{
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var total = hour*4 + Math.floor(minutes / 15) + 1;
    
    for(i = 0; i < total; ++i)
        slots[i].task = "passed";

    slotsLeft -= total;
}

function assignSleep(callback) {
    if (userWuTime > userGtbTime) { callback("Error"); hasError = true; return; }
    for (i = 1; i < userWuTime; i++)
    {
        if (slots[i-1].task != "passed")
        {
            slots[i-1].setTask("Sleep", "Sleep");
            --slotsLeft;
        }
            
    }

    for (i = userGtbTime; i < 96; ++i)
    {
        if (slots[i-1].task != "passed")
        {
            slots[i-1].setTask("Sleep", "Sleep");
            --slotsLeft;
        }
            
    }
}

function distributeTasks() {
    tasksAD = [];
    tasksAND = [];
    tasksBD = [];
    tasksBND = [];
    tasksTB = [];

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
    quantityOfEvents = 2 + tasksTB.length + tasksAND.length + tasksBND.length + tasksAD.length + tasksBD.length;
}

function assignTB(callback) {
    tasksTB.forEach(task => {
        for (i = 0; i < task.time; ++i)
        {
            if (slots[task.startTime + i - 1].task != null) { callback("Error"); hasError = true; return; }
            slots[task.startTime + i - 1].task = task.title;
            slots[task.startTime + i - 1].taskType = "TB";
            --slotsLeft;
        }
    });
}

function assignND(type, callback) {
    var tasks;
    var maxSum = -1;
    var maxPos = -1;
    var flag = true;
    var sum;
    var totalTime = 0;

    if (type == 'A')
        tasks = tasksAND;
    else if (type == 'B')
        tasks = tasksBND;

    tasks.forEach(task => {
        totalTime += task.time;
    });
    if (totalTime > slotsLeft) { callback("Error"); hasError = true; return; }

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

    slotsLeft -= totalTime;
}

function assignD(type, callback) {
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
            else { callback("Error"); hasError = true; return; }

            maxVal = -1;
            maxPos = -1;

            --timeLeft;
        }
    });
}

async function createCalendar(callback)
{
    clearCalendar(oAuth2Client, callback);

    var startDate = new Date();
    var endDate = new Date();
    var duration;
    var i = 0;
    var color;
    var type;

    while (i < 95 && !hasError)
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
                color = 3; // purple
            else if (type == "TB")
                color = 5; // yellow
            else if (type == "A")
                color = 10; // light green
            else if (type == "B")
                color = 9; // light blue

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

            console.log("Called AddEvent");
            var sth = await addEvent(oAuth2Client, callback);
        }
        i += duration;
    }
}

function clearCalendar(auth, callback) {
    const calendar = google.calendar({version: 'v3', auth});

    var eventIds = [];

    var strDate = new Date();
    strDate.setHours(0);
    strDate.setMinutes(0);
    var finDate = new Date();
    finDate.setHours(23);
    finDate.setMinutes(59);
  
    calendar.events.list({
      calendarId: 'primary',
      timeMin: strDate.toISOString(),
      timeMax: finDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, {data}) => {
      if (err)
      { 
        callback("Error");
        hasError = true;
        return console.log('The API returned an error: ' + err);
      }

      if (!hasError)
      {
      const events = data.items;
      if (events.length) {
        events.map((event, i) => {
          eventIds.push(event.id);
        });
      } else {
        console.log('No events found.');
      }

      eventIds.forEach(id => {
        calendar.events.delete({
            auth: auth,
            calendarId: 'primary',
            eventId: id,
          }, function(err) {
            if (err) {
              console.log('Error: ' + err);
              callback("Error");
              hasError = true;
              return;
            }
          });
      });
      console.log("Calendar is clear!");
    }

    });
}

async function addEvent(auth, callback) {
  const calendar = google.calendar({version: 'v3', auth});

    var sth = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        callback("Error");
        hasError = true;
        return;
      }
      console.log('Event created successfully');
      --quantityOfEvents;
      if (quantityOfEvents == 0)
        callback("Done");
    });
}

function showSlots()
{
    slots.forEach(slot => {
        console.log(slot.number + ": " + slot.task);
    });
}

module.exports.generate = generate;