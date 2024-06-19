import { Badge, ClassHelper, Checkbox, Image, useTranslation, Link, HoverNav, Button, ViewContext, useAPI, Radio } from 'components/lib';
import { RowActions } from './actions';
import Style from './table.module.scss'
// import DropDown from "./dropdown.jsx";
import { useContext, useState } from 'react';

export function Body(props) {
  props.data.map(({ Id, ...rest }) => rest);
  //.slice(props.offset,props.offset+10) 


  if (props.data.length) {
    return (
      <tbody className={Style.body}>

        {props.data.map((row, index) => {

          const selected = props.selected.findIndex(x => x.index === index) > -1 ? true : false;

          return (
            <Row
              select={props.select}
              selected={selected}
              badge={props.badge}
              show={props.show}
              hide={props.hide}
              actions={props.actions}
              data={row}
              apiData={props.apiData}
              index={index}
              key={index}
              rowIndex={index}
              callback={props.callback}
              editResource={props.editResource}
              NotallowSvg={props.NotallowSvg}
              setFeatureButtonFunction={props.setFeatureButtonFunction}
              countRadio={index}

            />
          )

        })}

      </tbody>
    );
  }

  return (
    <tbody className={Style.body}>
      <tr >
        <td colSpan='10' className={Style.empty} style={{ textAlign: "center" }}>No results found</td>
      </tr>
    </tbody>
  );
}

export function Row(props) {

  const { t } = useTranslation();
  const context = useContext(ViewContext);






  const deleteJobApplication = (id) => {

    const formData = {
    }

    context.modal.show({
      title: 'DELETE JOB APPLICATION',
      form: formData,
      buttonText: 'Delete',
      text: '',
      url: `/salesforce/api/v1/jobApplication/delete/${id}`,
      method: 'Delete',
      descructive: "Cancel"
    });
    // context.modal.hide();
    return 0;

  }

  const editJobApplication = (id, data) => {




    context.modal.show({
      title: 'Edit JOB APPLICATION',
      form: data,
      buttonText: 'Edit',
      text: '',
      url: `/salesforce/api/v1/jobApplication/edit/${id}`,
      method: 'patch',
      descructive: "Cancel",
      table: "Resource",
      opt: "editJobApplication"
    });

  }



  const row = { ...props.select && { select: true }, ...props.data }
  row.actions = row.actions || props.actions;
  const hasActions = Object.values(row.actions).some(x => (x !== undefined));





  return (
    <tr data-id={props.data.id}>
      {Object.keys(row).map((cell, index) => {

        let value = row[cell];

        const css = ClassHelper(Style, {

          cell: true,
          select: cell === 'select',
          cell_empty: !value,

        })

        // select
        if (cell === 'select') {


          return (
            <td key={index} className={css}>
              {/* <Radio
             checkbox={toggleButton}
                className={Style.checkbox} 
                ref={props.radioButton}
                name="selectable"
                callback={(index, checked, option)=>{
                 
                  setToggleButton(true);
                  



                }}

                option=""
                index={props.countRadio}
                />  */}
              <input type="radio" name='radio' className={`float-left relative w-6 h-6 cursor-pointer mr-2 bg-none 
  border border-solid border-slate-200 bg-center appearance-none
  rounded-full checked:after:absolute checked:after:top-1/2 
  checked:after:left-1/2 checked:after:w-3 checked:after:h-3
  checked:after:rounded-full checked:after:bg-white 
  checked:after:-translate-y-1/2 checked:after:-translate-x-1/2 
  checked:bg-emerald-500 dark:border-slate-600 radioButton`} value={row.Id} />

            </td>
          );
        }

        // actions
        // if (cell === 'actions')
        //   return hasActions ? <RowActions row={ row } index={ index } key={ index } callback={ props.callback }/> : false;

        // hide
        if (props.hide?.includes(cell))
          return false;

        // show
        if (props.show && !props.show.includes(cell))
          return false;

        // is date/time
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {

          const date = new Date(value).toISOString().split('T');
          value = `${date[0]} ${date[1].split('.')[0]}`;

        }

        // has badge
        if (props.badge) {

          let color;
          const badges = Array.isArray(props.badge) ? props.badge : [props.badge];

          badges.forEach(badge => {

            // check if the current cell matches the badge column
            if (value !== undefined && cell === badge.col) {

              // check each condition
              if (badge.condition) {
                badge.condition.forEach(cond => {

                  (typeof cond.value === 'string' && typeof value === 'string') ?
                    color = cond.value.toLowerCase() === value.toLowerCase() ? cond.color : color :
                    color = cond.value === value ? cond.color : color;

                });
              }
            }
          })

          if (color) {
            return (
              <td key={index} className={css}>
                <Badge
                  text={

                    value === true ?
                      t('global.table.label.yes') :
                      (value === false ? t('global.table.label.no') : value)

                  }
                  color={color}
                  className={Style.badge}
                />
              </td>
            );
          }
        }

        // image
        if (/.(jpeg|jpg|png|gif|bmp)$/.test(value) || (cell === 'avatar' && value)) {
          return (
            <td key={index} className={css}>
              <Image source={value} className={Style.image} />
            </td>
          )
        }



        // standard cell

        return (
          <>{
            (cell == props.data.Links.view.col) ? <td key={index} className={css} value={props.key}>


              <Link
                url={props.data.Links.view.url}
                className={`cursor-pointer text-blue-500`}
                title={props.data.Links.view.id}
                text={value}
                id={props.index}

              />
            </td > :
              <td key={index} className={css} style={{ padding: "0.5rem", borderLeft: "1px solid white", borderRight: '1px solid white', background: "#F8FAFC" }}>
                {value === true ? t('global.table.label.yes') : (value === false ? t('global.table.label.no') : value)}
              </td>

          }





          </>
        )



      })}
      {
        (props.data.Links.view.table == "resource" && !props.NotallowSvg) && <td className={"pl-3"} >
          <div className=' flex gap-3' style={{ gap: "1.5rem" }}>
            <Button icon='edit' onClick={() => {
              let dummyData = [...props.apiData];
              dummyData = dummyData.filter((vl) => vl.Id === document.getElementById(`${props.index}-edit_resource_btn`).parentElement.parentElement.parentElement.firstChild.firstChild.title)
              console.log(dummyData);

              props.editResource(document.getElementById(`${props.index}-edit_resource_btn`).parentElement.parentElement.parentElement.firstChild.firstChild.title, dummyData[0])

            }} className={Style.row_actions_button} id={`${props.index}-edit_resource_btn`}>
              Edit
            </Button>

          </div>
        </td>
      }


      {
        (props.data.Links.view.table == "jobApplication") && <td className={"pl-3"}>
          <div className=' flex gap-3' style={{ gap: "1.5rem" }}>
            <Button icon='edit' onClick={() => {
              let dummyData = [...props.apiData];
              dummyData = dummyData.filter((vl) => vl.Id === document.getElementById(`${props.index}-edit_jobApplication_btn`).parentElement.parentElement.parentElement.firstChild.firstChild.title)
              console.log(dummyData);
              console.log("I am in jobapplication edit pannel");
              console.log(
                document.getElementById(`${props.index}-edit_jobApplication_btn`).parentElement.parentElement.parentElement.firstChild.firstChild.title
              );

              editJobApplication(document.getElementById(`${props.index}-edit_jobApplication_btn`).parentElement.parentElement.parentElement.firstChild.firstChild.title, dummyData[0])

            }}
              className={Style.row_actions_button}
              id={`${props.index}-edit_jobApplication_btn`}
            />
            <Button icon='trash' className={Style.row_actions_button}
              onClick={() => {


                deleteJobApplication(document.getElementById(`${props.index}-trash_jobApplication_btn`).parentElement.parentElement.parentElement.firstChild.firstChild.title)
              }}
              id={`${props.index}-trash_jobApplication_btn`}
            />
          </div>
        </td>
      }


    </tr>
  );
}