import TutorialControllers from '../controllers/TutorialControllers';

export default class Pagination {
  renderPagination() {
    const pagination = document.createElement('nav');
    pagination.classList.add('pagination');
    // Добавляем контейнер пагинации на страницу
    document.querySelector('.tutorial__wrapper').after(pagination);
    // Отрисосываем пагинацию
    const tutorialController = new TutorialControllers();
    tutorialController.createPagination(30, 1);
  }
}
