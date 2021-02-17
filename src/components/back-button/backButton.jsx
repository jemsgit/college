import React from 'react';
import { Link } from 'react-router-dom';

import './back.css';

//кнопка "Назад" на всех страницах
export default function BackButton(props) {
  return (
    <Link to={props.to} className='back-button'>
        Назад
    </Link>
  )
}