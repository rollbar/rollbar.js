import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import RollbarPlugin from './rollbar'; // Path to your rollbar.js file
import RollbarTest from './components/RollbarTest.vue'; // Path to your RollbarTest.vue file //TESTING

const app = createApp(App);
app.use(RollbarPlugin);
app.component('RollbarTest', RollbarTest);

createApp(App).mount('#app');
