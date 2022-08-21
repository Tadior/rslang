export default class Pagination {
  renderPagination() {
    function createPaginationButton(pageValue: number, isActive = false) {
      const pageClasses: string[] = ['pagination__btn'];
      if (isActive === true) {
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
    pagination.append(
      createPaginationButton(1, true),
      createPaginationButton(2),
      createPaginationButton(3),
      paginationPoints,
      createPaginationButton(28),
      createPaginationButton(29),
      createPaginationButton(30),
    );
    document.querySelector('.tutorial__wrapper').after(pagination);
  }
}
