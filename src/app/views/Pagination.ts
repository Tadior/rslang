export default class Pagination {
  renderPagination() {
    function createPaginationButton(pageValue: number, isActive = false) {
      const pageClasses: string[] = ['pagination__btn'];
      if (isActive) {
        pageClasses.push('pagination__btn_active');
      }
      const button = document.createElement('button');
      button.classList.add(...pageClasses);
      button.textContent = String(pageValue);
      return button;
    }

    const pagination = document.createElement('nav');
    pagination.classList.add('pagination');
    const paginationPoints = document.createElement('div');
    paginationPoints.classList.add('pagination__points');
    paginationPoints.textContent = '...';
    const prevButton = document.createElement('button');
    prevButton.classList.add('pagination__btn', 'pagination__btn_prev', 'pagination__btn_disabled');
    prevButton.textContent = 'Prev';
    const nextButton = document.createElement('button');
    nextButton.classList.add('pagination__btn', 'pagination__btn_next');
    nextButton.textContent = 'Next';
    pagination.append(
      prevButton,
      createPaginationButton(1, true),
      createPaginationButton(2),
      createPaginationButton(3),
      createPaginationButton(4),
      paginationPoints,
      createPaginationButton(7),
      nextButton,
    );
    document.querySelector('.tutorial__wrapper').after(pagination);
  }
}
