import Header from './views/Header';
import Footer from './views/Footer';
import Games from './views/Games';
// import MainPage from './views/MainPage';

const header = new Header();
header.renderHeader();
// const mainPage = new MainPage();
// mainPage.renderMainPage();
const game = new Games();
game.renderSprintGame();
const footer = new Footer();
footer.renderFooter();
