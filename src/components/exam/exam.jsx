import React, { useState, useCallback, useMemo }  from 'react';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import './exam.css';

export default function Exam(props) {
  const { state: { exams = [] } } = props;
  let cn = createCn('exam');

  const [filter, setFilter] = useState('');

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, [setFilter])

  const renderExams = useMemo(() => {
    if (!filter) {
      return exams;
    }
    const lowerFilter = filter.toLowerCase();
    let newExams = [];
    exams.forEach((group) => {
      let items = group.items.filter(({title}) => title.toLowerCase().includes(lowerFilter));
      if(items.length) {
        newExams.push({
          group: group.group,
          items
        })
      }
    })
    return newExams;
  }, [filter, exams]);

  return (
    <div class={cn()}>
      <h2>Информация об экзаменах</h2>
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
        { renderExams.map((group) => {
          return (
            <div className={ cn('item') }>
              <h4>{group.group}</h4>
              {
                group.items.map((item) => {
                  return (
                    <a
                      href={item.link}
                      className={ cn('item-link') }
                    >{ item.title }</a>
                  )
                })
              }
              
            </div>
          )
        })}
      </section>
    </div>
  )
}
