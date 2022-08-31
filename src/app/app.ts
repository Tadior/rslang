import SprintControllers from './controllers/SprintControllers';
import Header from './views/Header';
// import StatisticPage from './views/Statistics';
import Footer from './views/Footer';
// import Authorization from './views/Authorisation';
import AuthorizationControllers from './controllers/AuthorizationControllers';
// import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
const authorizationControllers = new AuthorizationControllers();
authorizationControllers.enableAuthorization();
/* const statistic = new StatisticPage();
statistic.renderStatistic(); */
/* const mainPage = new MainPage();
mainPage.renderMainPage(); */
const sprint = new SprintControllers();
sprint.startSprintPage('2', '1');
const footer = new Footer();
footer.renderFooter();
