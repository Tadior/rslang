import Api from '../models/Api';
import Card from '../views/Card';

export default class TutorialControllers {
  addListenners() {
    const tutorialNavigation = document.querySelector('.tutorial__navigation');
    tutorialNavigation.addEventListener('click', (event) => {
      const eventInfo = {
        target: event.target as HTMLElement,
      };
      if (eventInfo.target.hasAttribute('data-group')) {
        const group = eventInfo.target.getAttribute('data-group');
        this.changeCategory(group, eventInfo.target);
      }
    });
    const paginationWrapper = document.querySelector('.pagination');
    paginationWrapper.addEventListener('click', (event) => {
      const eventInfo = {
        target: event.target as HTMLElement,
      };

      if (eventInfo.target.classList.contains('pagination__btn_prev')) {
        const page = Number(document.querySelector('.pagination__btn_active').textContent);
        this.createPagination(7, page - 1);
      } else if (eventInfo.target.classList.contains('pagination__btn_next')) {
        const page = Number(document.querySelector('.pagination__btn_active').textContent);
        this.createPagination(7, page + 1);
      } else if (eventInfo.target.classList.contains('pagination__btn')) {
        const page = Number(eventInfo.target.textContent);
        this.createPagination(7, page);
      }
    });
  }

  changeCategory(group: string, target: HTMLElement): void | boolean {
    console.log(group);
    const prevNavActive = document.querySelector('.tutorial__link_active');
    if (prevNavActive) {
      prevNavActive.classList.remove('tutorial__link_active');
    }
    const prevTabActive = document.querySelector('.tabs__block_active');
    prevTabActive.classList.remove('tabs__block_active');
    target.classList.add('tutorial__link_active');
    const tabActive = document.getElementById(`${group}`);
    console.log(tabActive);
    tabActive.classList.add('tabs__block_active');
    // Если на предыдущей странице есть карточки то не добавлять новые
    const categoryWrapper = document.getElementById(`${group}`);

    if (categoryWrapper.querySelector('.card')) {
      console.log('НЕ добавлять карточки');
      return false;
    }
    // Если открыт словарь
    if (group === 'myVocabulary') {
      console.log('Словарь');
      return false;
    }
    //---------------------------------------
    const groupValue = group.toString();
    this.renderCards(`${groupValue[groupValue.length - 1]}`, categoryWrapper);
    return true;
  }

  renderCards(group: string, renderContainer: HTMLElement) {
    const api = new Api();
    const response = api.getWords(group, '0');
    response.then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        const card = new Card(data[i]);
        card.renderCard(renderContainer);
      }
    });
  }

  createPagination(totalPages: number, page: number) {
    let pagination = '';
    let active = '';
    let beforePage = page - 1;
    let afterPage = page + 1;

    if (page === 0 || page === totalPages + 1) {
      return false;
    }
    // Если страница больше 1 то делаем кнопку юзабельной
    if (page === 1) {
      pagination += '<button class="pagination__btn pagination__btn_prev pagination__btn_disabled ">Prev</button>';
    } else if (page > 1) {
      pagination += '<button class="pagination__btn pagination__btn_prev">Prev</button>';
    }
    // Если страница больше 2 то добавляем первую страницу
    if (page > 2) {
      pagination += '<button class="pagination__btn">1</button>';
      // Если страница больше 3 то добавляем точки
      if (page > 3) {
        pagination += '<div class="pagination__points">...</div>';
      }
    }
    // Сколько страниц отображается до текущей
    if (page === totalPages) {
      beforePage -= 2;
    } else if (page === totalPages - 1) {
      beforePage -= 1;
    }
    // Сколько страниц отображается после текущей
    if (page === 1) {
      afterPage += 2;
    } else if (page === 2) {
      afterPage += 1;
    }
    // Создаем соседние кнопки
    for (let plength = beforePage; plength <= afterPage; plength += 1) {
      if (plength > totalPages) {
        break;
      }
      if (plength === 0) {
        plength += 1;
      }
      if (page === plength) {
        active = 'pagination__btn_active';
      } else {
        active = '';
      }
      pagination += `<button class="pagination__btn ${active}">${plength}</button>`;
    }
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        pagination += '<div class="pagination__points">...</div>';
      }
      pagination += `<button class="pagination__btn">${totalPages}</button>`;
    }
    // Если страница не последняя то делаем кнопку юзабельной
    if (page === totalPages) {
      pagination += '<button class="pagination__btn pagination__btn_next pagination__btn_disabled">Next</button>';
    } else if (page < totalPages) {
      pagination += '<button class="pagination__btn pagination__btn_next">Next</button>';
    }
    document.querySelector('.pagination').innerHTML = pagination;
    return pagination;
  }
}
