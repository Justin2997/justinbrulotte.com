/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable operator-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { v4 as uuid } from 'uuid';

async function getTrelloBoardInfo(boardId, key, token) {
  const url = `https://api.trello.com/1/boards/${boardId}?key=${key}&token=${token}`;
  const data = await axios.get(url);

  return data.data;
}

async function getTrelloBoardLists(boardId, key, token) {
  const url = `https://api.trello.com/1/boards/${boardId}/lists/?key=${key}&token=${token}`;
  const data = await axios.get(url);

  return data.data;
}

async function getTrelloListCards(key, token, listId, filter) {
  const url = `https://api.trello.com/1/lists/${listId}/cards/?key=${key}&token=${token}&filter=${filter}`;
  const data = await axios.get(url);
  return data.data;
}

async function getTrelloListCardsForName(boardId, key, token, filter, listName) {
  const boardLists = await getTrelloBoardLists(boardId, key, token);
  const doneListId = boardLists.find((element) => element.name === listName).id;
  const cards = await getTrelloListCards(key, token, doneListId, filter);

  let i;
  const weekList = [];
  for (i in cards) {
    const {
      dateLastActivity, shortUrl, due, name
    } = cards[i];
    const label = cards[i].labels[0];

    if (label) {
      const obj = {
        id: uuid(), name, labelName: label.name, dateLastActivity, due, shortUrl
      };
      weekList.push(obj);
    }
  }

  return weekList;
}

async function getDashboardInfo(boardId, key, token) {
  const allBoardCards = [];
  await getTrelloBoardInfo(boardId, key, token);

  const boardLists = await getTrelloBoardLists(boardId, key, token);
  for (const index in boardLists) {
    const doneListId = boardLists[index].id;
    const cards = await getTrelloListCards(key, token, doneListId, 'all');
    allBoardCards.push(...cards);
  }

  let i;
  const taskInfo = [];
  const yesterdayTask = [];
  const labelListsLast30days = [];
  const labelListsOfWeek = [];

  const today = new Date();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  for (i in allBoardCards) {
    const {
      dateLastActivity, shortUrl, due, name
    } = allBoardCards[i];
    const label = allBoardCards[i].labels[0];
    let labelName;

    if (label !== undefined) {
      labelName = label.name;
      let newLabel = true;
      for (i in labelListsLast30days) {
        if (labelName === labelListsLast30days[i].name) {
          newLabel = false;
        }
      }
      if (newLabel) {
        labelListsLast30days.push({ name: labelName, number: 0 });
        labelListsOfWeek.push({ name: labelName, number: 0 });
      }
    }

    const obj = {
      id: uuid(), name, labelName, dateLastActivity, due, shortUrl
    };
    if (due != null) {
      const dueDate = new Date(due);
      const todaysDate = new Date();
      const yesterdayDate = new Date();
      yesterdayDate.setDate(todaysDate.getDate() - 1);

      if (dueDate.setHours(0, 0, 0, 0) === yesterdayDate.setHours(0, 0, 0, 0)) {
        yesterdayTask.push(obj);
      }
    }

    taskInfo.push(obj);
  }

  const priorDate = new Date().setDate(today.getDate() - 30);
  const lastMonthList = taskInfo.filter((task) => {
    const date = new Date(task.due);
    return (priorDate <= date.getTime());
  });

  // Number of task in any categorie
  let e;
  for (e in lastMonthList) {
    let t;
    for (t in labelListsLast30days) {
      if (taskInfo[e].labelName === labelListsLast30days[t].name) {
        labelListsLast30days[t].number = labelListsLast30days[t].number + 1;
      }
    }
  }

  // Numer of task in any categorie for this week
  const lastWeekList = taskInfo.filter((task) => {
    const date = new Date(task.due);
    return (lastWeek.getTime() < date.getTime());
  });

  // Number of task in any categorie
  for (e in lastWeekList) {
    let t;
    for (t in labelListsOfWeek) {
      if (taskInfo[e].labelName === labelListsOfWeek[t].name) {
        labelListsOfWeek[t].number = labelListsOfWeek[t].number + 1;
      }
    }
  }

  return [yesterdayTask, taskInfo, labelListsLast30days, labelListsOfWeek];
}

function hidePrivateInformation(taskList, user) {
  if (user && user.email === 'justin.brlotte797@gmail.com' && user.email_verified) {
    return taskList;
  }

  let index;
  const finalTaskArray = [];
  for (index in taskList) {
    const task = taskList[index];
    if (task.labelName.toUpperCase() === 'SERVICE NOW') {
      task.name = 'Private Task';
    }
    finalTaskArray.push(task);
  }

  return finalTaskArray;
}

export default function useTrelloTasks() {
  const key = process.env.REACT_APP_TRELLO_BOARD_KEY;
  const token = process.env.REACT_APP_TRELLO_TOKEN;

  const todayTaskName = 'Done';
  const weekGoalsListName = 'Semaine (Top 3)';

  const currentBoardId = 'vfd1UBY0';
  const archiveBoardId = '6d2xFUep';

  const { user } = useAuth0();

  const [counter, setCounter] = useState(0);

  const [todayTask, setTodayTaskList] = useState(null);
  const [yesterdayTask, setYesterdayTaskList] = useState(null);
  const [allTask, setAllTaskList] = useState(null);
  const [labelList, setLabelList] = useState(null);
  const [labelListsOfWeek, setLabelListsOfWeek] = useState(null);
  const [weekGoals, setWeekGoals] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [yesterday, all, labelLists, labelWeek] = await getDashboardInfo(archiveBoardId, key, token);
      const goals = await getTrelloListCardsForName(currentBoardId, key, token, 'open', weekGoalsListName);
      const today = await getTrelloListCardsForName(currentBoardId, key, token, 'open', todayTaskName);

      setTodayTaskList(hidePrivateInformation(today, user));
      setYesterdayTaskList(hidePrivateInformation(yesterday, user));
      setAllTaskList(all);
      setLabelList(labelLists);
      setWeekGoals(goals);
      setLabelListsOfWeek(labelWeek);
    }

    const timeout = setTimeout(() => {
      setCounter(counter + 1);
    }, 30000);

    fetchData();
    return () => clearTimeout(timeout);
  }, [counter]);

  return [todayTask, yesterdayTask, allTask, labelList, weekGoals, labelListsOfWeek];
}
