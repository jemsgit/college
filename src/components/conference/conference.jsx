import React, { useState, useCallback, useMemo }  from 'react';
//используем реакт хуки useState, useCallback, useMemo
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import './conference.css';

//инфа о конференс комнатах
export default function Conference(props) {
  const { state: { conferenceInfo = [] } } = props;
  let cn = createCn('conference'); //генерируем класс .conference,  все последующие вызовы cn('class') будут возвращать .conference__class

  const [filter, setFilter] = useState(''); // filter = '' - изначально пустой. функция setFilter будет задавать фильтр и обновлять компонент после этого

  const handleFilterChange = useCallback((e) => { //создем функцию обработчик на изменения значений инпута с фильтром
    setFilter(e.target.value);
  }, [setFilter])

  const renderConference = useMemo(() => { //useMemo мемоизирует вычисления информации о конференс комнатах. Если пришли те же самые значения фунция вернет старое значение и не будет выполняться
    if (!filter) {
      return conferenceInfo; //если фильтр пуст, то возвращаем все
    }
    const lowerFilter = filter.toLowerCase(); //приводим значение фильтра в нижний регистр
    return conferenceInfo.filter(item => item.name.toLowerCase().includes(lowerFilter)) //ищем среди данных значения которые включают строку фильтра в именах
  }, [filter, conferenceInfo]); //useMemo изменяется при изменении filter и conferenceInfo

  return (
    <div class={cn()}>
      <h2>Информация по конференс комнатам</h2>
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
        { renderConference.map((conf) => {
          return(
            <div className={ cn('item') }>
              <span className={ cn('item-name') }>
                { conf.name }
              </span>
              <span className={ cn('item-info') }>
                { conf.data }
              </span>
              <a href={conf.link} tagret='blank'>Ссылка</a>
            </div>
          )
        })}
      </section>
    </div>
  )
}
