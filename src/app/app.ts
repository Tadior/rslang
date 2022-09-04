import Header from './views/Header';
import AudioCallControllers from './controllers/AudioCallControllers';

const header = new Header();
header.renderHeader();
const controller = new AudioCallControllers();
controller.startAudioCallDictionary('d796e624-8a2a-4f96-9935-ae22747e940a');
