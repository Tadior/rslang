import MelodyImage from '../../assets/img/icons/melody.svg';
import WindowImage from '../../assets/img/icons/window.svg';
import AudioImage from '../../assets/img/icons/audio.svg';

export default class Games {
  renderDifficultMenu() {
    function createDifficultButton(text: string, class_modificator: string): HTMLButtonElement {
      const button = document.createElement('button');
      button.classList.add('difficulty__level', `${class_modificator}`);
      button.textContent = text;
      return button;
    }
    const difficultSection = document.createElement('section');
    difficultSection.classList.add('difficulty');
    const container = document.createElement('div');
    container.classList.add('container');
    const title = document.createElement('h2');
    title.classList.add('title', 'title_corner');
    title.textContent = 'Спринт';
    const difficultyWrapper = document.createElement('div');
    difficultyWrapper.classList.add('difficulty__wrapper');
    const difficultyTopic = document.createElement('div');
    difficultyTopic.classList.add('difficulty__topic');
    const difficultyLevels = document.createElement('div');
    difficultyLevels.classList.add('difficulty__levels');
    difficultyLevels.append(
      createDifficultButton('A1', 'difficulty__level_blue'),
      createDifficultButton('A2', 'difficulty__level_pink'),
      createDifficultButton('B1', 'difficulty__level_yellow'),
      createDifficultButton('B2', 'difficulty__level_light-purpule'),
      createDifficultButton('C1', 'difficulty__level_aquamarine'),
      createDifficultButton('C2', 'difficulty__level_purple'),
    );
    const difficultyButtons = document.createElement('div');
    difficultyButtons.classList.add('difficulty__buttons');
    const buttonReject = document.createElement('button');
    buttonReject.classList.add('btn', 'btn_bordered', 'btn_difficulty');
    buttonReject.textContent = 'Отмена';
    const buttonStart = document.createElement('button');
    buttonStart.classList.add('btn', 'btn_difficulty');
    buttonStart.textContent = 'Начать игру';
    difficultyButtons.append(buttonReject, buttonStart);
    difficultyWrapper.append(difficultyTopic, difficultyLevels, difficultyButtons);
    container.append(title, difficultyWrapper);
    difficultSection.append(container);
    document.querySelector('.main').append(difficultSection);
  }

  renderAudioGame() {
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
    gameAudioButton.classList.add('game__audio-button');
    const gameAudioImage = document.createElement('img');
    gameAudioImage.classList.add('game__audio-image');
    gameAudioImage.src = AudioImage;
    gameAudioButton.append(gameAudioImage);
    const answersExamples = document.createElement('div');
    answersExamples.classList.add('game__answers');
    const answers = ['завтрак', 'солнце', 'злодей', 'семья', 'усталость'];
    answersExamples.append(...this.createAudioAnswers(answers));
    const gameButton = document.createElement('button');
    gameButton.classList.add('btn', 'btn_call');
    gameButton.textContent = 'Я не знаю :(';
    gameWrapper.append(gameAudioButton, answersExamples, gameButton);
    container.append(gameHeader, gameWrapper);
    gameSection.append(container);
    document.querySelector('main').append(gameSection);
  }

  createAudioAnswers(answers: string[]) {
    return answers.map((value, index) => {
      const button = document.createElement('button');
      button.classList.add('game__answer');
      button.textContent = `${index + 1}.${value}`;
      return button;
    });
  }
}
