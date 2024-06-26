/***
*
*   LOGO
*   Replace the images in /images with your own logo
*
*   PROPS
*   color: toggle between brand color or white logo (string, optional, default: white)
*   mark: use a logo mark or full logo (boolean, optional: default: full logo)
*
**********/

import { Link, ClassHelper } from 'components/lib';
import LogoWhite from '/assets/logo/logo-white.svg';
import LogoMarkWhite from '/assets/logo/logo-mark-white.svg';
import LogoColor from '/assets/logo/logo-color.svg';
import LogoMarkColor from '/assets/logo/logo-mark-color.svg';
import Style from './logo.tailwind.js';
import CloudVandanaLogo from "../../../public/assets/icons/CloudVandanaLogo.png"

export function Logo(props){

  const Logo = {
    color: {
      logo: LogoColor,
      mark: LogoMarkColor 
    },
    white: {
      logo: LogoWhite,
      mark: LogoMarkWhite
    }
  }

  const logoStyle = ClassHelper(Style, props);
  
  return(
    <Link url='/' className={ logoStyle } style={{width:"2rem"}}>
      {/* <img src={CloudVandanaLogo} alt='Logo' style={{width:"2rem"}}/> */}
    </Link>
  )
}
