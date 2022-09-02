import Header from './views/Header';
import Footer from './views/Footer';
import AuthorizationControllers from './controllers/AuthorizationControllers';
import MainPage from './views/MainPage';
// import HeaderControllers from './controllers/HeaderControllers';

const header = new Header();
header.renderHeader();
const authorizationControllers = new AuthorizationControllers();
authorizationControllers.enableAuthorization();
const mainPage = new MainPage();
mainPage.renderMainPage();
const footer = new Footer();
footer.renderFooter();

/* const nav = new HeaderControllers();
nav.listenHeader(); */
