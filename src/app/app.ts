import Header from './views/Header';
import Footer from './views/Footer';
import AuthorizationControllers from './controllers/AuthorizationControllers';
import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
const authorizationControllers = new AuthorizationControllers();
authorizationControllers.enableAuthorization();
const main = new MainPage();
main.renderMainPage();
const footer = new Footer();
footer.renderFooter();
