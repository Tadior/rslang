// import SprintControllers from './controllers/SprintControllers';
import Header from './views/Header';
// import StatisticPage from './views/statistics';
import Footer from './views/Footer';
import Authorization from './views/Authorisation';
import AuthorizationControllers from './controllers/AuthorizationControllers';
import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
/* const statistic = new StatisticPage();
statistic.renderStatistic(); */
const authorization = new Authorization();
authorization.renderSignIn();
const authorizationControllers = new AuthorizationControllers();
authorizationControllers.enableAuthorization();
// const sprint = new SprintControllers();
// sprint.startSprintPage('1', '1', null);
const mainPage = new MainPage();
mainPage.renderMainPage();
const footer = new Footer();
footer.renderFooter();
