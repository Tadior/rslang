import Header from './views/Header';
import Footer from './views/Footer';
import MainPage from './views/MainPage';
import AuthorizationControllers from './controllers/AuthorizationControllers';

const header = new Header();
header.renderHeader();
const mainPage = new MainPage();
mainPage.renderMainPage();
const footer = new Footer();
footer.renderFooter();
const authorization = new AuthorizationControllers();
authorization.enableAuthorization();
console.log(authorization.checkUserInLocalStorage());
