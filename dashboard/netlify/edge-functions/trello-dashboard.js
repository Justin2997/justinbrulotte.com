function toSafeDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toStartOfDay(value) {
  const parsed = toSafeDate(value);
  if (!parsed) {
    return null;
  }

  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isSameLocalDay(firstDate, secondDate) {
  const firstDay = toStartOfDay(firstDate);
  const secondDay = toStartOfDay(secondDate);
  return !!firstDay && !!secondDay && firstDay.getTime() === secondDay.getTime();
}

function getLabelName(card) {
  if (!card.labels || card.labels.length === 0) {
    return null;
  }

  return card.labels[0].name;
}

function ensureLabel(labelName, list) {
  if (!labelName) {
    return null;
  }

  for (let i = 0; i < list.length; i += 1) {
    if (labelName === list[i].name) {
      return i;
    }
  }

  list.push({ name: labelName, number: 0 });
  return list.length - 1;
}

async function fetchTrelloJson(url, key, token) {
  const requestUrl = `${url}${url.includes('?') ? '&' : '?'}key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`;
  const response = await fetch(requestUrl, { method: 'GET' });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Trello API error ${response.status}: ${message}`);
  }

  return response.json();
}

async function getTrelloBoardLists(boardId, key, token) {
  return fetchTrelloJson(`https://api.trello.com/1/boards/${boardId}/lists/`, key, token);
}

async function getTrelloListCards(boardId, key, token, filter) {
  const listFilter = filter || 'all';
  const encodedFilter = encodeURIComponent(listFilter);
  return fetchTrelloJson(`https://api.trello.com/1/lists/${boardId}/cards/?filter=${encodedFilter}`, key, token);
}

async function getTrelloListCardsByName(boardId, key, token, filter, listName, boardListsOverride) {
  const boardLists = boardListsOverride || await getTrelloBoardLists(boardId, key, token);
  const targetList = boardLists.find((element) => element.name === listName);
  if (targetList === undefined) {
    return [];
  }

  const cards = await getTrelloListCards(targetList.id, key, token, filter);
  return cards.map((card) => ({
    id: card.id || `${Math.random()}`,
    name: card.name,
    labelName: getLabelName(card),
    dateLastActivity: card.dateLastActivity,
    due: card.due,
    shortUrl: card.shortUrl
  }));
}

function buildDashboardPayload(allBoardCards, weekGoals, todayStart, yesterdayStart, thirtyDaysAgoTime, weekAgoTime) {
  const allTask = [];
  const todayTask = [];
  const yesterdayTask = [];
  const labelListsLast30days = [];
  const labelListsOfWeek = [];

  for (let i = 0; i < allBoardCards.length; i += 1) {
    const source = allBoardCards[i];
    const card = {
      id: source.id || `${i + 1}`,
      name: source.name,
      labelName: getLabelName(source),
      dateLastActivity: source.dateLastActivity,
      due: source.due,
      shortUrl: source.shortUrl
    };

    const completionDate = toSafeDate(source.dateLastActivity) || toSafeDate(source.due);
    const completionTime = completionDate === null ? null : completionDate.getTime();

    if (completionDate !== null) {
      if (isSameLocalDay(completionDate, todayStart)) {
        todayTask.push(card);
      }
      if (isSameLocalDay(completionDate, yesterdayStart)) {
        yesterdayTask.push(card);
      }
      if (completionTime >= thirtyDaysAgoTime) {
        const labelIndex = ensureLabel(card.labelName, labelListsLast30days);
        if (labelIndex !== null) {
          labelListsLast30days[labelIndex].number += 1;
        }
      }
      if (completionTime >= weekAgoTime) {
        const labelIndex = ensureLabel(card.labelName, labelListsOfWeek);
        if (labelIndex !== null) {
          labelListsOfWeek[labelIndex].number += 1;
        }
      }
    }

    allTask.push(card);
  }

  return {
    todayTask,
    yesterdayTask,
    allTask,
    labelList: labelListsLast30days,
    weekGoals,
    labelListsOfWeek
  };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store'
    }
  });
}

export default async (request, context) => {
  const env = (context && context.env) ? context.env : {};

  const key = env.TRELLO_BOARD_KEY || process.env.TRELLO_BOARD_KEY;
  const token = env.TRELLO_TOKEN || process.env.TRELLO_TOKEN;
  const currentBoardId = env.TRELLO_CURRENT_BOARD_ID || process.env.TRELLO_CURRENT_BOARD_ID || 'vfd1UBY0';
  const archiveBoardId = env.TRELLO_ARCHIVE_BOARD_ID || process.env.TRELLO_ARCHIVE_BOARD_ID || '9eIJ6tGN';
  const weekGoalsListName = env.TRELLO_WEEK_GOALS_LIST_NAME || process.env.TRELLO_WEEK_GOALS_LIST_NAME || 'Semaine (Top 3)';

  if (!key || !token) {
    return jsonResponse({ error: 'Missing TRELLO_BOARD_KEY or TRELLO_TOKEN' }, 500);
  }

  const today = new Date();
  const todayStart = toStartOfDay(today);
  const yesterdayStart = toStartOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const thirtyDaysAgo = toStartOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const weekAgo = toStartOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  try {
    const boardLists = await getTrelloBoardLists(archiveBoardId, key, token);
    const cardQueries = boardLists.map((list) => getTrelloListCards(list.id, key, token, 'all'));
    const cardGroups = await Promise.all(cardQueries);
    const allBoardCards = cardGroups.flat();

    const weekGoals = await getTrelloListCardsByName(currentBoardId, key, token, 'open', weekGoalsListName, null);
    const payload = buildDashboardPayload(
      allBoardCards,
      weekGoals,
      todayStart,
      yesterdayStart,
      thirtyDaysAgo === null ? 0 : thirtyDaysAgo.getTime(),
      weekAgo === null ? 0 : weekAgo.getTime()
    );

    return jsonResponse(payload);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Unknown Trello backend error' }, 500);
  }
};

export const config = {
  path: '/api/trello-dashboard'
};
