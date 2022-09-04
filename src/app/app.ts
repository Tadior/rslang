import Header from './views/Header';
import Footer from './views/Footer';
import AuthorizationControllers from './controllers/AuthorizationControllers';
import Tutorial from './views/Tutorial';
// import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
const authorizationControllers = new AuthorizationControllers();
authorizationControllers.enableAuthorization();
const tutorial = new Tutorial();
tutorial.renderTutorialPage();
// const mainPage = new MainPage();
// mainPage.renderMainPage();
const footer = new Footer();
footer.renderFooter();
