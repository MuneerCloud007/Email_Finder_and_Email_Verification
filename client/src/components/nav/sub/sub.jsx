/***
*
*   SUB NAV
*   Sub-navigation element (located underneath the header)
*
*   PROPS
*   items: array of items with values: label, link, permission (array, required)
*
**********/

import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext, } from 'components/lib';
import Style from './sub.tailwind.js';

export function SubNav(props){

  const context = useContext(AuthContext);

  return(
    <nav className={ Style.subnav }>
      { props.items?.map(item => {
        
        if (item.permission && !context.permission[item.permission])
          return false

        return (
          <NavLink
            key={ item.label }
            to={ item.link }
            className={({ isActive }) => isActive ? Style.item_active : Style.item }>

            { item.label }

          </NavLink>
        );
      })}
    </nav>
  );
}
