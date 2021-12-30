import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getDuration } from '../utils/common';

const INITIAL_TIME = 0;
const BAR_HEIGHT = 55;
const CHART_PARAMETERS = {
  BACKGROUND_COLOR: '#ffffff',
  HOVER_BACKGROUND_COLOR: '#ffffff',
  TYPE: 'horizontalBar',
  ANCHOR: 'start',
  BAR_THIKNESS: 44,
  MIN_BAR_LENGTH: 100,
  DATALABELS_FONT_SIZE: 13,
  DATALABELS_COLOR: '#000000',
  DATALABELS_ANCHOR: 'end',
  DATALABELS_ALIGN: 'start',
  TITLE_DISPLAY: true,
  TITLE_TEXT_MONEY: 'MONEY',
  TITLE_TEXT_TYPE: 'TYPE',
  TITLE_TEXT_TIME_SPEND: 'TIME-SPEND',
  TITLE_FONT_COLOR: '#000000',
  TITLE_FONT_SIZE: 23,
  TITLE_POSITION: 'left',
  Y_AXES_TICKS_FONT_COLOR: '#000000',
  Y_AXES_TICKS_PADDING: 5,
  Y_AXES_TICKS_FONT_SIZE: 13,
  Y_AXES_GRID_LINES_DISPLAY: false,
  Y_AXES_GRID_LINES_DROW_BORDER: false,
  X_AXES_TICKS_DISPLAY: false,
  X_AXES_TICKS_BEGIN_AT_ZERO: true,
  X_AXES_GRID_LINES_DISPLAY: false,
  X_AXES_GRID_LINES_DROW_BORDER: false,
  LEGEND_DISPLAY: false,
  LEGEND_TOOLTIPS_ENABLED: false,
};

const renderMoneyChart = (moneyCtx, moneyData) => (
  new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: CHART_PARAMETERS.TYPE,
    data: {
      labels: Object.keys(moneyData),
      datasets: [{
        data: Object.values(moneyData),
        backgroundColor: CHART_PARAMETERS.BACKGROUND_COLOR,
        hoverBackgroundColor: CHART_PARAMETERS.HOVER_BACKGROUND_COLOR,
        anchor: CHART_PARAMETERS.ANCHOR,
        barThickness: CHART_PARAMETERS.BAR_THIKNESS,
        minBarLength: CHART_PARAMETERS.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: CHART_PARAMETERS.DATALABELS_FONT_SIZE,
          },
          color: CHART_PARAMETERS.DATALABELS_COLOR,
          anchor: CHART_PARAMETERS.DATALABELS_ANCHOR,
          align: CHART_PARAMETERS.DATALABELS_ALIGN,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: CHART_PARAMETERS.TITLE_DISPLAY,
        text: CHART_PARAMETERS.TITLE_TEXT_MONEY,
        fontColor: CHART_PARAMETERS.TITLE_FONT_COLOR,
        fontSize: CHART_PARAMETERS.TITLE_FONT_SIZE,
        position: CHART_PARAMETERS.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: CHART_PARAMETERS.Y_AXES_TICKS_FONT_COLOR,
            padding: CHART_PARAMETERS.Y_AXES_TICKS_PADDING,
            fontSize: CHART_PARAMETERS.Y_AXES_TICKS_FONT_SIZE,
          },
          gridLines: {
            display: CHART_PARAMETERS.Y_AXES_GRID_LINES_DISPLAY,
            drawBorder: CHART_PARAMETERS.Y_AXES_GRID_LINES_DROW_BORDER,
          },
        }],
        xAxes: [{
          ticks: {
            display: CHART_PARAMETERS.X_AXES_GRID_LINES_DISPLAY,
            beginAtZero: CHART_PARAMETERS.X_AXES_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: CHART_PARAMETERS.X_AXES_GRID_LINES_DISPLAY,
            drawBorder: CHART_PARAMETERS.X_AXES_GRID_LINES_DROW_BORDER,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);

const renderTypeChart = (typeCtx, typeData) => (
  new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: CHART_PARAMETERS.TYPE,
    data: {
      labels: Object.keys(typeData),
      datasets: [{
        data: Object.values(typeData),
        backgroundColor: CHART_PARAMETERS.BACKGROUND_COLOR,
        hoverBackgroundColor: CHART_PARAMETERS.HOVER_BACKGROUND_COLOR,
        anchor: CHART_PARAMETERS.ANCHOR,
        barThickness: CHART_PARAMETERS.BAR_THIKNESS,
        minBarLength: CHART_PARAMETERS.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: CHART_PARAMETERS.DATALABELS_FONT_SIZE,
          },
          color: CHART_PARAMETERS.DATALABELS_COLOR,
          anchor: CHART_PARAMETERS.DATALABELS_ANCHOR,
          align: CHART_PARAMETERS.DATALABELS_ALIGN,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: CHART_PARAMETERS.TITLE_DISPLAY,
        text: CHART_PARAMETERS.TITLE_TEXT_TYPE,
        fontColor: CHART_PARAMETERS.TITLE_FONT_COLOR,
        fontSize: CHART_PARAMETERS.TITLE_FONT_SIZE,
        position: CHART_PARAMETERS.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: CHART_PARAMETERS.Y_AXES_TICKS_FONT_COLOR,
            padding: CHART_PARAMETERS.Y_AXES_TICKS_PADDING,
            fontSize: CHART_PARAMETERS.Y_AXES_TICKS_FONT_SIZE,
          },
          gridLines: {
            display: CHART_PARAMETERS.Y_AXES_GRID_LINES_DISPLAY,
            drawBorder: CHART_PARAMETERS.Y_AXES_GRID_LINES_DROW_BORDER,
          },
        }],
        xAxes: [{
          ticks: {
            display: CHART_PARAMETERS.X_AXES_GRID_LINES_DISPLAY,
            beginAtZero: CHART_PARAMETERS.X_AXES_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: CHART_PARAMETERS.X_AXES_GRID_LINES_DISPLAY,
            drawBorder: CHART_PARAMETERS.X_AXES_GRID_LINES_DROW_BORDER,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);

const renderDurationChart = (durationCtx, durationData) => (
  new Chart(durationCtx, {
    plugins: [ChartDataLabels],
    type: CHART_PARAMETERS.TYPE,
    data: {
      labels: Object.keys(durationData),
      datasets: [{
        data: Object.values(durationData),
        backgroundColor: CHART_PARAMETERS.BACKGROUND_COLOR,
        hoverBackgroundColor: CHART_PARAMETERS.HOVER_BACKGROUND_COLOR,
        anchor: CHART_PARAMETERS.ANCHOR,
        barThickness: CHART_PARAMETERS.BAR_THIKNESS,
        minBarLength: CHART_PARAMETERS.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: CHART_PARAMETERS.DATALABELS_FONT_SIZE,
          },
          color: CHART_PARAMETERS.DATALABELS_COLOR,
          anchor: CHART_PARAMETERS.DATALABELS_ANCHOR,
          align: CHART_PARAMETERS.DATALABELS_ALIGN,
          formatter: (val) => `${getDuration(INITIAL_TIME, val)}`,
        },
      },
      title: {
        display: CHART_PARAMETERS.TITLE_DISPLAY,
        text: CHART_PARAMETERS.TITLE_TEXT_TIME_SPEND,
        fontColor: CHART_PARAMETERS.TITLE_FONT_COLOR,
        fontSize: CHART_PARAMETERS.TITLE_FONT_SIZE,
        position: CHART_PARAMETERS.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: CHART_PARAMETERS.Y_AXES_TICKS_FONT_COLOR,
            padding: CHART_PARAMETERS.Y_AXES_TICKS_PADDING,
            fontSize: CHART_PARAMETERS.Y_AXES_TICKS_FONT_SIZE,
          },
          gridLines: {
            display: CHART_PARAMETERS.Y_AXES_GRID_LINES_DISPLAY,
            drawBorder: CHART_PARAMETERS.Y_AXES_GRID_LINES_DROW_BORDER,
          },
        }],
        xAxes: [{
          ticks: {
            display: CHART_PARAMETERS.X_AXES_GRID_LINES_DISPLAY,
            beginAtZero: CHART_PARAMETERS.X_AXES_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: CHART_PARAMETERS.X_AXES_GRID_LINES_DISPLAY,
            drawBorder: CHART_PARAMETERS.X_AXES_GRID_LINES_DROW_BORDER,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);


const createStatisticsTemplate = () => (
  `<section class="statistics">
<h2 class="visually-hidden">Trip statistics</h2>

<div class="statistics__item">
  <canvas class="statistics__chart" id="money" width="900"></canvas>
</div>

<div class="statistics__item">
  <canvas class="statistics__chart" id="type" width="900"></canvas>
</div>

<div class="statistics__item">
  <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
</div>
</section>`
);

export default class Statistics extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #durationChart = null;

  constructor(moneyData, typeData, durationData) {
    super();

    this._data = {
      tripMoneyData: moneyData,
      tripTypeData: typeData,
      tripDurationData: durationData,
    };

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(
      this._data.tripMoneyData,
      this._data.tripTypeData,
      this._data.tripDurationData,
    );
  }

  #setCharts = () => {

    if (this.#moneyChart) {
      this.#moneyChart = null;
    }

    if (this.#typeChart) {
      this.#typeChart = null;
    }

    if (this.#durationChart) {
      this.#durationChart = null;
    }

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const durationCtx = this.element.querySelector('#time-spend');

    moneyCtx.height = BAR_HEIGHT * Object.values(this._data.tripMoneyData).length; // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    typeCtx.height = BAR_HEIGHT * Object.values(this._data.tripTypeData).length;
    durationCtx.height = BAR_HEIGHT * Object.values(this._data.tripDurationData).length;

    this.#moneyChart = renderMoneyChart(moneyCtx, this._data.tripMoneyData);
    this.#typeChart = renderTypeChart(typeCtx, this._data.tripTypeData);
    this.#durationChart = renderDurationChart(durationCtx, this._data.tripDurationData);
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

}
