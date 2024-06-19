import React from 'react';
import { useGlobalFilter, useSortBy, useTable, useFilters, usePagination } from "react-table";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Search, Button, Row } from 'components/lib';
import { getAllSetupAuditSlice } from 'feature/SetupAuditTrail/slice/SetupAuditTrail';
import { useAPI } from 'components/lib';
import  GlobalFilter  from "../setupAuditTrail//FilterTable";
import { usePagination as usePage } from 'contextApi/PaginationContext';
import "../setupAuditTrail/TrailDB.css"
import Style from "../../components/paginate/paginate.tailwind";
import upward from "../../../public/assets/icons/arrow-up.svg"
import downward from "../../../public/assets/icons/arrow-down.svg"
import { PaginationCustom } from "../setupAuditTrail/Pagination";





const Table = ({ columns, data }) => {
    const [pageData, setPageIndex] = useState(0);

    useEffect(() => {
        const table = document.getElementsByTagName("table")[0];
        const columnHeaders = Array.from(table.querySelectorAll('th'));
        let startX = 0;
        let startWidth = 0;
        let resizing = false;
        let resizingColumnIndex = -1;

        // Function to handle mouse down event on column header for resizing
        const handleMouseDown = (event, index) => {
            startX = event.pageX;
            startWidth = columnHeaders[index].offsetWidth;
            resizing = true;
            resizingColumnIndex = index;
        };

        // Function to handle mouse move event for resizing
        const handleMouseMove = event => {
            if (!resizing) return;
            const offset = event.pageX - startX;
            const newWidth = startWidth + offset;
            if (newWidth > 0) {
                columnHeaders[resizingColumnIndex].style.width = newWidth + 'px';
            }
        };

        // Function to handle mouse up event for resizing
        const handleMouseUp = () => {
            resizing = false;
        };

        // Add event listeners to column headers for resizing
        columnHeaders.forEach((th, index) => {
            th.addEventListener('mousedown', event => handleMouseDown(event, index));
        });

        // Add event listeners to document for mouse move and mouse up events
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);


        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);


    const defaultColumn = useMemo(
        () => ({
            // Specify default styles for each column header and cell
            Header: {
                style: {
                    borderBottom: '2px solid #333',
                    background: '#f2f2f2',
                    color: '#333',
                    fontWeight: 'bold',
                    textAlign: 'left'
                }
            },
            Cell: {
                style: {
                    padding: '8px',
                    borderBottom: '1px solid #ccc',
                    background: '#fff',
                    color: '#333'
                }
            }
        }),
        []
    );




    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        rows,
        preGlobalFilteredRows,
        setGlobalFilter,
        state,
        pageCount,
        gotoPage,

        state: { pageIndex, pageSize }, // Destructure state object correctly
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,

        pageOptions
    } = useTable(
        {
            columns,
            data,

            disableSortRemove: true,
            autoResetPage: false,

            autoResetFilters: false,
            autoResetSortBy: false,
            initialState: { pageIndex: pageData, pageSize: 10, sortBy: [{ id: 'CreatedDate', desc: true }] }, // Set initial page index and page size
        },
        useGlobalFilter,
        useSortBy,
        usePagination // Add usePagination hook
    );

    const [search, setSearch] = useState();
    console.log(page);

    return (
        <div className='wrapper-table'>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                setGlobalFilter={setGlobalFilter}
                globalFilter={state.globalFilter}
                gotoPage={                                    gotoPage
                }

            />
            <div>
                <div className="w-full border-t border-gray-300">
                    <div style={{ margin: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ marginLeft: '0.5rem', display: "flex", gap: "1rem", alignItems: "center" }}>
                            {/* pageCount,
    gotoPage, */}
                            <Button
                                color='blue'
                                text='First'

                                small={true}
                                action={() => {
                                    gotoPage(0);
                                }}
                            />
                            <Button
                                color='blue'
                                text='previous'

                                small={true}
                                action={() => {
                                    previousPage();
                                }}
                            />




                        </div>
                        <div>

                            <p>
                                showing <strong>{(rows.length) ? pageIndex + 1 : 0}</strong> to <strong>{pageOptions.length}</strong> of <strong>{rows.length}</strong> results

                            </p>
                        </div>
                        <div style={{ marginLeft: '0.5rem', display: "flex", gap: "1rem", alignItems: "center" }}>
                            {/* pageCount,
    gotoPage, */}


                            <Button
                                color='blue'
                                text='next'

                                small={true}
                                action={() => {
                                    nextPage()
                                }}
                            />
                            <Button
                                color='blue'
                                text='Last'

                                small={true}
                                action={() => {
                                    console.log(pageCount);
                                    gotoPage(pageCount - 1);
                                }}
                            />

                        </div>
                    </div>
                </div>
            </div>
            <div className="inner-wrapper-table">
                <table className='Trail-table' {...getTableProps()} >
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, index) => (
                                    <th className={`th-${index}`}

                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={{
                                            borderBottom: 'solid 1px #333',
                                            background: 'white',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            padding: "1rem",
                                            borderLeft: '1px solid #e5e7eb',

                                        }}
                                    >
                                        <div className=' wrapper-arrow'>
                                            {column.render('Header')}
                                            <span className='arrow'>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-sortable-column-icon" aria-hidden="true" data-pc-section="sorticon"><path d="M2.59836 13.2009C2.44634 13.2009 2.29432 13.1449 2.1743 13.0248L0.174024 11.0246C-0.0580081 10.7925 -0.0580081 10.4085 0.174024 10.1764C0.406057 9.94441 0.79011 9.94441 1.02214 10.1764L2.59836 11.7527L4.17458 10.1764C4.40662 9.94441 4.79067 9.94441 5.0227 10.1764C5.25473 10.4085 5.25473 10.7925 5.0227 11.0246L3.02242 13.0248C2.90241 13.1449 2.75038 13.2009 2.59836 13.2009Z" fill="currentColor"></path><path d="M2.59836 13.2009C2.27032 13.2009 1.99833 12.9288 1.99833 12.6008V1.39922C1.99833 1.07117 2.27036 0.799133 2.59841 0.799133C2.92646 0.799133 3.19849 1.07117 3.19849 1.39922V12.6008C3.19849 12.9288 2.92641 13.2009 2.59836 13.2009Z" fill="currentColor"></path><path d="M13.3999 11.2006H6.99902C6.67098 11.2006 6.39894 10.9285 6.39894 10.6005C6.39894 10.2725 6.67098 10.0004 6.99902 10.0004H13.3999C13.728 10.0004 14 10.2725 14 10.6005C14 10.9285 13.728 11.2006 13.3999 11.2006Z" fill="currentColor"></path><path d="M10.1995 6.39991H6.99902C6.67098 6.39991 6.39894 6.12788 6.39894 5.79983C6.39894 5.47179 6.67098 5.19975 6.99902 5.19975H10.1995C10.5275 5.19975 10.7996 5.47179 10.7996 5.79983C10.7996 6.12788 10.5275 6.39991 10.1995 6.39991Z" fill="currentColor"></path><path d="M8.59925 3.99958H6.99902C6.67098 3.99958 6.39894 3.72754 6.39894 3.3995C6.39894 3.07145 6.67098 2.79941 6.99902 2.79941H8.59925C8.92729 2.79941 9.19933 3.07145 9.19933 3.3995C9.19933 3.72754 8.92729 3.99958 8.59925 3.99958Z" fill="currentColor"></path><path d="M11.7997 8.80025H6.99902C6.67098 8.80025 6.39894 8.52821 6.39894 8.20017C6.39894 7.87212 6.67098 7.60008 6.99902 7.60008H11.7997C12.1277 7.60008 12.3998 7.87212 12.3998 8.20017C12.3998 8.52821 12.1277 8.80025 11.7997 8.80025Z" fill="currentColor"></path></svg> :
                                                        <span data-pc-section="sort"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-sortable-column-icon" aria-hidden="true" data-pc-section="sorticon"><path d="M4.59864 3.99958C4.44662 3.99958 4.2946 3.94357 4.17458 3.82356L2.59836 2.24734L1.02214 3.82356C0.79011 4.05559 0.406057 4.05559 0.174024 3.82356C-0.0580081 3.59152 -0.0580081 3.20747 0.174024 2.97544L2.1743 0.97516C2.40634 0.743127 2.79039 0.743127 3.02242 0.97516L5.0227 2.97544C5.25473 3.20747 5.25473 3.59152 5.0227 3.82356C4.90268 3.94357 4.75066 3.99958 4.59864 3.99958Z" fill="currentColor"></path><path d="M2.59841 13.2009C2.27036 13.2009 1.99833 12.9288 1.99833 12.6008V1.39922C1.99833 1.07117 2.27036 0.799133 2.59841 0.799133C2.92646 0.799133 3.19849 1.07117 3.19849 1.39922V12.6008C3.19849 12.9288 2.92646 13.2009 2.59841 13.2009Z" fill="currentColor"></path><path d="M13.3999 11.2006H6.99902C6.67098 11.2006 6.39894 10.9285 6.39894 10.6005C6.39894 10.2725 6.67098 10.0004 6.99902 10.0004H13.3999C13.728 10.0004 14 10.2725 14 10.6005C14 10.9285 13.728 11.2006 13.3999 11.2006Z" fill="currentColor"></path><path d="M10.1995 6.39991H6.99902C6.67098 6.39991 6.39894 6.12788 6.39894 5.79983C6.39894 5.47179 6.67098 5.19975 6.99902 5.19975H10.1995C10.5275 5.19975 10.7996 5.47179 10.7996 5.79983C10.7996 6.12788 10.5275 6.39991 10.1995 6.39991Z" fill="currentColor"></path><path d="M8.59925 3.99958H6.99902C6.67098 3.99958 6.39894 3.72754 6.39894 3.3995C6.39894 3.07145 6.67098 2.79941 6.99902 2.79941H8.59925C8.92729 2.79941 9.19933 3.07145 9.19933 3.3995C9.19933 3.72754 8.92729 3.99958 8.59925 3.99958Z" fill="currentColor"></path><path d="M11.7997 8.80025H6.99902C6.67098 8.80025 6.39894 8.52821 6.39894 8.20017C6.39894 7.87212 6.67098 7.60008 6.99902 7.60008H11.7997C12.1277 7.60008 12.3998 7.87212 12.3998 8.20017C12.3998 8.52821 12.1277 8.80025 11.7997 8.80025Z" fill="currentColor"></path></svg></span>
                                                    : ''}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    {(rows.length > 0) ?
                        <tbody {...getTableBodyProps()}>
                            {(page.length > 0) ? page.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}
                                        style={{ background: index % 2 === 0 ? 'aliceblue' : 'white' }}
                                    >
                                        {row.cells.map((cell, index) => (
                                            <td
                                                {...cell.getCellProps()}
                                                style={{
                                                    padding: '1rem',
                                                    borderLeft: '1px solid #e5e7eb'
                                                    // border: '1px solid #ccc !important',

                                                }}
                                            >{(index) ?


                                                cell.render('Cell') : <>{cell.render("Cell")}</>

                                                }

                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                                : <h1 className=' text-center'>Emty data</h1>}
                        </tbody> : <h1 className='' style={{ textAlign: "center" }}>
                            No Data is found
                        </h1>}
                </table>
            </div>
            <div className="w-full border-t border-gray-300">
                    <div style={{ margin: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ marginLeft: '0.5rem', display: "flex", gap: "1rem", alignItems: "center" }}>
                            {/* pageCount,
    gotoPage, */}
                            <Button
                                color='blue'
                                text='First'

                                small={true}
                                action={() => {
                                    gotoPage(0);
                                }}
                            />
                            <Button
                                color='blue'
                                text='previous'

                                small={true}
                                action={() => {
                                    previousPage();
                                }}
                            />




                        </div>
                        <div>

                            <p>
                                showing <strong>{(rows.length) ? pageIndex + 1 : 0}</strong> to <strong>{pageOptions.length}</strong> of <strong>{rows.length}</strong> results

                            </p>
                        </div>
                        <div style={{ marginLeft: '0.5rem', display: "flex", gap: "1rem", alignItems: "center" }}>
                            {/* pageCount,
    gotoPage, */}


                            <Button
                                color='blue'
                                text='next'

                                small={true}
                                action={() => {
                                    nextPage()
                                }}
                            />
                            <Button
                                color='blue'
                                text='Last'

                                small={true}
                                action={() => {
                                    console.log(pageCount);
                                    gotoPage(pageCount - 1);
                                }}
                            />

                        </div>
                    </div>
                </div>
        </div>
    );
};





const columns = [
    { Header: "firstName", accessor: "firstName" },
    {
        Header: "lastName", accessor: "lastName",
        resizable: true,
        minWidth: 100,
        maxWidth: 300
    },
    { Header: "company", accessor: "company" },
    { Header: "position", accessor: "position" },
    { Header: "user_position", accessor: "user_position" },
    { Header: "url", accessor: "url" }
]



const data = [
    { name: 'John', age: 25, country: 'USA' },
    { name: 'Alice', age: 30, country: 'Canada' },
    { name: 'Bob', age: 22, country: 'UK' },
];

const TrailDB = () => {
    const user=JSON.parse(localStorage.getItem("user"))
    let { loading, data } =  useAPI("/api/v1/emailVerifier/getAll","post",{ "url":"https://www.linkedin.com/sales/company/89796011?_ntb=sVXClZ1fddsfsdfQIi2pIN2R7%2Fgzw%3D%3D"
        ,"firstName":"muneer","lastName":"ahamed","company":"cloud","position":"assost","user":user.userId,"user_position":"3"} );
    const { clear, setClear } = usePage();
    const [getDataSecond, setGetDataSecond] = useState(false);

    const [getAllData, setGetData] = useState(true);
   


    const dispatch = useDispatch();






    if (getAllData) {
        if (loading) {
            return <Loader />
        }
        if (data ) {
            const arrKey=Object.keys(data);
            let newArray=[]
            arrKey.map((key)=>{
                newArray=[...newArray,...data[key]]
            })
            console.log(newArray);
       

            const headers = [   "company" ,
             "position" ,
              "user_position"
              ,"url"]



            return (
                <div>
                    <div className=" flex" style={{ justifyContent: "flex-end" }}>
                        {/* <div className=" flex" style={{ justifyContent: "flex-end", marginRight: "1rem" }}>
                            <Button
                                color='blue'
                                text='Fetch Data'
                                small={true}
                                action={() => {
                                    console.log("I am here");
                                    setGetDataSecond(true)
                                }}
                            />
                        </div> */}
                        <div style={{ marginBlock: "0.4rem" }}></div>
                        <div className=" flex" style={{ justifyContent: "flex-end", marginRight: "1rem" }}>
                            <Button
                                color='gray'
                                text='Clear Data'
                                btnStyle={{ color: "black" }}
                                small={true}
                                action={() => {
                                    setClear(!clear)
                                }}
                            />
                        </div>
                    </div>

                    <Table columns={columns} data={newArray} />;
                </div>
            )
        }
    }
    else {
        return (
            <div style={{ height: '85vh' }} >
                <div className="flex" style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Row title={"Click the below button for fetching setup audit trail backup"}>
                        <Button small text='Fetch Data'
                            btnStyle={{ margin: "auto" }}
                            action={() => {
                                setGetData(true)
                            }} />



                    </Row>
                </div>
            </div>
        )
    }


};

export default TrailDB;




function removeSuffix(obj) {
    // Get all keys of the object
    const keys = Object.keys(obj);

    // Map over the keys and create a new object with modified keys
    const newObj = keys.map(key => {
        // Remove the '__c' suffix from the key
        const newKey = key.replace(/__c$/, '');
        // Add the property to the new object with the modified key
        return { [newKey]: obj[key] };
    });

    // Merge all objects in the array into a single object
    return newObj.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}


function removeAndAddKeys(arrayOfObjects) {
    return arrayOfObjects.map(obj => {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const newKey = key.endsWith('__c') ? key.replace(/__c$/, '') : key;
                newObj[newKey] = obj[key];
            }
        }
        return { ...obj, ...newObj };
    });
}


function addActionsToArray(array, salesforceRecord, col, table) {
    return array.map(obj => ({
        ...obj,
        Links: {
            view: { url: `/${salesforceRecord}/details/${obj.Id}`, col: col, id: obj.Id, table: table }, // Adjust as needed
        }
    }));
}