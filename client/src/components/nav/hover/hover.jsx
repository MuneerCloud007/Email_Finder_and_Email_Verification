/***
*
*   HOVER NAV
*   Reveals a nav when the user hovers over a hotspot
*   Items are rendered as children, revealed with CSS
*
*   PROPS
*   align: left or right (string, required)
*   children: will be passed from router > view > here (component(s), required)
*   className: custom styling (SCSS or tailwind style, optional)
*   label: the hotspot text (string, required)
*   icon: icon image (string, optional)
*
**********/

import React, { useState } from 'react';
import { Animate, Icon, ClassHelper } from 'components/lib';
import Style from './hover.module.scss';
import "./hover.css";

export function HoverNav(props){

  // state
  const [open, setOpen] = useState(false);

  console.log("HOver compoent")
  console.log(props.children);
  console.log(props.children.length)
 

  // style
  const css = ClassHelper(Style, {

    wrapper: true,
    [props.align]: true,
    className: props.className,

  });

  return (
    <div className={ css }
      onMouseEnter={ e => setOpen(true)}
      onMouseLeave={ e => setOpen(false)}
>
       { props.label && 
        <span className={ Style.label }>
          { props.label }
        </span> } 

      { props.icon && 
                  <img alt="Avatar" src={props.icon} className="rounded-full  w-10  h-10 object-cover " />
                }

      { open && props.children?.length && 
        <Animate type='slidedown' timeout={ 100 }>
<nav className={Style.nav} 
>


            { (props.children.length>1)?props.children.map(button => {

              return React.cloneElement(button, { className: Style.button });

            }): ( React.cloneElement(props.children, { className: Style.button }))}
          </nav>
        </Animate>
      }

    </div>
  );
}
