/***
*
*   HEADER
*   Header section with main title
*
*   PROPS
*   children: children to render (component(s), optional)
*   title: title of the view (string, optional)
*
**********/

import Style from './header.tailwind.js';

export function Header(props){

  return (
    <header className={ Style.header }>

      { props.title && 
        <h1>{ props.title }</h1> }

      { props.children }

    </header>

  );
}
