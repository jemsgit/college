import axios from 'axios';
import config from './config';

export async function fetchData() {
  let data;
  try { 
    const resp = await axios.get(config.baseUrl);
    data = resp.data;
  } catch(e) {
    console.log('cant fetch data')
  }
  return data;
}