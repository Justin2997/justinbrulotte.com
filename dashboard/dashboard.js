$(window).on('load', function() {
    
    const key = "2d09225b4af4e24c609c28f61841788e";
    const token = "b248004e920b5267c67937631cb49495dcf7475a757a2762634feb0c21090534";
    const listName = "Terminer";

    getDashboardInfo(key, token, listName);
})

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    const API_KEY = "AIzaSyDRzKqPk_yqcONmN_U9n6NQuJpJMBNcBg4";
    const CLIENT_ID = "267762412193-7srgjq0vc5h59ssr6ncnsu2em5fkrraq.apps.googleusercontent.com"; // This is not a commit file
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
    
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function appendPre(message) {
    var pre = document.getElementById('activity_content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function listActivity() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '16dVoDQw56K-6d522SKjp8I31zyM9-kRK5CIkhcUDngc',
        range: 'Data!A:L',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            appendPre('Date , Time');
            var average = 0;
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                average = average + parseInt(row[11]);
                if (getWeek(new Date()) === getWeek(new Date(row[0])) && parseInt(row[11]) != 0){
                    appendPre(row[0] + ', ' + row[11] + ' minutes');
                }
            }
            average = average / range.values.length;
            var text = "<h5> Average activity : " + parseInt(average) + " minutes </h5>";
            text +=  "<h5> Total number of activity : " + range.values.length + "</h5>"
            $('#average_activity').html(text);
        } 
        else {
            appendPre('No data.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listActivity();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

var getWeek = function (d) {
    // Create a copy of this date object  
    var target  = new Date(d.valueOf());  
    
    // ISO week date weeks start on monday  
    // so correct the day number  
    var dayNr   = (d.getDay() + 6) % 7;  
  
    // Set the target to the thursday of this week so the  
    // target date is in the right year  
    target.setDate(target.getDate() - dayNr + 3);  
  
    // ISO 8601 states that week 1 is the week  
    // with january 4th in it  
    var jan4    = new Date(target.getFullYear(), 0, 4);  
  
    // Number of days between target date and january 4th  
    var dayDiff = (target - jan4) / 86400000;    
  
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    var weekNr = 1 + Math.ceil(dayDiff / 7);    
    return weekNr;    
  };

var sort_by = function(field, reverse, primer){
    var key = function (x) {return primer ? primer(x[field]) : x[field];};
    return function (a,b) {
        var A = key(a), B = key(b);
        return (((A < B) ? -1 :
                (A > B) ? +1 : 0)) * [-1,1][+!!reverse];
    };
 };

async function getDashboardInfo(key,token, listName){
    getTrelloBoardInfo(key, token).then(info => {
        const id = info["id"];
        const name = info["name"];

        getTrelloBoardLists(key, token).then(lists => {
            var listId;
            for(i in lists){
                if (lists[i]["name"] === listName) {
                    listId = lists[i]["id"];
                }
            }

            getTrelloListCards(key, token, listId).then(cards => {
                var taskInfo = [];
                var todayTask = [];
                var labelLists = [];

                for(i in cards){
                    const dateLastActivity = cards[i]["dateLastActivity"];
                    const due = cards[i]["due"];
                    const label = cards[i]["labels"][0];
                    const name = cards[i]["name"];
                    var labelName = undefined;

                    if (label !== undefined) {  
                        labelName = label["name"];   
                        var newLabel = true;
                        for (i in labelLists) {
                            if (labelName === labelLists[i]["name"]){
                                newLabel = false;
                            }
                        }
                        if (newLabel){
                            labelLists.push({ name: labelName, number: 0 });
                        }   
                    }

                    var obj = { "name": name, "labelName": labelName, "dateLastActivity": dateLastActivity, "due": due };
                    if (due != null){
                        var dueDate = new Date(due);
                        var todaysDate = new Date();

                        if(dueDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
                            todayTask.push(obj);
                        }
                    }
            
                    taskInfo.push(obj);
                }

                // Number of task in any categorie
                for (e in taskInfo){
                    // TODO build a key value objet array so that I can map it
                    for (t in labelLists) {
                        if (taskInfo[e]["labelName"] === labelLists[t]["name"]){
                            labelLists[t]["number"] = labelLists[t]["number"] + 1;
                        }
                    }
                }
                const numberOfTaskDoneToday = todayTask.length;
                printCategorieList(labelLists);
                printTodayTask(numberOfTaskDoneToday, todayTask);
            });
        });
    });
}

async function getTrelloBoardInfo(key, token) {
    const url = "https://api.trello.com/1/boards/vfd1UBY0?key=" + key + "&token=" + token;
    return $.getJSON(url, function( data ) {
        return data;
    });
}

async function getTrelloBoardLists(key, token) {
    const url = "https://api.trello.com/1/boards/vfd1UBY0/lists/?key=" + key + "&token=" + token;
    return $.getJSON(url, function( data ) {
        return data;
    });
}

async function getTrelloListCards(key, token, listId) {
    const url = "https://api.trello.com/1/lists/" + listId + "/cards/?key=" + key + "&token=" + token;
    return $.getJSON(url, function( data ) {
        return data;
    });
}

function printCategorieList(labelLists) {
    labelLists.sort(sort_by('number', false, parseInt));

    var text = "";
    for (i in labelLists){
        text += "<h5>(" + labelLists[i]["number"] + ") " + labelLists[i]["name"] + "</h5>"; 
    }

    $("#categorieTaskList").html(text);
}

function printTodayTask(numberOfTaskDoneToday, todayTask) {
    todayTask.sort(sort_by('labelName', true, function(a){ return a.toUpperCase() }));

    var text = "";
    for (i in todayTask){
        text += "<h5>(" + todayTask[i]["labelName"] + ") " + todayTask[i]["name"] + "</h5>"; 
    }
    text += "<br><h5>Total number of task done today : " + numberOfTaskDoneToday + "</h5>" ;

    $("#todayTask").html(text);
}