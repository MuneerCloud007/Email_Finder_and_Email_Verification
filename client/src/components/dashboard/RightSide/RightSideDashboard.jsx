import TableClientSideBlog from "../../TableComponent";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllEmailVerifier } from "../../../features/slice/emailVerifier";
import { Grid, Input, Select } from 'react-spreadsheet-grid'
import ExcelGrid from "./ExcelGrid";
import { writeFile, utils } from 'xlsx';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";





function ReactJsClientSideTable() {
  const [dataMyTable, setdataMyTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();
  const [folder, setFolder] = useState();
  const [rowData, setRowData] = useState();

  const initailColumnDef = [

    {
      field: "firstName", editable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,

    },
    {
      field: "lastName"
    },
    {
      field: "company",
    },
    { field: "position", },
    { field: "website", },

    { field: "email", },
    {field:"certainty",},



  ]
  const [columnDefs, setColumnDefs] = useState(initailColumnDef);




  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const dispatch = useDispatch();
  const FolderData = useSelector((state) => state.emailVerifier.FolderData);
  const EmailVerifierData = useSelector((state) => state.emailVerifier.EmailVerifier);






  useEffect(() => {
    if (FolderData.data) {
      const user = JSON.parse(localStorage.getItem("user"));
      const data = FolderData.data.filter((vl) => vl.checked === true);
      console.log(data);

      localStorage.setItem("Folder", JSON.stringify(data[0]));
      setFolder(data[0]["_id"])
      setUser(user["userId"])
      onGridReady();


    }
  }, [FolderData.data]);

  const [customColumn, setCustomColumn] = useState();
  let dummyColumn = [];



  const onGridReady = useCallback((params) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = FolderData.data.filter((vl) => vl.checked === true);
    console.log("GRID READY !!!!");


    fetch('http://localhost:5000/api/v1/emailVerifier/getAll', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user["userId"],
        folder: data[0]["_id"]
      })
    })
      .then((resp) => {
        setColumnDefs(initailColumnDef);
        return resp.json()
      })
      .then((data) => {
        console.log("DATA")
        console.log(data);
        const arrKey = Object.keys(data["data"]);

        let newArray = []


        arrKey.map((key) => {
          newArray = [...newArray, data["data"][key]]
        })
        console.log("custom column!!!");


        dummyColumn = Object.keys(newArray[0]).filter((vl) => vl.startsWith("custom-column-"));

        dummyColumn = dummyColumn.map((vl) => {
          const data = {
            field: vl,
            headerName: vl.match(/^custom-column-(.*)$/)[1]
          }
          return data;

        })
        console.log("DUMMY COLUMN");
        console.log(dummyColumn);


        setColumnDefs([...columnDefs, ...dummyColumn]);
        console.log(newArray);
        setRowData(newArray);

      })
      .catch((err) => {
        console.log(err);
        setRowData([]);


      })


  }, [FolderData.data]);



  const convertToExcel = (data) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, 'data.xlsx');
  };

  if (FolderData.data && user && folder) {




    return (
      <div className="container py-3">


        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>Do You want to dowload it ?</DialogHeader>
          <DialogBody>
            It's contains data of the customer info
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={() => {
              convertToExcel(rowData);
              handleOpen();

            }}>
              <span>Download</span>
            </Button>
          </DialogFooter>
        </Dialog>




        <ExcelGrid
          onGridReady={onGridReady}
          user={user}
          folder={folder}
          rowData={rowData}
          handleOpen={handleOpen}
          setRowData={setRowData}
          dummyColumn={dummyColumn}
          customColumn={customColumn}
          columnDefs={columnDefs}
          setColumnDefs={setColumnDefs}
        />
      </div>

    )
  }
}

export default ReactJsClientSideTable