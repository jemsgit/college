import axios from 'axios';
import config from './config';

export async function fetchData() { //функция получения данных с сервера
  let data;
  try { 
    const resp = await axios.get(config.baseUrl);
    data = resp.data; //данные из ответа
  } catch(e) {
    console.log('cant fetch data')
  }
  return data;
}