import Header from './views/Header';
import AudioCallControllers from './controllers/AudioCallControllers';

const header = new Header();
header.renderHeader();
const controller = new AudioCallControllers();
controller.startAudioCallPage('0', '0');
