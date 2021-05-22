/* eslint-disable max-len */
/* eslint-disable operator-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { v4 as uuid } from 'uuid';

async function getTrelloBoardInfo(key, token) {
  const url = `https://api.trello.com/1/boards/vfd1UBY0?key=${key}&token=${token}`;
  const data = await axios.get(url);

  return data.data;
}

async function getTrelloBoardLists(key, token) {
  const url = `https://api.trello.com/1/boards/vfd1UBY0/lists/?key=${key}&token=${token}`;
  const data = await axios.get(url);

  return data.data;
}

async function getTrelloListCards(key, token, listId) {
  const url = `https://api.trello.com/1/lists/${listId}/cards/?key=${key}&token=${token}`;
  const data = await axios.get(url);
  return data.data;
}

async function getTrelloListCardsForName(key, token, listName) {
  const boardLists = await getTrelloBoardLists(key, token);
  const doneListId = boardLists.find((element) => element.name === listName).id;
  const cards = await getTrelloListCards(key, token, doneListId);

  let i;
  const weekList = [];
  for (i in cards) {
    const {
      dateLastActivity, shortUrl, due, name
    } = cards[i];
    const label = cards[i].labels[0];

    const obj = {
      id: uuid(), name, labelName: label.name, dateLastActivity, due, shortUrl
    };
    weekList.push(obj);
  }

  return weekList;
}

async function getDashboardInfo(key, token, listName) {
  await getTrelloBoardInfo(key, token);

  const boardLists = await getTrelloBoardLists(key, token);
  const doneListId = boardLists.find((element) => element.name === listName).id;

  const cards = await getTrelloListCards(key, token, doneListId);

  let i;
  const taskInfo = [];
  const todayTask = [];
  const yesterdayTask = [];
  const labelLists = [];

  for (i in cards) {
    const {
      dateLastActivity, shortUrl, due, name
    } = cards[i];
    const label = cards[i].labels[0];
    let labelName;

    if (label !== undefined) {
      labelName = label.name;
      let newLabel = true;
      for (i in labelLists) {
        if (labelName === labelLists[i].name) {
          newLabel = false;
        }
      }
      if (newLabel) {
        labelLists.push({ name: labelName, number: 0 });
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

      if (dueDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
        todayTask.push(obj);
      } else if (dueDate.setHours(0, 0, 0, 0) === yesterdayDate.setHours(0, 0, 0, 0)) {
        yesterdayTask.push(obj);
      }
    }

    taskInfo.push(obj);
  }

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth((today.getMonth() - 1) % 12);

  const lastLastMonth = new Date();
  lastLastMonth.setMonth((today.getMonth() - 2) % 12);

  const lastMonthList = taskInfo.filter((task) => {
    const date = new Date(task.due);
    return (lastMonth.getMonth() === date.getMonth() || lastLastMonth.getMonth() === date.getMonth());
  });

  // Number of task in any categorie
  let e;
  for (e in lastMonthList) {
    let t;
    for (t in labelLists) {
      if (taskInfo[e].labelName === labelLists[t].name) {
        labelLists[t].number = labelLists[t].number + 1;
      }
    }
  }

  return [todayTask, yesterdayTask, taskInfo, labelLists];
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
  const key = '2d09225b4af4e24c609c28f61841788e';
  const token = 'b248004e920b5267c67937631cb49495dcf7475a757a2762634feb0c21090534';

  const finishListName = 'Terminer';
  const weekGoalsListName = 'Semaine (Top 3)';

  const { user } = useAuth0();

  const [counter, setCounter] = useState(0);

  const [todayTask, setTodayTaskList] = useState(null);
  const [yesterdayTask, setYesterdayTaskList] = useState(null);
  const [allTask, setAllTaskList] = useState(null);
  const [labelList, setLabelList] = useState(null);
  const [weekGoals, setWeekGoals] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [today, yesterday, all, labelLists] = await getDashboardInfo(key, token, finishListName);
      const goals = await getTrelloListCardsForName(key, token, weekGoalsListName);

      setTodayTaskList(hidePrivateInformation(today, user));
      setYesterdayTaskList(hidePrivateInformation(yesterday, user));
      setAllTaskList(all);
      setLabelList(labelLists);
      setWeekGoals(goals);
    }

    const timeout = setTimeout(() => {
      setCounter(counter + 1);
    }, 10000);

    fetchData();
    return () => clearTimeout(timeout);
  }, [counter]);

  return [todayTask, yesterdayTask, allTask, labelList, weekGoals];
}
