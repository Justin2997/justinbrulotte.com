/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import axios from 'axios';
import { useEffect, useState } from 'react';
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

  return [todayTask, yesterdayTask, taskInfo];
}

export default function useTrelloTasks() {
  const key = '2d09225b4af4e24c609c28f61841788e';
  const token = 'b248004e920b5267c67937631cb49495dcf7475a757a2762634feb0c21090534';
  const listName = 'Terminer';

  const [todayTask, setTodayTaskList] = useState(null);
  const [yesterdayTask, setYesterdayTaskList] = useState(null);
  const [allTask, setAllTaskList] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [today, yesterday, all] = await getDashboardInfo(key, token, listName);
      setTodayTaskList(today);
      setYesterdayTaskList(yesterday);
      setAllTaskList(all);
    }
    fetchData();
  }, []);

  return [todayTask, yesterdayTask, allTask];
}
