import React, { useState, useCallback, useMemo }  from 'react';
import { Link } from 'react-router-dom';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import './schedule.css';

export default function Schedule(props) {
  const { state: { studentSchedule = [] } } = props;
  let cn = createCn('schedule');

  const [filter, setFilter] = useState('');

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, [setFilter])

  const renderSchedule = useMemo(() => {
    if (!filter) {
      return studentSchedule;
    }
    const lowerFilter = filter.toLowerCase();
    return studentSchedule.filter(item => item.title.toLowerCase().includes(lowerFilter))
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
