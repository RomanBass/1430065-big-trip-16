import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getDuration } from '../utils/common';

const INITIAL_TIME = 0;

const renderMoneyChart = (moneyCtx, moneyData) => (
  new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(moneyData),
      datasets: [{
        data: Object.values(moneyData),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
    type: 'horizontalBar',
    data: {
      labels: Object.keys(typeData),
      datasets: [{
        data: Object.values(typeData),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
    type: 'horizontalBar',
    data: {
      labels: Object.keys(durationData),
      datasets: [{
        data: Object.values(durationData),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDuration(INITIAL_TIME, val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
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
  constructor(moneyData, typeData, durationData) {
    super();

    this._data = {
      tripMoneyData: moneyData,
      tripTypeData: typeData,
      tripDurationData: durationData,
    };

    this._moneyChart = null;
    this._typeChart = null;
    this._durationChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(
      this._data.tripMoneyData,
      this._data.tripTypeData,
      this._data.tripDurationData,
    );
  }

  _setCharts() {

    if (this._moneyChart) {
      this._moneyChart = null;
    }

    if (this._typeChart) {
      this._typeChart = null;
    }

    if (this._durationChart) {
      this._durationChart = null;
    }

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const durationCtx = this.element.querySelector('#time-spend');
    const BAR_HEIGHT = 55;

    moneyCtx.height = BAR_HEIGHT * Object.values(this._data.tripMoneyData).length; // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    typeCtx.height = BAR_HEIGHT * Object.values(this._data.tripTypeData).length;
    durationCtx.height = BAR_HEIGHT * Object.values(this._data.tripDurationData).length;

    this._moneyChart = renderMoneyChart(moneyCtx, this._data.tripMoneyData);
    this._typeChart = renderTypeChart(typeCtx, this._data.tripTypeData);
    this._durationChart = renderDurationChart(durationCtx, this._data.tripDurationData);
  }

  restoreHandlers() {
    this._setCharts();
  }

}
