// Generating the schedule
function generate(username)
{
    // Getting the user data
    var tasks = [];
    wu = 0;
    gtb = 0;
    
    connection((db) => {
        db.collection('users')
            .find({ name: username })
            .toArray()
            .then((usersArray) => {
                // Getting the tasks
                tasks = usersArray[0].tasks;
                // Getting wake up and go to bed times
                wu = usersArray[0].wakeUpTime * 2;
                gtb = usersArray[0].goToBedTime * 2;

                generateSchedule(username, tasks, wu, gtb);
            })
            .catch((err) => {
                sendError(err, res);
            });
    })

    

}

function generateSchedule(username, tasks, wu, gtb)
{
    // Sorting the tasks
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
        }
        if (task.priority == "B")
        {
            if (task.divisible)
                tasksBD.push(task);
            else
                tasksBND.push(task);
        }
        if (task.priority == "T")
            tasksTB.push(task);
    });

    // Initialising slot array
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

    // Removing the slots taken by sleep
    for (i = 0; i < wu; ++i)
        slots[i] = -1;
    for (i = gtb; i < SlotsNum; ++i)
        slots[i] = -1;
    tasksTB.forEach(task => {
        TBstartTime = task.startTime * 2;
        TBduration = task.time * 2;
        for (i = TBstartTime; i < TBstartTime + TBduration; ++i)
            slots[i] = -1;
    });

    // Assign AND tasks
    assignND(tasksAND, username);

    // Assign AD tasks
    assignD(tasksAD, username);

    // Assign BND tasks
    assignND(tasksBND, username);

    // Assign BD tasks
    assignD(tasksBD, username);
}

function assignD(taskArr, username)
{
    taskArr.forEach(task => {
        duration = task.time * 2;
        taskId = task.id;
        indexes = [];
        for (i = 0; i < duration; ++i)
        {
            index = indexOfMax(slots);
            indexes.push(index);
            slots[index] = -1;
        }
        for (i = 0; i < duration; ++i)
        {
            if (i == 0)
            {
                connection((db) => {
                    db.collection('users')
                        .update({ name: username, "tasks.id": taskId },
                        {
                            $set: { "tasks.$.startTime": [] }
                        })
                });
            }

            connection((db) => {
                db.collection('users')
                    .update({ name: username, "tasks.id": taskId },
                    {
                        $push: { "tasks.$.startTime": indexes.pop()/2}
                    })
            });
        }
    })
}

function assignND(taskArr, username)
{
    taskArr.forEach(task => {
        duration = task.time * 2;
        maxSum = 0;
        startPos = 0;
        for (i = wu; i < gtb-duration; ++i)
        {
            sum = 0;
            for (j = 0; j < duration; ++j)
            {
                if (slots[i+j] == -1) break;
                sum += slots[i+j];
            }
            if (sum > maxSum)
            {
                maxSum = sum;
                startPos = i;
            }
        }
        for (i = 0; i < duration; ++i)
            slots[startPos+i] = -1;
        connection((db) => {
            db.collection('users')
                .update({ name: username, "tasks.id": task.id },
                {
                    $set: { "tasks.$.startTime": startPos/2 }
                })
        });
    });
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

// Make a new schedule
router.post('/generateSchedule/:usr', (req, res) => {
    generate(req.params.usr);
});