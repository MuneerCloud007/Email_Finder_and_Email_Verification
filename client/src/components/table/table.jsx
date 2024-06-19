/***
*
*   TABLE
*   Dynmaic table with sorting, search and row actions
*   Header rows are created dynamically from column names
*
*   PROPS
*   actions: object with edit/delete/custom callback functions (object, optional)
*   badge - column name and color to add badges to column (object, optional)
*   bulkActions: global actions array when using selectable (array, optional)
*   data: array of table rows (array, required)
*   header - array of header column names (array, optional)
*   hide - columns (object key names) to hide (array, optional, default: none)
*   loading: toggle loading spinner (boolean, optional)
*   search: show the search field (boolean, optional)
*   selectable: user can select table rows (boolean, optional)
*   show: columns (object key names) to show (array, optional, default: all)
*   translation: reference to a locale object to use for the header translations (string, optional)
*   naked: remove the styling (boolean, optional)
*   throttle: throttle the search callback in ms (integer, optional)
*
**********/

import { Fragment, useState, useEffect, useContext } from 'react';
import { Loader, Search, ClassHelper, Checkbox, useTranslation, ViewContext, Paginate } from 'components/lib';
import { Header } from './header';
import { Body } from './body';
import { BulkActions } from './actions';
import Style from './table.module.scss';
import { PaginateComp } from 'views/setupAuditTrail/SetupAuditTrail';


//slice(props.offset,props.offset+10)


export function Table(props) {

  const { t } = useTranslation();

  // state
  const [header, setHeader] = useState(null);
  const [body, setBody] = useState(null);
  const [filter, setFilter] = useState(false);
  const [selected, setSelected] = useState([]);
  const [featureButton, setFeatureButton] = useState(false);
  const context = useContext(ViewContext);


  let countRadio = -1;
  countRadio++;





  useEffect(() => {
    if (props.data) {

      // create the headers
      const header = [];

      // determine the source of keys (props.data.header or from data key)
      const source = props.data.header || (props.data.length ? Object.keys(props.data[0]) : []);

      if (source.length) {
        source.forEach(key => {

          let translation = props.translation ? t(`${props.translation}.header.${key}`) : false;
          translation = key === 'actions' ? t('global.table.header.actions') : translation;

          header.push({
            name: props.data.header ? key.name : "",
            title: (props.data.header ? key.title : ""),
            sort: key !== 'actions'
          });
        });
      }

      setBody(props.data.body || props.data);

      // if(props.data.length==0) {
      //   alert("It is empty");
      // }
      setHeader(header);
      //
    }
  }, [props.data]);

  // loading
  if (props.loading) {
    return (
      <div className={Style.loading}>
        <Loader />
      </div>
    );
  }

  // no data
  if (!header && !body)
    return false

  function sort(column, direction) {

    const rows = (filter)?[...filter]:[...body]


    rows.sort(function (a, b) {

      if ((a[column] != null) && (b[column] != null)) {

        a[column].badge ?
          a = a[column].label : a = a[column];

        b[column].badge ?
          b = b[column].label : b = b[column];

        // compare dates
        if (/^\d{4}-\d{2}-\d{2}$|^\d{1,2} [A-Z][a-z]{2} \d{4}$/.test(a)) {

          return direction === 'desc' ?
            new Date(b).getTime() - new Date(a).getTime() :
            new Date(a).getTime() - new Date(b).getTime();

        }
        else {

          // compare strings and numbers
          if (direction === 'desc') {

            if (a.toLowerCase() > b.toLowerCase()) return -1;
            if (a.toLowerCase() < b.toLowerCase()) return 1;
            else return 0;

          }
          else {



            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            else return 0;

          }
        }
      }
      else {

        return false;

      }
    });

    setFilter(rows)

  }

  function search(term) {

    if (!term) {
      props.setArrLength(body)

      return setFilter(false);
    }
    // search each cell in each row &
    // update state to show only filtered rows
    let rowsToShow = [];


    body.forEach(row => {
      for (let cell in row) {
        if (row[cell]?.toString().toLowerCase().includes(term.trim().toLowerCase())) {

          if (!rowsToShow.includes(row))
            rowsToShow.push(row);

        }
      }
    })
   
    props.setOffset(0);

    setFilter(rowsToShow);
    props.setArrLength(rowsToShow)

  }

  function select(index, id) {

    // toggle the select state 
    // save the index of selected
    const s = [...selected];
    const i = s.findIndex(x => x.index === index);
    i > -1 ? s.splice(i, 1) : s.push({ index, id });
    return setSelected(s);

  }

  function selectAll() {

    // toggle all visible rows
    setSelected(selected.length ? [] :
      props.data.map((x, i) => { return { index: i, id: x.id } }));

  }

  function editRowCallback(res, row) {

    // update state
    let state = [...body];
    let stateRow = state[state.findIndex(x => x.id === row.id)];
    Object.keys(res).map(key => stateRow[key] = res[key].value);
    setBody(state);

    // update filter
    if (filter) {

      let f = [...filter];
      let filterRow = f[f.findIndex(x => x.id === row.id)];
      Object.keys(res).map(key => filterRow[key] = res[key].value);
      setFilter(f);

    }
  }

  function deleteRowCallback(row) {

    const b = [...body];
    const remove = Array.isArray(row) ? row : [row]; // ensure array

    // remove from body
    remove.forEach(r => {
      b.splice(b.findIndex(x => x.id === r.id), 1);
    });

    setBody(b);
    setSelected([]); // reset selected items to 0

    // update filter
    if (filter) {

      let f = [...filter];

      remove.forEach(r => {
        f.splice(f.findIndex(x => x.id === r.id), 1);
      });

      setFilter(f);

    }
  }

  const tableStyle = ClassHelper(Style, {

    table: true,

  });



  const editResource = (id, dummyData) => {

    let formData = { ...dummyData }
    delete formData["attributes"];
    


    //  return context.modal.show({
    //   title: 'Edit Resource',
    //    form: formData,
    //    buttonText: 'Edit',
    //    text: '',
    //    url: `/salesforce/api/v1/resource/edit/${id}`,
    //    method: 'patch',
    //    descructive: "Cancel"
    //  });


  }






  

  const showSelectable = props.selectable && props.bulkActions && Object.keys(props.bulkActions).length && selected.length;

  return (
    <Fragment>
      <div style={{ padding: "1rem" }}>
        {props.search || showSelectable ?
          <div className={Style.inputs}  >

            {props.search &&
              <Search className={Style.search} callback={search} throttle={props.throttle}
                value={props.value}
              />}

            {showSelectable ?
              <BulkActions
                actions={props.bulkActions}
                selected={selected}
                delete={deleteRowCallback}
              /> : undefined}

          </div> : undefined
        }

        { /* select all for mobile */}
        {showSelectable ?
          <div className={Style.select_all}>
            <Checkbox
              option={t('global.table.action.select_all')}
              callback={selectAll}
              checked={selected.length === props.data?.length}
            />
          </div> : undefined
        }
        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>

          {header && props.paginate &&
         

            <Paginate
            offset={props.offset}
            setOffset={props.setOffset}
            limit={10}
            total={(!props.arrLength) ? props.arrayData?.length : props.arrLength?.length}
            onChange={os => props.setOffset(os)}
            page={props.page}
            setPage={props.setPage}
            
            
        />


          }
        </div>
        <div className='table-wrapper' style={{ height: "50vh", overflowY: "auto" }}>


          <table className={!props.naked && tableStyle} style={{ width: "100%",paddingInline:"1rem" }}>


            {header &&
              <Header
                data={header}
                callback={sort}
                show={props.show}
                hide={props.hide}
                select={props.selectable ? selectAll : false}
                hasData={props.data?.length}
                selectAll={selected.length === props.data?.length}
                actions={props.actions}
                countRadio={countRadio}
                unsorted={props.unsorted}
                setFeatureButton={setFeatureButton}
                featureButton={featureButton}
              />
            }
            {

              body &&
              <Body
                data={filter ? filter.slice(props.offset, props.offset + 10) : body.slice(props.offset, props.offset + 10)}
                show={props.show}
                hide={props.hide}
                badge={props.badge}
                select={props.selectable ? select : false}
                apiData={props.apiData}
                selected={selected}
                offset={props.offset}
                NotallowSvg={(props.NotallowSvg) ? props.NotallowSvg : false}
                radioButton={props.radioButton}
                setFeatureButton={setFeatureButton}
                setFeatureButtonFunction={(vl) => {
                  setFeatureButton(vl)
                }}
                featureButton={featureButton}
                editResource={editResource}
                actions={{

                  edit: props.actions?.edit,
                  view: props.actions?.view,
                  delete: props.actions?.delete,
                  email: props.actions?.email,
                  custom: props.actions?.custom,
                  download: props.actions?.download

                }}
                callback={{

                  edit: editRowCallback,
                  delete: deleteRowCallback

                }}
              />

            }
          </table>
        </div>
      </div>
    </Fragment>


  );
}