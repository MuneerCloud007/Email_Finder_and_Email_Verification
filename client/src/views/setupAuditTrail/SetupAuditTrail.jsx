import { useDispatch, useSelector } from "react-redux";
import { Table, Loader, Paginate, Row, Card, Button, useAPI, TitleRow } from "components/lib";
import { useEffect, useState } from "react";
import { getAllSetupAuditSlice } from "../../feature/SetupAuditTrail/slice/SetupAuditTrail";
import { usePagination } from "../../contextApi/PaginationContext";

function SetupAuditTrailTable() {
    let { loading, setupAuditTrail: data } = useSelector((state) => state.setupAuditTrail);
    const { loading: loading2, data: createdUser } = useAPI(`/api/setupAudit/getAll/createdUser`, "post", {
        instance_url: `${localStorage.getItem("instance_url")}`,
        access_token: `${JSON.parse(localStorage.getItem("user")).token}`
    });
    const dispatch = useDispatch();
    const { offset, setOffset,clear,setClear } = usePagination()
    const [value,setValue]=useState();

    const [getData, setGetData] = useState(false);
    const [getDataSecond, setGetDataSecond] = useState(false);
    const [createdUserData, setCreatedUserData] = useState(createdUser);
    let tableData = null;
    const [arrLength, setArrLength] = useState(null);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    console.log("I am in SetupAudit Table " + offset);



    useEffect(() => {
        if (getData && !data) {
            dispatch(getAllSetupAuditSlice({
                url: `/api/setupAudit/getAll`,
                method: 'post'
            }));

            if (createdUser && !createdUserData) {
                setCreatedUserData(createdUser)
            }
            localStorage.setItem("sorted_Date",false);


        }


    }, [getData, createdUser])

    useEffect(() => {
        if (getDataSecond) {
            dispatch(getAllSetupAuditSlice({
                url: `/api/setupAudit/getAll`,
                method: 'post'
            }));
            setGetDataSecond(false);

        }
    }, [getDataSecond])









    if (getData) {

        if (loading) {
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



            //Id,CreatedDate,CreatedById,ResponsibleNamespacePrefix,Action,Section,DelegateUser

            tableData = {
                header: [

                    { name: "CreatedDate", title: "Date", sort: true },
                    { name: 'CreatedById', title: 'User', sort: true },
                    { name: "ResponsibleNamespacePrefix", title: "ResponsibleNamespacePrefix", sort: true },
                    { name: 'Display', title: 'Action', sort: true },
                    { name: "Section", title: "Section", sort: true },
                    { name: "DelegateUser", title: "Delegated", sort: true },




                ],
                body: newArray
            }

            return (
                <div className="wrapper" style={{ padding: "1rem" }}>
                    <div className=" flex" style={{justifyContent:"flex-end"}}>
                    <div className=" flex" style={{ justifyContent: "flex-end", marginRight: "1rem" }}>
                        <Button
                            color='blue'
                            text='Fetch Data'
                            small={true}
                            action={() => {
                                setGetDataSecond(true)
                            }}
                        />
                    </div>
                    <div style={{marginBlock:"0.4rem"}}></div>
                    <div className=" flex" style={{ justifyContent: "flex-end", marginRight: "1rem" }}>
                        <Button
                            color='gray'
                            text='Clear Data'
                            btnStyle={{color:"black"}}
                            small={true}
                            action={() => {
                                console.log("I have to clear");
                                setClear(!clear);
                            }}
                        />
                    </div>
                    </div>



                    <div className="salestable">


                        <Table
                            search={true}
                            data={tableData}
                            naked={true}
                            show={headers}
                            table={"setupAuditTrail"}
                            apiData={data.records}
                            loading={loading}
                            unsorted={true}
                            paginate={true}
                            value={value}
                            setValue={setValue}
                            arrayData={newArray}
                            arrLength={arrLength}
                            offset={offset}
                            setOffset={setOffset}
                            setArrLength={setArrLength}
                            page={page}
                            setPage={setPage}

                        />
                        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>

                            <Paginate
                                offset={offset}
                                limit={10}
                                total={(!arrLength) ? newArray?.length : arrLength?.length}
                                onChange={os => setOffset(os)}
                                page={page}
                                setPage={setPage}
                                
                                
                            />
                        </div>


                    </div>
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
                            btnStyle={{margin:"auto"}}
                            action={() => {
                                setGetData(true)
                            }} />



                    </Row>
                </div>
            </div>
        )
    }




}


export const PaginateComp = ({ arrLength, newArray, offset, setOffset }) => {
    return (
        <Paginate
            offset={offset}
            limit={10}
            total={(!arrLength) ? newArray?.length : arrLength?.length}
            onChange={os => setOffset(os)}
        />
    )
}


export default SetupAuditTrailTable;













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