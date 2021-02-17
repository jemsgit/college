import React from 'react';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import config from '../../config';

import './abitur.css';

function parseStateData(entranceInfo) {//парсим инфу о поступлении
  let countInfoLink;
  let docs;
  let comissionTimeWork;
  let blankLink;
  let blankTitle; 
  if (entranceInfo) {
    let info;
    ({countInfoLink, docs, info} = entranceInfo);
    if (info) {
      let doc;
      ({ time: comissionTimeWork, doc } = info);
      if (doc) {
        ({ link: blankLink, title: blankTitle } = doc);
      }
    }
  };
  return {
    countInfoLink,
    docs,
    comissionTimeWork,
    blankLink,
    blankTitle
  };
}

export default function Abitur(props) {
  let { state: { entranceInfo, paymentInfoUrl } } = props; //выдергиваем нужные данные из props
  let data = parseStateData(entranceInfo);
  const cn = createCn('abitur'); //генерируем класс .abitur, все последующие вызовы cn('class') будут возвращать .abitur__class
  return (
    <div className={ cn() }>
      <h2>Информация для абитуриентов</h2>
      <BackButton to='/' />
      <div className={ cn('main') }>
        {data && data.docs && (
          <div className={ cn('docs') }>
            <h3>Документы для поступления</h3>
            <p>
            { data.docs }
            <a href={config.entrance} target='download' className={ cn('info-item') }>
              Скачать
            </a>
            </p>
          </div>
        )}
        {data && data.comissionTimeWork && (
          <div className={ cn('comission') }>
            <h3>Работа комиссии</h3>
            <p>
              { data.comissionTimeWork }
            </p>
           </div>
        )}
        {data && data.blankLink && (
          <a href={data.blankLink} target='download' className={ cn('info-item') }>
            { data.blankTitle }
          </a>
        )}

        {data && data.countInfoLink && (
          <a href={data.countInfoLink} target='download' className={ cn('info-item') }>
            Данные о поступлении
          </a>
        )}
        {paymentInfoUrl&& (
          <a href={paymentInfoUrl} target='download' className={ cn('info-item') }>
            Информция об оплате
          </a>
        )}
      </div>
    </div>
  )
}