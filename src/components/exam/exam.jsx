import React, { useState, useCallback, useMemo }  from 'react';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import './exam.css';

export default function Exam(props) {
  const { state: { exams = [] } } = props;
  let cn = createCn('exam'); //генерируем класс .exam,  все последующие вызовы cn('class') будут возвращать .exam__class

  const [filter, setFilter] = useState('');// filter = '' - изначально пустой. функция setFilter будет задавать фильтр и обновлять компонент после этого

  const handleFilterChange = useCallback((e) => { //создем функцию обработчик на изменения значений инпута с фильтром
    setFilter(e.target.value);
  }, [setFilter]) //функция изменяется при изменении setFilter

  const renderExams = useMemo(() => { //фильтруем инфу об экзаменах (используя мемоизированные значения)
    if (!filter) {
      return exams;
    }
    const lowerFilter = filter.toLowerCase();
    let newExams = [];
    exams.forEach((group) => { //бежим по группа предметов
      let items = group.items.filter(({title}) => title.toLowerCase().includes(lowerFilter)); //в группах фильтруем значения списка предметов
      if(items.length) { //если после фильтрации есть значения, то добавляем группу в результирующую выборку со сзначениями, которые подходят по фильтру
        newExams.push({
          group: group.group,
          items
        })
      }
    })
    return newExams;
  }, [filter, exams]); //функция изменяется при изменении filter и exams

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
