/***
*
*   PAGINATE
*   Pagination control to split results into multiple pages
*   Returns a new offset
*
*   PROPS
*   className: custom styling (SCSS or tailwind style, optional)
*   limit: the number of results per page (integer, required)
*   loading: toggle loading state (boolean, optional)
*   offset: the current position (integer, required)
*   total: the total number of results (integer, required)
*
**********/

import { useState, useEffect } from 'react';
import { Button, ClassHelper, useTranslation } from 'components/lib';
import Style from './paginate.tailwind.js';

export function Paginate(props) {

  const { t } = useTranslation();
  const totalPages = Math.ceil(props.total / props.limit);
  // const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { page, setPage } = props
  console.log("Pagninate");
  console.log(props.total)


  useEffect(() => {
    if(props.total==0) {
      return  setTotal(props.total);

    }

      setTotal(props.total);

  }, [props.total])

  function prev() {
    if (props.page > 0) {

      props.setPage(props.page - 1)
      props.onChange((props.page - 1) * props.limit)

    }
  }

  function next() {
    if (props.page < (totalPages - 1)) {

      props.setPage(props.page + 1)
      props.onChange((props.page + 1) * props.limit)

    }
  }

  const start = parseInt(props.offset + 1); // add one so it doesn't start at 0
  const end = parseInt(props.offset) + parseInt(props.limit);

  const paginateStyle = ClassHelper(Style, {

    paginate: true,
    className: props.className

  });

  return (
    <section className={paginateStyle} style={{display:"flex"}}>


      <Button
        icon='chevrons-left'
        size={20}
        color='transparent'
        className={Style.button}
      
        iconColor={props.page > 0 || props.loading ? 'purple' : 'grey'}
        action={() => {

          setPage(0)
          props.onChange(0 * props.limit)

        }}
      />
      <div style={{marginInline:"0.5rem"}}></div>

      <Button
        icon='chevron-left'
        size={20}
        color='transparent'
        className={Style.button}
        iconColor={props.page > 0 || props.loading ? 'purple' : 'grey'}
        action={prev}
      />

      <span className={Style.counter}>

        {(props.offset || props.limit) ?
          t('global.paginate.showing', { start: start, end: (end > props.total ? props.total : end), total: total }) :
          t('global.paginate.no_results')}

      </span>

      <Button
        icon='chevron-right'
        size={20}
        color='transparent'
        className={Style.button}
        iconColor={page < (totalPages - 1) || props.loading ? 'purple' : 'grey'}
        action={next}
      />
            <div style={{marginInline:"0.5rem"}}></div>

      <Button
        icon='chevrons-right'
        size={20}
        color='transparent'
        className={Style.button}
        iconColor={page < (totalPages - 1) || props.loading ? 'purple' : 'grey'}
        action={() => {

          setPage(Math.floor(props.total / 10))
          props.onChange((Math.floor(props.total / 10)) * props.limit)

        }}
      />

    </section>
  )
}