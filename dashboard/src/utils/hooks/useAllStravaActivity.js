/* eslint-disable max-len */
/* eslint-disable operator-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import useGoogleSheets from 'use-google-sheets';
import moment from 'moment';

function sortActivity(a, b) {
  const AdateString = a.date.replace('at ', '');
  const Adate = moment(AdateString, 'LLL');

  const BdateString = b.date.replace('at ', '');
  const Bdate = moment(BdateString, 'LLL');

  if (Adate < Bdate) {
    return 1;
  }
  if (Adate > Bdate) {
    return -1;
  }
  return 0;
}

function formatStravaData(stravaSwimData, stravaRunData, stravaHikeData) {
  const today = moment();

  const thisMonthHike = stravaHikeData[0].data.filter((activity) => {
    const dateString = activity.date.replace('at ', '');
    const date = moment(dateString, 'LLL');
    return (today.month() === date.month() && today.year() === date.year());
  });

  const thisMonthSwim = stravaSwimData[0].data.filter((activity) => {
    const dateString = activity.date.replace('at ', '');
    const date = moment(dateString, 'LLL');
    return (today.month() === date.month() && today.year() === date.year());
  });

  const thisMonthRun = stravaRunData[0].data.filter((activity) => {
    const dateString = activity.date.replace('at ', '');
    const date = moment(dateString, 'LLL');
    return (today.month() === date.month() && today.year() === date.year());
  });

  const thisMonthActivities = [...thisMonthHike, ...thisMonthSwim, ...thisMonthRun];
  thisMonthActivities.sort(sortActivity);

  return (thisMonthActivities);
}

export default function useAllStravaActivity() {
  const { data: stravaSwimData, loading: stravaSwimLoading, error: stravaSwimError } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_STRAVA_SWIM_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaSwimError) { console.error(stravaSwimError); } // TODO: Add error to the user

  const { data: stravaRunData, loading: stravaRunLoading, error: stravaRunError } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_STRAVA_RUN_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaRunError) { console.error(stravaRunError); } // TODO: Add error to the user

  const { data: stravaHikeData, loading: stravaHikeLoading, error: stravaHikeError } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_STRAVA_HIKE_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (stravaHikeError) { console.error(stravaHikeError); } // TODO: Add error to the user

  if (stravaSwimLoading || stravaRunLoading || stravaHikeLoading) {
    return [null, true];
  }

  const stravaData = formatStravaData(stravaSwimData, stravaRunData, stravaHikeData);
  return [stravaData, stravaSwimLoading || stravaRunLoading || stravaHikeLoading];
}
