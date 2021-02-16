import React, { useState, useCallback, useMemo }  from 'react';
import { Link } from 'react-router-dom';
import { createCn } from 'bem-react-classname';

import './back.css';

export default function BackButton(props) {
  return (
    <Link to={props.to} className='back-button'>
        Назад
    </Link>
  )
}