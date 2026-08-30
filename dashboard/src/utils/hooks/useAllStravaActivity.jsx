




import moment from 'moment';
import { useEffect, useState } from 'react';

const GOOGLE_API_KEY = import.meta.env.REACT_APP_GOOGLE_API_KEY;
const SHEET_NAME = 'Feuille 1';

function mapSheetRows(values = []) {
  const [headers = [], ...rows] = values;
  return rows
    .filter((row) => row.length > 0)
    .map((row) => row.reduce((record, value, index) => ({
      ...record,
      [headers[index]]: value
    }), {}));
}

function useGoogleSheet(sheetId) {
  const configured = Boolean(GOOGLE_API_KEY && sheetId);
  const [state, setState] = useState({
    data: [],
    error: configured ? null : new Error('Sports data is not configured'),
    loading: configured
  });

  useEffect(() => {
    if (!configured) {
      setState({
        data: [],
        error: new Error('Sports data is not configured'),
        loading: false
      });
      return undefined;
    }

    const controller = new AbortController();

    async function fetchSheet() {
      setState({ data: [], error: null, loading: true });
      try {
        const query = new URLSearchParams({ key: GOOGLE_API_KEY });
        query.append('ranges', SHEET_NAME);
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values:batchGet?${query}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Google Sheets request failed (${response.status})`);
        }

        const payload = await response.json();
        const rows = mapSheetRows(payload.valueRanges?.[0]?.values);
        setState({ data: [{ data: rows }], error: null, loading: false });
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setState({ data: [], error: fetchError, loading: false });
        }
      }
    }

    fetchSheet();
    return () => controller.abort();
  }, [configured, sheetId]);

  return state;
}

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
  const { data: stravaSwimData, loading: stravaSwimLoading, error: stravaSwimError } = useGoogleSheet(
    import.meta.env.REACT_APP_STRAVA_SWIM_GOOGLE_SHEETS_ID
  );
  const { data: stravaRunData, loading: stravaRunLoading, error: stravaRunError } = useGoogleSheet(
    import.meta.env.REACT_APP_STRAVA_RUN_GOOGLE_SHEETS_ID
  );
  const { data: stravaHikeData, loading: stravaHikeLoading, error: stravaHikeError } = useGoogleSheet(
    import.meta.env.REACT_APP_STRAVA_HIKE_GOOGLE_SHEETS_ID
  );
  const { data: stravaWalkData, loading: stravaWalkLoading, error: stravaWalkError } = useGoogleSheet(
    import.meta.env.REACT_APP_STRAVA_WALK_GOOGLE_SHEETS_ID
  );

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
