import crossIcon from '../../assets/img/icons/cross.svg';

export default class Authorization {
  renderSignIn(): void {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal__wrapper');
    const modalFluid = document.createElement('div');
    modalFluid.classList.add('modal__fluid');
    const modalTitle = document.createElement('div');
    modalTitle.classList.add('modal__title');
    modalTitle.innerHTML = `
    Изучать слова удобнее,
    <br>если у вас есть профиль
    `;
    const modalInputs = document.createElement('div');
    modalInputs.classList.add('modal__inputs');
    modalInputs.innerHTML = `
    <input type="text" class="modal__input" placeholder="Введите email">
    <input type="text" class="modal__input" placeholder="Введите пароль">
    `;
    const modalButtons = document.createElement('div');
    modalButtons.classList.add('modal__buttons');
    const modalSignIn = document.createElement('button');
    modalSignIn.classList.add('btn', 'modal__btn');
    modalSignIn.textContent = 'Войти';
    const modalSignUp = document.createElement('button');
    const crossButton = document.createElement('button');
    crossButton.classList.add('modal__exit');
    crossButton.innerHTML = `
    <img src='${crossIcon}'>
    `;
    modalSignUp.classList.add('btn', 'modal__btn', 'btn_bordered');
    modalSignUp.textContent = 'Регистрация';
    modalButtons.append(modalSignIn, modalSignUp);
    modalFluid.append(modalTitle, modalInputs, modalButtons);
    modalWrapper.append(modalFluid, crossButton);
    modal.append(modalWrapper);
    document.body.style.overflow = 'hidden';
    document.querySelector('.wrapper').append(modal);
  }

  renderSignUp(): void {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal__wrapper');
    const modalFluid = document.createElement('div');
    modalFluid.classList.add('modal__fluid');
    const modalTitle = document.createElement('div');
    modalTitle.classList.add('modal__title');
    modalTitle.innerHTML = `
    Изучать слова удобнее,
    <br>если у вас есть профиль
    `;
    const modalParagraph = document.createElement('p');
    modalParagraph.classList.add('modal__paragraph');
    modalParagraph.textContent = `
    Зарегистрированые пользователи могут отслеживать 
    статистику обучения, а также имеют доступ к разделу “Сложные слова”
    `;
    const modalInputs = document.createElement('div');
    modalInputs.classList.add('modal__inputs');
    modalInputs.innerHTML = `
    <input type="text" class="modal__input" placeholder="Введите имя">
    <input type="text" class="modal__input" placeholder="Введите email">
    <input type="text" class="modal__input" placeholder="Введите пароль">
    `;
    const modalButtons = document.createElement('div');
    modalButtons.classList.add('modal__buttons');
    const modalCreate = document.createElement('button');
    modalCreate.classList.add('btn', 'modal__btn');
    modalCreate.textContent = 'Создать аккаунт';
    const crossButton = document.createElement('button');
    crossButton.classList.add('modal__exit');
    crossButton.innerHTML = `
    <img src='${crossIcon}'>
    `;
    modalButtons.append(modalCreate);
    modalFluid.append(modalTitle, modalParagraph, modalInputs, modalButtons);
    modalWrapper.append(modalFluid, crossButton);
    modal.append(modalWrapper);
    document.body.style.overflow = 'hidden';
    document.querySelector('.wrapper').append(modal);
  }
}
