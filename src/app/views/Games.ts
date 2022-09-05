import robot from '../../assets/img/sprint/sprint_robot.png';
import listenIcon from '../../assets/img/sprint/listen_icon.png';
import MelodyImage from '../../assets/img/icons/melody.svg';
import WindowImage from '../../assets/img/icons/window.svg';
import AudioImage from '../../assets/img/icons/audio.svg';
import { Word } from '../../types/types';
import ResultsControllers from '../controllers/ResultsControllers';
import MainPage from './MainPage';

export default class Games {
  resultsControllers: ResultsControllers;

  mainPage: MainPage;

  constructor(mainControllers: any) {
    this.mainPage = new MainPage(mainControllers);
    this.resultsControllers = new ResultsControllers();
  }

  public renderSprintGame():void {
    const sprintPage = document.createElement('section');
    sprintPage.classList.add('game');
    sprintPage.innerHTML = `
      <div class='container'>
        <div class='game-header'>
          <h2 class='title title_corner'>Cпринт</h2>
          <div class='game-header__buttons'>
            <button class='game-header__btn btn__audio'>
              <img src='${MelodyImage}' alt='sound-icon'>
            </button>
            <button class='game-header__btn btn__window'>
              <img src='${WindowImage}' alt='window-icon'>
            </button>
          </div>
        </div>
        <div class='game__wrapper'>
          <div class='sprint__interface'>
            <div class='sprint__points'>
              <div class='points__current'>0</div>
              <div class='points__category'>+ 10 баллов</div>
              <div class='points__row'>
                <div class='row__cube'></div>
                <div class='row__cube'></div>
                <div class='row__cube'></div>
              </div>
            </div>
            <div class='sprint__console'>
              <div class='console__robot'>
                <img src='${robot}' alt='robot'>
              </div>
              <div class='console__wrapper'>
                <div class='console__word'>
                  <div class='console__english'>breakfast</div>
                  <div class='console__russian'>завтрак</div>
                </div>
                <div class='console__answer'>
                  <button class='btn btn_wrong'>❮ Неверно</button>
                  <button class='btn btn_right'>Верно ❯</button>
                </div>
              </div>
            </div>
            <div class='sprint__timer'></div>
          </div>
        <div>
      </div>
    `;
    (<HTMLElement>document.querySelector('main')).innerHTML = '';
    (<HTMLElement>document.querySelector('main')).append(sprintPage);
    this.addSprintTimer();
  }

  private addSprintTimer():void {
    const timer = document.querySelector('.sprint__timer');
    const timerHTML = `
      <div class='timer__line'></div>
      <div class='timer__body'>
        <div class='timer__counter'>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
          <span>12</span>
          <span>14</span>
          <span>15</span>
          <span>16</span>
          <span>17</span>
          <span>18</span>
          <span>19</span>
          <span>20</span>
          <span>21</span>
          <span>22</span>
          <span>23</span>
          <span>24</span>
          <span>25</span>
          <span>26</span>
          <span>27</span>
          <span>28</span>
          <span>29</span>
          <span>30</span>
          <span>31</span>
          <span>32</span>
          <span>33</span>
          <span>34</span>
          <span>35</span>
          <span>36</span>
          <span>37</span>
          <span>38</span>
          <span>39</span>
          <span>40</span>
          <span>41</span>
          <span>42</span>
          <span>43</span>
          <span>44</span>
          <span>45</span>
          <span>46</span>
          <span>47</span>
          <span>48</span>
          <span>49</span>
          <span>50</span>
          <span>51</span>
          <span>52</span>
          <span>53</span>
          <span>54</span>
          <span>55</span>
          <span>56</span>
          <span>57</span>
          <span>58</span>
          <span>59</span>
          <span>60</span>
        </div>
      </div>
    `;
    timer!.insertAdjacentHTML('afterbegin', timerHTML);
  }

  public renderGameResults(game: string, mistakes: Word[], correct: Word[], points: number, maxRow: number)
    :void {
    const main = document.querySelector('main');
    const gameResult: HTMLElement = document.createElement('section');
    gameResult.classList.add('game-result');
    gameResult.innerHTML = `
      <div class='container'>
        <h2 class='title title_corner'>${game}</h2>
        <div class='result__wrapper'>
          <div class='result__console'>
            <h5 class='result__points'>Вы набрали ${points} баллов!</h5>
            <h5 class='result__row'>Длина серии: ${maxRow}</h5>
            <div class='result__details'>
              <div class='result__mistakes'>
                <h6 class='title_mistakes'>Ошибки: ${mistakes.length}</h6>
                ${mistakes.map((mistake) => `
                  <div class='mistakes__item'>
                    <div class='item__listen'>
                      <audio src='http://localhost:4000/${mistake.audio}'></audio>
                      <img class='item__listen-ico' src='${listenIcon}' alt='listen_icon'>
                    </div>
                    <div class='item__english'>${mistake.word}</div>
                    <div class='item__russian'>${mistake.wordTranslate}</div>
                  </div>
                `).join('')}
              </div>
              <div class='result__correct'>
                <h6 class='title_correct'>Изученные слова: ${correct.length}</h6>
                ${correct.map((word) => `
                  <div class='correct__item'>
                    <div class='item__listen'>
                      <audio src='http://localhost:4000/${word.audio}'></audio>
                      <img class='item__listen-ico' src='${listenIcon}' alt='listen_icon'>
                    </div>
                    <div class='item__english'>${word.word}</div>
                    <div class='item__russian'>${word.wordTranslate}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class='result__buttons'>
              <button class='btn btn_bordered btn__home'>На главную</button>
              <button class='btn btn__new-game'>Новая игра</button>
            </div>
          </div>
        </div>
      </div>
    `;
    main.innerHTML = '';
    main!.append(gameResult);
    this.resultsControllers.listenAudioBtn();
  }

  public renderDifficultMenu(game: string):void {
    function createDifficultButton(text: string, class_modificator: string, groupNumber: string)
      : HTMLButtonElement {
      const button = document.createElement('button');
      button.classList.add('difficulty__level', `${class_modificator}`);
      button.textContent = text;
      button.setAttribute('data-group', `${groupNumber}`);
      return button;
    }
    const difficultSection = document.createElement('section');
    difficultSection.classList.add('difficulty');
    const container = document.createElement('div');
    container.classList.add('container');
    const title = document.createElement('h2');
    title.classList.add('title', 'title_corner');
    title.textContent = `${game}`;
    const difficultyWrapper = document.createElement('div');
    difficultyWrapper.classList.add('difficulty__wrapper');
    const difficultyTopic = document.createElement('div');
    difficultyTopic.classList.add('difficulty__topic');
    const difficultyLevels = document.createElement('div');
    difficultyLevels.classList.add('difficulty__levels');
    difficultyLevels.append(
      createDifficultButton('A1', 'difficulty__level_blue', '0'),
      createDifficultButton('A2', 'difficulty__level_pink', '1'),
      createDifficultButton('B1', 'difficulty__level_yellow', '2'),
      createDifficultButton('B2', 'difficulty__level_light-purpule', '3'),
      createDifficultButton('C1', 'difficulty__level_aquamarine', '4'),
      createDifficultButton('C2', 'difficulty__level_purple', '5'),
    );
    const difficultyButtons = document.createElement('div');
    difficultyButtons.classList.add('difficulty__buttons');
    const buttonReject = document.createElement('button');
    buttonReject.classList.add('btn', 'btn_bordered', 'btn_difficulty', 'btn_cancel');
    buttonReject.textContent = 'Отмена';
    const buttonStart = document.createElement('button');
    buttonStart.classList.add('btn', 'btn_difficulty', 'btn_start');
    buttonStart.textContent = 'Начать игру';
    buttonStart.disabled = true;
    difficultyButtons.append(buttonReject, buttonStart);
    difficultyWrapper.append(difficultyTopic, difficultyLevels, difficultyButtons);
    container.append(title, difficultyWrapper);
    difficultSection.append(container);
    document.querySelector('.main')!.append(difficultSection);
  }

  public renderAudioGame():void {
    const gameResult = document.querySelector('.game-result');
    if (gameResult) {
      gameResult.remove();
    }
    const gameSection = document.createElement('section');
    gameSection.classList.add('game');
    const container = document.createElement('div');
    container.classList.add('container');
    const gameHeader = document.createElement('div');
    gameHeader.classList.add('game-header');
    const title = document.createElement('h2');
    title.classList.add('title', 'title_corner');
    title.textContent = 'Аудиовызов';
    const gameHeaderButtons = document.createElement('div');
    gameHeaderButtons.classList.add('game-header__buttons');
    const buttonAudio = document.createElement('button');
    buttonAudio.classList.add('game-header__btn', 'btn__audio');
    buttonAudio.innerHTML = `
      <img class="btn__game-image" src="${MelodyImage}">
    `;
    const buttonWindow = document.createElement('button');
    buttonWindow.classList.add('game-header__btn', 'btn__window');
    buttonWindow.innerHTML = `
      <img class="btn__game-image" src="${WindowImage}">
    `;
    gameHeaderButtons.append(buttonAudio, buttonWindow);
    gameHeader.append(title, gameHeaderButtons);
    const gameWrapper = document.createElement('div');
    gameWrapper.classList.add('game__wrapper');
    const gameAudioButton = document.createElement('button');
    gameAudioButton.classList.add('audio-call-button');
    const gameAudioImage = document.createElement('img');
    gameAudioImage.classList.add('audio-call-image');
    gameAudioImage.src = AudioImage;
    gameAudioButton.append(gameAudioImage);
    const answersExamples = document.createElement('div');
    answersExamples.classList.add('audio-call__answers');
    const gameButton = document.createElement('button');
    const gameAnswerImg = document.createElement('div');
    const gameCorrectAnswerWordContainer = document.createElement('div');
    const gameCorrectAnswerWord = document.createElement('div');
    gameCorrectAnswerWordContainer.classList.add('audio-call-container', 'word_hide');
    gameCorrectAnswerWord.classList.add('audio-call-container__word');
    gameAnswerImg.classList.add('audio-call-img', 'img_hide');
    gameButton.classList.add('btn', 'audio-call__btn', 'audio-call__btn-idk');
    gameButton.textContent = 'Я не знаю :(';
    // eslint-disable-next-line max-len
    gameWrapper.append(gameAnswerImg, gameCorrectAnswerWordContainer, gameAudioButton, answersExamples, gameButton);
    gameCorrectAnswerWordContainer.innerHTML = '<button class=\'audio-call-container__ico\' alt=\'listen_icon\'></button>';
    gameCorrectAnswerWordContainer.append(gameCorrectAnswerWord);
    container.append(gameHeader, gameWrapper);
    gameSection.append(container);
    (<HTMLElement>document.querySelector('main')).innerHTML = '';
    document.querySelector('main')!.append(gameSection);
  }

  public createAudioAnswers(answers: string[]):HTMLButtonElement[] {
    return answers.map((value, index) => {
      const button = document.createElement('button');
      button.classList.add('audio-call__answer');
      button.textContent = `${index + 1}.${value}`;
      return button;
    });
  }
}
