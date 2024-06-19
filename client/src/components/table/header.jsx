import { useEffect, useState } from 'react';
import { ClassHelper, Checkbox, useTranslation } from 'components/lib';
import Style from './table.module.scss';

export function Header(props) {

  const { t } = useTranslation();

  // initialise
  let data = [...props.data]
  let colLength = data?.length ? data.length - 1 : 0;
  let Manualsorted = new Array(colLength)




  // state
  const [sortDirections, setSortDirections] = useState(JSON.parse(localStorage.getItem("percievedOrder")));
  const [sortDirections_noMongoDB, setSortDirections_noMongoDB] = useState(new Array(colLength));





  useEffect(() => {

    console.log("I am inside header");
    console.log(data);
    if (data && !data[0].sorted && localStorage.getItem("sorted_Date") === "false") {
      sortTwo(0, data[0].name)
      data[0].sorted = true;
      localStorage.setItem("sorted_Date", true);
    }


    // data.forEach((cell, index) => {
    //   if (cell.sort && !cell.sorted && filterSortDirection[0] === cell.name) { // Add a check for the sorted flag
    //     sortTwo(index, filterSortDirection[0]);
    //     cell.sorted = true;
    //   }
    // });
  }

    , [data]);











  if (!data)
    return false;

  // inject select
  if (props.select)
    data.unshift({ name: 'select', title: t('global.table.header.select'), sort: false });

  // inject actions
  if (props.actions && props.data[colLength]?.name)
    data.push({ name: 'actions', title: t('global.table.header.actions'), sort: false });

  // sort the columns
  function sort(index, cell) {



    if (props.unsorted) {



      if (!props.data[props.select ? index - 1 : index].sort)
        return false;

      const direction =
        sortDirections_noMongoDB[index] === 'asc' ? 'desc' : 'asc';

      // reset sorting on all columns
      let sorted = new Array(colLength)
      sorted[index] = direction;

      // done
      props.callback(cell, direction);
      setSortDirections_noMongoDB(sorted)









      return 0;




    }
    else {
      if (!props.data[props.select ? index - 1 : index].sort)
        return false;





      const direction =
        sortDirections[cell] === 'asc' ? 'desc' : 'asc';

      // reset sorting on all columns
      let sorted = new Array(colLength)
      sorted[index] = direction;


      // done
      let dummpObject = { ...sortDirections };
      Object.keys(dummpObject).forEach((key, index) => {
        dummpObject[key] = (sorted[index] == undefined) ? null : sorted[index];
      });
      props.callback(cell, direction);
      localStorage.setItem("percievedOrder", JSON.stringify(dummpObject));
      setSortDirections(dummpObject)
      return 0;

    }
  }
  function sortTwo(index, cell) {



    if (props.unsorted) {



      if (!props.data[props.select ? index - 1 : index].sort)
        return false;

      const direction =
        sortDirections_noMongoDB[index] === 'asc' ? 'asc' : 'desc';

      // reset sorting on all columns
      let sorted = new Array(colLength)
      sorted[index] = direction;

      // done
      props.callback(cell, direction);
      setSortDirections_noMongoDB(sorted)









      return 0;




    }
    else {
      if (!props.data[props.select ? index - 1 : index].sort)
        return false;





      const direction =
        sortDirections[cell] === 'asc' ? 'desc' : 'asc';

      // reset sorting on all columns
      let sorted = new Array(colLength)
      sorted[index] = direction;


      // done
      let dummpObject = { ...sortDirections };
      Object.keys(dummpObject).forEach((key, index) => {
        dummpObject[key] = (sorted[index] == undefined) ? null : sorted[index];
      });
      props.callback(cell, direction);
      localStorage.setItem("percievedOrder", JSON.stringify(dummpObject));
      setSortDirections(dummpObject)
      return 0;

    }
  }












  if (JSON.parse(localStorage.getItem("percievedOrder")) && Object.keys(JSON.parse(localStorage.getItem("percievedOrder"))).length > 1) {

    if (Object.keys(JSON.parse(localStorage.getItem("percievedOrder"))).length < 2) {
      location.reload();
    }



    return (
      <thead className={Style.thead} style={{ background: "#F1F5F9", textAlign: "center", paddingInline: "0.3rem" }}>
        <tr >
          {data.map((cell, index) => {

            // style
            let css;
            if (props.unsorted) {
              css = ClassHelper(Style, {

                th: true,
                sort: cell.sort,
                th_actions: cell.name === 'actions',
                th_select: cell.name === 'select',
                asc: sortDirections_noMongoDB[index] === 'asc',
                desc: sortDirections_noMongoDB[index] === 'desc'

              });
            }
            else {
              css = ClassHelper(Style, {

                th: true,
                sort: cell.sort,
                th_actions: cell.name === 'actions',
                th_select: cell.name === 'select',
                asc: sortDirections[cell.name] === 'asc',
                desc: sortDirections[cell.name] === 'desc'

              });

            }

            // hide
            if (props.hide?.includes(cell.name))
              return false;

            // select all
            if (cell.name === 'select' && props.hasData) {
              return (
                <th key={index} className={css}>
                  <Checkbox
                    className={Style.checkbox}
                    checked={props.selectAll}
                    callback={props.select}
                  />
                </th>
              )
            }

            // show
            if (props.show && !props.show.includes(cell.name) && cell.name !== 'actions')
              return false;

            return (
              <>
                <th
                  key={index}
                  className={css}
                  onClick={() => cell.sort && sort(index, cell.name)}>
                  {cell.title}
                </th>
              </>
            );
          })}
        </tr>
      </thead>
    );
  }


  //# F1F5F9

  if (!JSON.parse(localStorage.getItem("percievedOrder"))) {
    return (
      <thead className={Style.thead} style={{ background: "#E2E8F0", textAlign: "center", paddingInline: "0.3rem" }}>
        <tr>
          {data.map((cell, index) => {

            // style
            let css;
            if (props.unsorted) {
              css = ClassHelper(Style, {

                th: true,
                sort: cell.sort,
                th_actions: cell.name === 'actions',
                th_select: cell.name === 'select',
                asc: sortDirections_noMongoDB[index] === 'asc',
                desc: sortDirections_noMongoDB[index] === 'desc'

              });
            }
            else {
              css = ClassHelper(Style, {

                th: true,
                sort: cell.sort,
                th_actions: cell.name === 'actions',
                th_select: cell.name === 'select',
                asc: sortDirections[cell.name] === 'asc',
                desc: sortDirections[cell.name] === 'desc'

              });

            }

            // hide
            if (props.hide?.includes(cell.name))
              return false;

            // select all
            if (cell.name === 'select' && props.hasData) {
              return (
                <th key={index} className={css}>
                  <Checkbox
                    className={Style.checkbox}
                    checked={props.selectAll}
                    callback={props.select}
                  />
                </th>
              )
            }

            // show
            if (props.show && !props.show.includes(cell.name) && cell.name !== 'actions')
              return false;

            return (
              <>
                <th
                  key={index}
                  className={css}
                  style={{ textAlign: "center", border: "1px solid white", paddingInline: "0.4rem" }}
                  onClick={() => cell.sort && sort(index, cell.name)}>
                  {cell.title}
                </th>
              </>
            );
          })}
        </tr>
      </thead>
    );
  }
}