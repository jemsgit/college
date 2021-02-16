import React, { useState, useCallback, useMemo }  from 'react';
import { createCn } from 'bem-react-classname';
import BackButton from '../back-button/backButton';

import './conference.css';

export default function Conference(props) {
  const { state: { conferenceInfo = [] } } = props;
  let cn = createCn('conference');

  const [filter, setFilter] = useState('');

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, [setFilter])

  const renderConference = useMemo(() => {
    if (!filter) {
      return conferenceInfo;
    }
    const lowerFilter = filter.toLowerCase();
    return conferenceInfo.filter(item => item.name.toLowerCase().includes(lowerFilter))
  }, [filter, conferenceInfo]);

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
