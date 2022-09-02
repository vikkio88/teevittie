import { createStoreon } from 'storeon';
import app from './modules/app';

const store = createStoreon([app]);


export default store;