/* eslint-disable max-len */
/* eslint-disable operator-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import useGoogleSheets from 'use-google-sheets';
import moment from 'moment';

function parseDate(dateValue) {
  const dateString = dateValue ? dateValue.replace('at ', '') : '';
  const date = moment(dateString, 'LLL');
  return date.isValid() ? date : null;
}

function sortActivity(a, b) {
  const Adate = parseDate(a.date);
  const Bdate = parseDate(b.date);

  if (!Adate && !Bdate) {
    return 0;
  }
  if (!Adate) {
    return 1;
  }
  if (!Bdate) {
    return -1;
  }
  if (Adate < Bdate) {
    return 1;
  }
  if (Adate > Bdate) {
    return -1;
  }
  return 0;
}

function safeRows(sheetData) {
  if (!Array.isArray(sheetData) || !Array.isArray(sheetData[0]?.data)) {
    return [];
  }

  return sheetData[0].data;
}

function filterCurrentMonth(activityRows, today) {
  return activityRows.filter((activity) => {
    const date = parseDate(activity.date);
    if (!date) {
      return false;
    }
    return (today.month() === date.month() && today.year() === date.year());
  });
}

function formatStravaData(stravaSwimData, stravaRunData, stravaHikeData, stravaWalkData) {
  const today = moment();

  const thisMonthHike = filterCurrentMonth(safeRows(stravaHikeData), today);
  const thisMonthSwim = filterCurrentMonth(safeRows(stravaSwimData), today);
  const thisMonthRun = filterCurrentMonth(safeRows(stravaRunData), today);
  const thisMonthWalk = filterCurrentMonth(safeRows(stravaWalkData), today);
  const thisMonthActivities = [...thisMonthHike, ...thisMonthSwim, ...thisMonthRun, ...thisMonthWalk];
  thisMonthActivities.sort(sortActivity);

  return thisMonthActivities;
}

export default function useAllStravaActivity() {
  const commonConfig = { apiKey: process.env.REACT_APP_GOOGLE_API_KEY };
  const { data: stravaSwimData, loading: stravaSwimLoading, error: stravaSwimError } = useGoogleSheets({
    ...commonConfig,
    sheetId: process.env.REACT_APP_STRAVA_SWIM_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaSwimError) { console.error(stravaSwimError); } // TODO: Add error to the user

  const { data: stravaRunData, loading: stravaRunLoading, error: stravaRunError } = useGoogleSheets({
    ...commonConfig,
    sheetId: process.env.REACT_APP_STRAVA_RUN_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaRunError) { console.error(stravaRunError); } // TODO: Add error to the user

  const { data: stravaHikeData, loading: stravaHikeLoading, error: stravaHikeError } = useGoogleSheets({
    ...commonConfig,
    sheetId: process.env.REACT_APP_STRAVA_HIKE_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaHikeError) { console.error(stravaHikeError); } // TODO: Add error to the user

  const { data: stravaWalkData, loading: stravaWalkLoading, error: stravaWalkError } = useGoogleSheets({
    ...commonConfig,
    sheetId: process.env.REACT_APP_STRAVA_WALK_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaWalkError) { console.error(stravaWalkError); } // TODO: Add error to the user

  if (stravaSwimLoading || stravaRunLoading || stravaHikeLoading || stravaWalkLoading) {
    return [null, true, null];
  }

  const error = stravaSwimError || stravaRunError || stravaHikeError || stravaWalkError;
  if (error) {
    return [[], false, error];
  }

  const stravaData = formatStravaData(stravaSwimData, stravaRunData, stravaHikeData, stravaWalkData);
  return [stravaData, false, null];
}
