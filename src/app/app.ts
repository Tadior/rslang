import Header from './views/Header';
import Footer from './views/Footer';
// import MainPage from './views/MainPage';
import Card from './views/Card';
import Pagination from './views/Pagination';
import Tutorial from './views/Tutorial';

const header = new Header();
header.renderHeader();
const tutorial = new Tutorial();
tutorial.renderTutorialPage();
const card = new Card('breakfast', 'завтрак', '[brekfəst]', 'assets/img/icons/example-img.jpg', 'audio', 'Breakfast is the morning meal', 'Завтрак - это утренняя трапеза', 'I ate eggs for breakfast', 'Я ел яйца на завтрак');
card.renderCard();
const pagination = new Pagination();
pagination.renderPagination();
// const mainPage = new MainPage();
// mainPage.renderMainPage();
const footer = new Footer();
footer.renderFooter();
