import page404Image from '../../assets/img/page404/page404.png';

export default class Page404 {
  renderPage404() {
    const page404 = document.createElement('div');
    page404.classList.add('page-404');
    page404.innerHTML = `
      <div class='container'>
        <div class='page-404__wrapper'>
          <div class='page-404__info'>
            <h2 class='title title_page-404'>Извините, такой страницы не существует<h2>
            <button class='btn page-404__btn'>Вернуться на главную страницу</button>
          </div>
          <div class='page-404__img'>
            <img src='${page404Image}' alt='page404'>
        </div>
        <div>
      </div>
    `;
    document.querySelector('main').append(page404);
  }
}
