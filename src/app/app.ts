// import Games from './views/Games';
import Header from './views/Header';
import SprintControllers from './controllers/SprintControllers';
// import Footer from './views/Footer';
// import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
// const games = new Games();
// games.renderSprintGame();
const controller = new SprintControllers();
controller.startSprintPage('1', '2', 'd97d52cc-b35e-42fa-becf-8c2ab8caec57');
/* const mainPage = new MainPage();
mainPage.renderMainPage();
const footer = new Footer();
footer.renderFooter(); */
