const Style = {

  wrapper: 'relative cursor-pointer text-slate-500 z-100',
  nav: 'absolute top-full px-2 text-left rounded shadow-md  px-4 dark:bg-slate-800 min-w-44 right-0  bg-slate-200',

  button: `block !bg-transparent text-sm w-full border-b border-solid border-dotted border-slate-200 
    rounded-none font-thin !px-2 py-4 text-right !text-slate-800 last:border-none opacity-70 
    hover:opacity-100 dark:!text-slate-200 dark:border-slate-700 normal-case hover-btn`,

  label: 'inline-block text-sm font-semibold !text-slate-400',
  icon: 'relative inline-block ml-[2px] top-[1px]',
  left: 'left-0 text-left',
  right: 'right-0 text-right [&_button]:text-right [&_a]:text-right',

}

export default Style;