$(window).on('load', function() {
    
    const key = "2d09225b4af4e24c609c28f61841788e";
    const token = "b248004e920b5267c67937631cb49495dcf7475a757a2762634feb0c21090534";
    const listName = "Terminer";

    getDashboardInfo(key, token, listName);
})

async function getFitBitInformation(key, client_id, scopes){

}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    console.log("handleClientLoad")
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    console.log("initClient")
    const API_KEY = "AIzaSyC9vcibuupD8VTkcDLC7mwYTLrWcRwqol4";
    const CLIENT_ID = "579995592859-3ogboqk5n4gc938c64f3qfeip2mbnlgi.apps.googleusercontent.com"; // This is not a commit file
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
    
    var authorizeButton = document.getElementById('authorize_button');
    var signoutButton = document.getElementById('signout_button');
    
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        console.log("done")
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        console.log("getAuthInstance")

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
        appendPre('Name, Major:');
        for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            appendPre(row[0] + ', ' + row[4]);
        }
        } else {
        appendPre('No data found.');
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
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

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