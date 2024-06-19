import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React from 'react';
import "./TrailDB.css"



import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Search, Button,Row} from 'components/lib';
import { getAllSetupAuditSlice } from 'feature/SetupAuditTrail/slice/SetupAuditTrail';
import { useAPI } from 'components/lib';
import { usePagination as usePage } from 'contextApi/PaginationContext';
import "./TrailDB.css"
import Style from "../../components/paginate/paginate.tailwind";
import upward from "../../../public/assets/icons/arrow-up.svg"
import downward from "../../../public/assets/icons/arrow-down.svg"
function Table({data}) {
    const[dummyData,setDummyData]=useState(data);
    const {clear,setClear}=usePage();
  return (
    <div className='wrapper-table'>
      <div className="p-d-flex p-jc-between p-ai-center" style={{ marginBottom: '1rem' }}>
    
    <Search callback={(term)=>{
      let rowsToShow = [];
      console.log(term);


      data.forEach(row => {
        for (let cell in row) {
          if (row[cell]?.toString().toLowerCase().includes(term.trim().toLowerCase())) {
  
            if (!rowsToShow.includes(row))
              rowsToShow.push(row);
  
          }
        }
      })
      console.log(rowsToShow)

      setDummyData(rowsToShow);

     
  
     

    }}/>      
  </div>

  <div className='inner-wrapper-table'>
<DataTable value={dummyData} tableStyle={{ minWidth: '50rem' }}   paginator rows={10}  showGridlines

  sortField="CreatedDate" // Set the default sort field to "CreatedDate"
      sortOrder={-1}
      emptyMessage="No customers found."
>

    <Column field="CreatedDate" header="Date" sortable style={{ width: '25%' }}></Column>
    <Column field="CreatedById" header="User" sortable style={{ width: '25%' }}></Column>
    <Column field="ResponsibleNamespacePrefix" header="ResponsibleNamespacePrefix" sortable style={{ width: '25%' }}></Column>
    <Column field="Display" header="Action" sortable style={{ width: '25%' }}></Column>
    <Column field="Section" header="Section" sortable style={{ width: '25%' }}></Column>
    <Column field="DelegateUser" header="Delegated" sortable style={{ width: '25%' }}></Column>

</DataTable> 
</div>
</div> )
}





const PrimeTable = () => {
    let { loading, setupAuditTrail: data } = useSelector((state) => state.setupAuditTrail);
    const {clear,setClear}=usePage();
    const [getDataSecond, setGetDataSecond] = useState(false);

    const[getAllData,setGetData]=useState(false);
    useEffect(() => {
        if (getDataSecond) {
            dispatch(getAllSetupAuditSlice({
                url: `/api/setupAudit/getAll`,
                method: 'post'
            }));
            setGetDataSecond(false);
    
        }
    }, [getDataSecond])


    const { loading: loading2, data: createdUser } = useAPI(`/api/setupAudit/getAll/createdUser`, "post", {
        instance_url: `${localStorage.getItem("instance_url")}`,
        access_token: `${JSON.parse(localStorage.getItem("user")).token}`
    });
    const dispatch = useDispatch();



    useEffect(() => {
        if(getAllData) {

        dispatch(getAllSetupAuditSlice({
            url: `/api/setupAudit/getAll`,
            method: 'post'
        }));
    }

        // if (createdUser && !createdUserData) {
        //     setCreatedUserData(createdUser)
        // }
        // localStorage.setItem("sorted_Date", false);





    }, [dispatch,getAllData])

    if(getAllData) {
    if (loading ) {
        return <Loader />
    }
    if (data && createdUser) {
        let newArray = data.records.map(({ attributes, ...rest }) => rest);
        const idMap = new Map(createdUser.records.map(obj => [obj.Id, obj]));


        let headers = removeSuffix(newArray[0]);
        for (let i = 0; i < newArray.length; i++) {
            newArray[i]["CreatedById"] = idMap.get(newArray[i]["CreatedById"])?.Username ? idMap.get(newArray[i]["CreatedById"])?.Username : ""

            newArray[i] = removeSuffix(newArray[i]);

        }
        newArray = addActionsToArray(newArray, "setupAuditTrail", "Name", "setupAuditTrail");
        delete headers["Id"];

        headers = Object.keys(headers);


        return (
            <div>
                <div className=" flex" style={{ justifyContent: "flex-end" }}>
                    <div className=" flex" style={{ justifyContent: "flex-end", marginRight: "1rem" }}>
                        <Button
                            color='blue'
                            text='Fetch Data'
                            small={true}
                            action={() => {
                                console.log("I am here");
                                setGetDataSecond(true)
                            }}
                        />
                    </div>
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

                <Table  data={newArray} />;
            </div>
        )
    }
} 
else{
    return(
    <div style={{ height: '85vh' }} >
    <div className="flex" style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Row title={"Click the below button for fetching setup audit trail backup"}>
                <Button small text='Fetch Data' 
                btnStyle={{margin:"auto"}}
                action={() => {
                    setGetData(true)
                }} />



        </Row>
    </div>
</div>
    )
}


};





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

export default PrimeTable