$(window).on('load', function() {
    
    const key = "2d09225b4af4e24c609c28f61841788e";
    const token = "b248004e920b5267c67937631cb49495dcf7475a757a2762634feb0c21090534";
    const listName = "Terminer";

    getDashboardInfo(key, token, listName);
})

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
    var text = "";
    for (i in labelLists){
        text += "<h4>(" + labelLists[i]["number"] + ") " + labelLists[i]["name"] + "</h4>"; 
    }

    $("#categorieTaskList").html(text);
}