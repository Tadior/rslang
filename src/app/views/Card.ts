import bell from '../../assets/img/icons/sound.svg';
// import CardController from '../controllers/TutorialControllers';

export default class Card {
  renderCard(positionToPlace: HTMLElement): HTMLDivElement {
    const card = document.createElement('div');
    card.classList.add('card');
    const cardImageFluid = document.createElement('div');
    cardImageFluid.classList.add('card__image-fluid');
    cardImageFluid.innerHTML = `
    <img class="card__img" src="" alt="Картинка для слова">
    `;
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');
    const cardName = document.createElement('div');
    cardName.classList.add('card-name');
    cardName.innerHTML = `
        <div class="card-name__original"></div>
        <div class="card-name__translation"></div>
    `;
    const cardTranscription = document.createElement('div');
    cardTranscription.classList.add('card-transcription');
    const cardSentences = document.createElement('div');
    cardSentences.classList.add('card-sentences');
    cardSentences.innerHTML = `
    <div class="card-sentence card-sentence_example">
        <div class="card-sentence__original">

        </div>
        <div class="card-sentence__translate">

        </div>
    </div>
    <div class="card-sentence card-sentence_meaning">
        <div class="card-sentence__original">

        </div>
        <div class="card-sentence__translate">

        </div>
    </div>
    `;
    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-sentence__buttons');
    const buttonAudio = document.createElement('button');
    buttonAudio.classList.add('card-btn__audio');
    buttonAudio.innerHTML = `
        <img src="${bell}" alt="Произнести слово">
    `;
    // Проверка авторизован ли пользователь
    if (localStorage.getItem('userId')) {
      const buttonDictionary = document.createElement('button');
      buttonDictionary.classList.add('btn', 'btn_bordered', 'btn_card', 'btn_bold', 'btn_add');
      buttonDictionary.textContent = 'Добавить в словарь';
      const buttonLearned = document.createElement('button');
      buttonLearned.classList.add('btn', 'btn_card', 'btn-learned');
      buttonLearned.textContent = 'Я знаю это слово';
      // const cardController = new CardController();
      // buttonLearned.addEventListener('click', (event: MouseEvent) => {
      //   const target = event.target as HTMLElement;
      //   cardController.markWordAsLearned(target);
      // });
      // buttonDictionary.addEventListener('click', (event: MouseEvent) => {
      //   const target = event.target as HTMLElement;
      //   cardController.addWordToMyDictionary(target);
      // });
      cardButtons.append(buttonDictionary, buttonLearned);
    }
    cardInfo.append(cardName, cardTranscription, cardSentences, cardButtons, buttonAudio);
    card.append(cardImageFluid, cardInfo);
    positionToPlace.append(card);
    return card;
  }
}
