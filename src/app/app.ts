import Header from './views/Header';
import Footer from './views/Footer';
import SprintPage from './views/Sprint';
// import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
// const mainPage = new MainPage();
// mainPage.renderMainPage();
const sprint = new SprintPage();
sprint.renderSprintPage();
const footer = new Footer();
footer.renderFooter();
