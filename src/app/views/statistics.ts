import Chart from 'chart.js/auto';
import { ChartType } from 'chart.js';
import sprintImage from '../../assets/img/main-page/gamepad.png';
import audioImage from '../../assets/img/main-page/audio.png';
import StatisticModel from '../models/StatisticModel';
import AuthorizationControllers from '../controllers/AuthorizationControllers';
import { User } from '../../types/types';

export default class StatisticPage {
  statisticModel: StatisticModel;

  authorization: AuthorizationControllers;

  userInfo: User;

  todayLearnedWords: Promise<number>;

  todayNewWords: Promise<number>;

  todayAccuracy: Promise<number>;

  sprintNewWords: Promise<number>;

  sprintAccuracy: Promise<number>;

  sprintRow: Promise<number>;

  audioNewWords: Promise<number>;

  audioAccuracy: Promise<number>;

  audioRow: Promise<number>;

  fullTimeEndpoints: Promise<string[]>;

  fullTimeNewWords: Promise<number[]>;

  fullTimeLearned: Promise<number[]>;

  constructor() {
    this.authorization = new AuthorizationControllers();
    this.userInfo = this.authorization.getUserFromLocalStorage();
    this.statisticModel = new StatisticModel();
  }

  public renderNoStatistic(): void {
    const statistic: HTMLElement = document.createElement('section');
    statistic.classList.add('statistic');
    statistic.innerHTML = `
    <div class='container'>
      <div class='statistic__wrapper'>
        <h4 class='title title_message'>Отслеживание статистики доступно только авторизованым пользователям!</h4>
      </div>
    </div>
    `;
    document.querySelector('main')!.innerHTML = '';
    document.querySelector('main')!.append(statistic);
  }

  public async renderStatistic(): Promise<void> {
    this.todayLearnedWords = this.statisticModel.getLearnedWords(this.userInfo.userId);
    this.todayNewWords = this.statisticModel.getNewWords(this.userInfo.userId);
    this.sprintNewWords = this.statisticModel.getTodayProperty(this.userInfo.userId, 'sprintNewWords');
    this.sprintAccuracy = this.statisticModel.getTodayProperty(this.userInfo.userId, 'sprintAccuracy');
    this.sprintRow = this.statisticModel.getTodayProperty(this.userInfo.userId, 'sprintRow');
    this.audioNewWords = this.statisticModel.getTodayProperty(this.userInfo.userId, 'audioNewWords');
    this.audioAccuracy = this.statisticModel.getTodayProperty(this.userInfo.userId, 'audioAccuracy');
    this.audioRow = this.statisticModel.getTodayProperty(this.userInfo.userId, 'audioRow');
    const statistic: HTMLElement = document.createElement('section');
    statistic.classList.add('statistic');
    statistic.innerHTML = `
      <div class='container'>
        <div class='statistic__wrapper'>
          <div class='statistic__today'>
            <h2 class='title title_today'>Статистика за сегодня</h2>
            <div class='today__info'>
              <div class='today__common'>
                <div class='today__words'>
                  <div class='words__number'>${await this.todayLearnedWords}</div>
                  <div class='words__text'>слов<br><span>изучено</span></div>
                </div>
                <div class='today__new-words'>
                  <div class='new-words__number'>${await this.todayNewWords}</div>
                  <div class='new-words__text'>слов<br><span>новых</span></div>
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
                    <div class='minigame__number'>${await this.sprintNewWords}</div>
                    <div class='minigame__text'>новых слов</div>
                  </div>
                  <div class='minigame__accuracy'>
                    <div class='minigame__number'>${await this.sprintAccuracy}%</div>
                    <div class='minigame__text'>процент точности</div>
                </div>
                <div class='minigame__row'>
                  <div class='minigame__number'>${await this.sprintRow}</div>
                  <div class='minigame__text'>максимальная серия<br>правильных ответов</div>
                </div>
                <div class='minigame__img'>
                  <img src='${sprintImage}' alt='gamepad'>
                </div>
              </div>
              <div class='today__minigame'>
                <h4 class='title title_minigame'>Аудиовызов</h4>
                <div class='minigame__words'>
                  <div class='minigame__number'>${await this.audioNewWords}</div>
                  <div class='minigame__text'>новых слов</div>
                </div>
                <div class='minigame__accuracy'>
                  <div class='minigame__number'>${await this.audioAccuracy}%</div>
                  <div class='minigame__text'>процент точности</div>
                </div>
                <div class='minigame__row'>
                  <div class='minigame__number'>${await this.audioRow}</div>
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
                <h4 class='title title_chart'>График изучения новых слов</h4>
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
    document.querySelector('main')!.innerHTML = '';
    document.querySelector('main')!.append(statistic);
    this.createDoughnutChart();
    this.createBarChart();
    this.createLineChart();
  }

  private async createDoughnutChart(): Promise<void> {
    this.todayAccuracy = this.statisticModel.getCommonDayAccuracy(this.userInfo.userId);
    const number = await this.todayAccuracy;
    const datapointsDoughnut = [number, (100 - number)];
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
        label: 'Процент точности',
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

  private async createBarChart(): Promise<void> {
    this.fullTimeEndpoints = this.statisticModel.getFullTimeDates(this.userInfo.userId);
    this.fullTimeNewWords = this.statisticModel.getFullTimeNewWords(this.userInfo.userId);
    const labels = await this.fullTimeEndpoints;
    const dataBar = {
      labels,
      datasets: [{
        label: 'Новых слов в день',
        data: await this.fullTimeNewWords,
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

  private async createLineChart(): Promise<void> {
    this.fullTimeEndpoints = this.statisticModel.getFullTimeDates(this.userInfo.userId);
    this.fullTimeLearned = this.statisticModel.getFullTimeDynimicLearned(this.userInfo.userId);
    const labels = await this.fullTimeEndpoints;
    const dataLine = {
      labels,
      datasets: [{
        label: 'Всего слов изучено',
        data: await this.fullTimeLearned,
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
