import { createApp } from 'vue';
import App from '@pages/home/index.vue';

console.info('🚀 ', Date.now());

const app = createApp(App);
app.mount('#app');
