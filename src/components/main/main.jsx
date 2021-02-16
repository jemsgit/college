import React from 'react';
import { Link } from 'react-router-dom';
import { createCn } from 'bem-react-classname';

import './main.css';

export default function Main(props) {
  let cn = createCn('main');
  let { news = [] } = props
  return (
    <div className={cn()}>
      <div className={ cn('info')}>
        <h1>Мобильный портал колледжа</h1>
        <p>Здесь собрана основная информация, которая должна быть под рукой</p>
      </div>
      <section className={cn('menu')}>
        <Link to='/student' className={ cn('section') }>
          Студентам
        </Link>
        <Link to='/abitur' className={ cn('section') }>
          Абитуриентам
        </Link>
      </section>
      <section className={ cn('news')}>
        <h2>Свежие новости</h2>
        {news.map((newsItem) => {
          return (
            <div className={ cn('news-item')} >
              <a href={newsItem.link} className={ cn('news-item-link')}>
                <h3>{ newsItem.title }</h3>
              </a>
              <img src={ newsItem.imageUrl } className={ cn('news-item-image')}/>
              <p>{newsItem.text}...</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}