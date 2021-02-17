import React, { useState, useCallback, useMemo }  from 'react';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import './schedule.css';

export default function Schedule(props) {
  const { state: { studentSchedule = [] } } = props;
  let cn = createCn('schedule'); //генерируем класс .schedule,  все последующие вызовы cn('class') будут возвращать .schedule__class

  const [filter, setFilter] = useState(''); // filter = '' - изначально пустой. функция setFilter будет задавать фильтр и обновлять компонент после этого

  const handleFilterChange = useCallback((e) => { //создем функцию обработчик на изменения значений инпута с фильтром
    setFilter(e.target.value);
  }, [setFilter]) //функция изменяется при изменении setFilter

  const renderSchedule = useMemo(() => { //фильтруем инфу об расписании (используя мемоизированные значения)
    if (!filter) {
      return studentSchedule;
    }
    const lowerFilter = filter.toLowerCase();
    return studentSchedule.filter(item => item.title.toLowerCase().includes(lowerFilter)) //ищем среди данных значения которые включают строку фильтра в заголовках
  }, [filter, studentSchedule]);

  return (
    <div class={cn()}>
      <h2>Расписание</h2>
      <BackButton to='/student' />
      <section className={ cn('filter')}>
        <input
          type='text'
          placeholder='Поиск'
          className={ cn('filter-search') }
          onChange={handleFilterChange}
        />
      </section>
      <section className={ cn('content') }>
        { renderSchedule.map((item) => {
          return(
            <a
              href={item.link}
              className={ cn('item') }
            >{item.title}</a>
          )
        })}
      </section>
    </div>
  )
}
