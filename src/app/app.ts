import Header from './views/Header';
import Footer from './views/Footer';
import Tutorial from './views/Tutorial';
import TutorialControllers from './controllers/TutorialControllers';
// import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
// const mainPage = new MainPage();
// mainPage.renderMainPage();
const tutorial = new Tutorial();
tutorial.renderTutorialPage();
const tutorialControllers = new TutorialControllers();
tutorialControllers.addListenners();
const footer = new Footer();
footer.renderFooter();
