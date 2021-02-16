import React from 'react';
import { Link } from 'react-router-dom';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import config from '../../config';

import './student.css'

export default function Student(props) {
  let { state: {
    conferenceInfo,
    exams,
    libraryUrl,
    studentReminder,
    studentSchedule
  } } = props;
  
  const cn = createCn('student');
  return (
    <div className={ cn() }>
      <h2>Информация для студентов</h2>
      <BackButton to='/' />
      <div>
        {conferenceInfo && (
           <Link to='/conference' className={ cn('info-item') }>
              Список конференс комнат
            </Link>
        )}

        {libraryUrl && (
          <a
            href={libraryUrl}
            target='blank'
            className={ cn('info-item') }>
            Перейти в библиотеку
          </a>
        )}

        { studentSchedule && (
          <Link to='/schedule' className={ cn('info-item') }>
            Расписания
          </Link>
        )}

        { exams && (
          <Link to='/exam' className={ cn('info-item') }>
            Экзамены
          </Link>
        )}

        {studentReminder && (
          <a href={config.reminder} target='download' className={ cn('info-item') }>
            Памятка студента
          </a>
        )}
      </div>
    </div>
  )
}