import { createApp } from 'vue';
import './style.css';
import '@/assets/scss/abstracts/index.scss';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
