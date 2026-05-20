import { mount } from 'svelte';
import App from './App.svelte';
import './styles/tokens.css';
import './styles/reset.css';

const target = document.getElementById('app');
if (!target) {
  throw new Error('Missing #app root');
}

export default mount(App, { target });
