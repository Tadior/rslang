import Header from './views/Header';
import Footer from './views/Footer';
import MainPage from './views/MainPage';

const header = new Header();
header.createHeader();
const mainPage = new MainPage();
mainPage.createMainPage();
const footer = new Footer();
footer.createFooter();
