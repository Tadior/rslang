import Chart from 'chart.js/auto';
import { ChartType } from 'chart.js';
import sprintImage from '../../assets/img/main-page/gamepad.png';
import audioImage from '../../assets/img/main-page/audio.png';

export default class StatisticPage {
  renderStatistic() {
    const statistic = document.createElement('section');
    statistic.classList.add('statistic');
    statistic.innerHTML = `
      <div class='container'>
        <div class='statistic__wrapper'>
          <div class='statistic__today'>
            <h2 class='title title_today'>Статистика за сегодня</h2>
            <div class='today__info'>
              <div class='today__common'>
                <div class='today__words'>
                  <div class='words__number'>5</div>
                  <div class='words__text'>слов<br><span>изучено</span></div>
                </div>
                <div class='today__accuracy'>
                  <h4 class='title title_accuracy'>Процент точности</h4>
                  <div class='accuracy__chart'>
                    <canvas class='chart__doughnut'></canvas>
                  </div>
                </div>
              </div>
              <div class='today__minigame'>
                  <h4 class='title title_minigame'>Cпринт</h4>
                  <div class='minigame__words'>
                    <div class='minigame__number'>2</div>
                    <div class='minigame__text'>слов изучено</div>
                  </div>
                  <div class='minigame__accuracy'>
                    <div class='minigame__number'>100%</div>
                    <div class='minigame__text'>процент точности</div>
                </div>
                <div class='minigame__row'>
                  <div class='minigame__number'>2</div>
                  <div class='minigame__text'>максимальная серия<br>правильных ответов</div>
                </div>
                <div class='minigame__img'>
                  <img src='${sprintImage}' alt='gamepad'>
                </div>
              </div>
              <div class='today__minigame'>
                <h4 class='title title_minigame'>Аудиовызов</h4>
                <div class='minigame__words'>
                  <div class='minigame__number'>3</div>
                  <div class='minigame__text'>слов изучено</div>
                </div>
                <div class='minigame__accuracy'>
                  <div class='minigame__number'>100%</div>
                  <div class='minigame__text'>процент точности</div>
                </div>
                <div class='minigame__row'>
                  <div class='minigame__number'>3</div>
                  <div class='minigame__text'>максимальная серия<br>правильных ответов</div>
                </div>
                <div class='minigame__img'>
                  <img src='${audioImage}' alt='gamepad'>
                </div>
              </div>
            </div>
          </div>
          <div class='statistic__all-time'>
            <h2 class='title title_all-time'>Статистика за все время</h2>
            <div class='all-time__charts'>
              <div class='chart__days'>
                <h4 class='title title_chart'>График изучения слов</h4>
                <canvas class='chart__bar'></canvas>
              </div>
              <div class='chart__words'>
                <h4 class='title title_chart'>Динамика обучения</h4>
                <canvas class='chart__line'></canvas>
              </div>
            </div>
          </div>
        <div>
      </div>
    `;
    document.querySelector('main')!.append(statistic);
    this.createDoughnutChart();
    this.createBarChart();
    this.createLineChart();
  }

  createDoughnutChart() {
    const datapointsDoughnut = [87, 13];
    const counter = {
      id: 'counter',
      beforeDraw(chart: Chart, args: {}, options: any) {
        const { ctx, chartArea: { width, height } } = chart;
        ctx.save();
        ctx.fillStyle = options.fontColor;
        ctx.font = `bold ${options.fontSize}px ${options.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillText(`${datapointsDoughnut[0]}%`, width / 2, (height / 2) + (options.fontSize * 0.34));
      },
    };

    const dataDoughnut = {
      datasets: [{
        label: '# of Votes',
        data: datapointsDoughnut,
        backgroundColor: [
          '#5685FF',
          'transparent',
        ],
        borderColor: [
          '#5685FF',
          '#5685FF',
        ],
        borderWidth: 1,
        cutout: '70%',
      }],
    };

    const configDoughnut = {
      type: 'doughnut' as ChartType,
      data: dataDoughnut,
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          counter: {
            fontColor: '#2A3354',
            fontSize: 36,
            fontFamily: 'Jost-Bold',
          },
        },
      },
      plugins: [
        counter,
      ],
    };

    /* eslint-disable no-new */
    new Chart(
      (<HTMLCanvasElement>document.querySelector('.chart__doughnut')),
      configDoughnut,
    );
  }

  createBarChart() {
    const labels = ['01.08', '02.08', '03.08', '04.08', '05.08', '06.08', '07.08'];
    const dataBar = {
      labels,
      datasets: [{
        label: 'Изучено слов в день',
        data: [45, 60, 15, 24, 38, 5, 15],
        backgroundColor: [
          '#C292FF',
        ],
        borderColor: [
          '#C292FF',
        ],
        borderWidth: 1,
      }],
    };

    const configBar = {
      type: 'bar' as ChartType,
      data: dataBar,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    new Chart(
      (<HTMLCanvasElement>document.querySelector('.chart__bar')),
      configBar,
    );
  }

  createLineChart() {
    const labels = ['01.08', '02.08', '03.08', '04.08', '05.08', '06.08', '07.08'];
    const dataLine = {
      labels,
      datasets: [{
        label: 'Всего слов изучено',
        data: [45, 105, 120, 144, 182, 187, 202],
        lineTension: 0,
        fill: false,
        borderColor: '#FF9292',
        backgroundColor: 'transparent',
        pointBorderColor: '#FF9292',
        pointBackgroundColor: '#FF9292',
        pointRadius: 5,
        pointHoverRadius: 10,
        pointHitRadius: 30,
        pointBorderWidth: 2,
      }],
    };

    const configLine = {
      type: 'line' as ChartType,
      data: dataLine,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    new Chart(
      (<HTMLCanvasElement>document.querySelector('.chart__line')),
      configLine,
    );
  }
}
