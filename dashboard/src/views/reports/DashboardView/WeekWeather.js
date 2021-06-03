/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  Divider,
  CircularProgress,
} from '@material-ui/core';

import useWeather from 'src/utils/hooks/useWeather';

const template = { __html: '<a class="weatherwidget-io" href="https://forecast7.com/en/45d40n71d88/sherbrooke/" data-label_1="SHERBROOKE" data-label_2="WEATHER" data-font="Helvetica" data-icons="Climacons Animated" data-mode="Forecast" data-days="5" data-theme="original" >SHERBROOKE WEATHER</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://weatherwidget.io/js/widget.min.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","weatherwidget-io-js");</script>' };

function WeekWeather({ city }) {
  const [weekWeather] = useWeather(city);

  if (weekWeather === []) {
    return (
      <Card>
        <CardHeader
          title="Week Weather"
        />
        <Divider />
        <CircularProgress />
      </Card>
    );
  }

  console.log('weekWeather', weekWeather);

  return (
    <Card>
      <CardHeader
        subtitle={`${weekWeather.length} in total`}
        title="Next 5 day weather"
      />
      <Divider />
      <div innerHTML={template} />
    </Card>
  );
}

WeekWeather.propTypes = {
  city: PropTypes.string
};

export default WeekWeather;
