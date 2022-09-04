import TutorialControllers from '../controllers/TutorialControllers';

export default class Pagination {
  public renderPagination(): void {
    const pagination = document.createElement('nav');
    pagination.classList.add('pagination');
    document.querySelector('.tutorial__wrapper').after(pagination);
    const tutorialController = new TutorialControllers();
    tutorialController.createPagination(30, 1);
  }
}
