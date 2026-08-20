/* eslint-disable max-len */
import { useEffect, useState } from 'react';

function ensureArray(input) {
  return Array.isArray(input) ? input : [];
}

function hidePrivateInformation(taskList) {
  return taskList.map((task) => {
    const isPrivate = (task.labelName || '').toUpperCase() === 'SERVICE NOW';
    return {
      ...task,
      name: isPrivate ? 'Private Task' : task.name
    };
  });
}

async function fetchDashboardData(endpoint) {
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    method: 'GET'
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    const message = payload && payload.error ? payload.error : `Failed to fetch Trello dashboard data (${response.status})`;
    throw new Error(message);
  }

  return {
    todayTask: ensureArray(payload.todayTask),
    yesterdayTask: ensureArray(payload.yesterdayTask),
    allTask: ensureArray(payload.allTask),
    labelList: ensureArray(payload.labelList),
    weekGoals: ensureArray(payload.weekGoals),
    labelListsOfWeek: ensureArray(payload.labelListsOfWeek)
  };
}

function getDefaultEndpoint() {
  return process.env.REACT_APP_TRELLO_DASHBOARD_ENDPOINT || '/api/trello-dashboard';
}

export default function useTrelloTasks() {
  const endpoint = getDefaultEndpoint();

  const [counter, setCounter] = useState(0);
  const [todayTask, setTodayTaskList] = useState(null);
  const [yesterdayTask, setYesterdayTaskList] = useState(null);
  const [allTask, setAllTaskList] = useState(null);
  const [labelList, setLabelList] = useState(null);
  const [labelListsOfWeek, setLabelListsOfWeek] = useState(null);
  const [weekGoals, setWeekGoals] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setError(null);
      try {
        const {
          todayTask: endpointTodayTask,
          yesterdayTask: endpointYesterdayTask,
          allTask: endpointAllTask,
          labelList: endpointLabelList,
          weekGoals: endpointWeekGoals,
          labelListsOfWeek: endpointLabelListsOfWeek
        } = await fetchDashboardData(endpoint);

        setTodayTaskList(hidePrivateInformation(endpointTodayTask));
        setYesterdayTaskList(hidePrivateInformation(endpointYesterdayTask));
        setAllTaskList(endpointAllTask);
        setLabelList(endpointLabelList);
        setLabelListsOfWeek(endpointLabelListsOfWeek);
        setWeekGoals(endpointWeekGoals);
      } catch (hookError) {
        setTodayTaskList([]);
        setYesterdayTaskList([]);
        setAllTaskList([]);
        setLabelList([]);
        setLabelListsOfWeek([]);
        setWeekGoals([]);
        setError(hookError);
        console.error('Dashboard Trello fetch failed', hookError);
      }
    }

    fetchData();

    const timeout = setTimeout(() => {
      setCounter((value) => value + 1);
    }, 30000);

    return () => clearTimeout(timeout);
  }, [counter, endpoint]);

  return [todayTask, yesterdayTask, allTask, labelList, weekGoals, labelListsOfWeek, error];
}
