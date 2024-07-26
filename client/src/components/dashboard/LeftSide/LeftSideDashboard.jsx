import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolderSlice, NewFolderSlice, updateFolderSlice, deleteFolderSlice } from "../../../features/slice/emailVerifier";
import { Plus, Atom, Brush, Wrench,Mail } from 'lucide-react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "./Left.css";
import {renameFolderSlice} from "../../../features/slice/emailVerifier";

export default function SidebarOne({ RightSideState, setRightSideState }) {

    const [visible, setVisible] = useState(false);
    const { loading, data, error } = useSelector((state) => state.emailVerifier.FolderData);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [editFolder, setEditFolder] = useState(false);
    const editHandleOpen = () => setEditFolder(!editFolder);
    console.log("Right side state ---->");
    console.log(RightSideState);


    useEffect(() => {
        console.log("USERS:");
        console.log(user);
        dispatch(getAllFolderSlice({ url: `/api/v1/folder/getAll/${user["userId"]}`, method: "get" }))


    }, [])

    if (loading) {
        return (
            <aside className="flex h-screen w-64 flex-col border-r bg-white px-5 py-8">
                <Skeleton width={40} height={46} />
                <div className="mt-6 flex flex-1 flex-col justify-between">
                    <nav className="-mx-3 space-y-6">
                        <div className="space-y-3">
                            <Skeleton height={20} width="80%" />
                            <Skeleton count={4} height={40} />
                        </div>
                        <div className="space-y-3">
                            <Skeleton height={20} width="80%" />
                            <Skeleton count={4} height={40} />
                        </div>
                        <div className="space-y-3">
                            <Skeleton height={20} width="80%" />
                            <Skeleton count={4} height={40} />
                        </div>
                    </nav>
                </div>
            </aside>
        );
    }
    if (data) {
        return (
            <aside className="flex h-screen w-64 flex-col border-r bg-white px-5 py-8">
                <a href="#">
                    <svg
                        width="40"
                        height="46"
                        viewBox="0 0 50 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                            fill="black"
                        />
                    </svg>
                </a>
                <div className="mt-6 flex flex-1 flex-col justify-between">
                    <nav className="-mx-3 space-y-6">
                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                                Folder Structure
                            </label>
                            <a
                                className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                                href="#"
                                onClick={handleOpen}
                            >
                                <label
                                    className=" btn rounded-md border bg-slate-50 border-green-600 px-3 py-2 text-sm font-semibold text-green-600 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 flex hover:bg-green-600 hover:text-white bg-white"
                                >
                                    <Plus className="h-5 w-5" aria-hidden="true" />
                                    New Folder
                                </label>
                            </a>
                            <ResponsiveDemo open={open} handleOpen={handleOpen} />
                        </div>
                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                                Your Folders
                            </label>
                            {data && data.map((vl) => {
                                const { FolderName, _id, checked } = vl;
                                return (
                                    <div
                                        key={_id}
                                        className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700
                                          menu-bar
                                          ${checked && RightSideState === 1 ? "bg-blue-600 text-white" : ""}
                                        `}
                                    >
                                        <Menu placement="right-end">
                                            <Atom className="h-5 w-5" aria-hidden="true" />
                                            <span
                                                className="mx-2 text-sm font-medium cursor-pointer"
                                                onClick={() => {
                                                    if (RightSideState !== 1) setRightSideState(1);
                                                    const Folder = JSON.parse(localStorage.getItem("Folder"));
                                                    if (_id !== Folder["_id"]) {
                                                        dispatch(updateFolderSlice({
                                                            url: "/api/v1/folder/updateById",
                                                            method: "put",
                                                            data: {
                                                                newFolder: _id,
                                                                currentFolder: Folder["_id"]
                                                            }
                                                        }));
                                                    }
                                                }}
                                            >
                                                {FolderName}
                                            </span>
                                            <div className="dots dropdown dropdown-right ml-auto">
                                                <MenuHandler tabIndex={0}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                                        <path fill="currentColor" d="M10.001 7.8a2.2 2.2 0 1 0 0 4.402A2.2 2.2 0 0 0 10 7.8zm0-2.6A2.2 2.2 0 1 0 9.999.8a2.2 2.2 0 0 0 .002 4.4m0 9.6a2.2 2.2 0 1 0 0 4.402a2.2 2.2 0 0 0 0-4.402" />
                                                    </svg>
                                                </MenuHandler>
                                                <MenuList>
                                                    <MenuItem onClick={editHandleOpen}>Edit</MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            if (checked) {
                                                                alert("Current Folder is active !!!");
                                                            } else {
                                                                dispatch(deleteFolderSlice({
                                                                    url: `/api/v1/folder/delete/${_id}`,
                                                                    method: "delete",
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                </MenuList>
                                            </div>
                                        </Menu>
                                        <EditBtn editHandleOpen={editHandleOpen} editOpen={editFolder} data={{id:_id,data:FolderName}} />

                                    </div>
                                );
                            })}
                        </div>
                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                                Bulk Xls
                            </label>
                            <a
                                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 ${RightSideState === 2 ? "bg-blue-600 text-white" : ""}`}
                                href="#"
                                onClick={() => setRightSideState(2)}
                            >
                                <Mail className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2 text-sm font-medium">Email Finder</span>
                            </a>
                            <a
                                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 ${RightSideState === 3 ? "bg-blue-600 text-white" : ""}`}
                                onClick={() => setRightSideState(3)}
                            >
                                <Mail className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2 text-sm font-medium">Email Verifier</span>
                            </a>
                            <a
                                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 ${RightSideState === 4 ? "bg-blue-600 text-white" : ""}`}
                                onClick={() => setRightSideState(4)}
                            >
                                <Mail className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2 text-sm font-medium">Domain Finder</span>
                            </a>
                        </div>
                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                                Customization
                            </label>
                            <a
                                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 ${RightSideState === 5 ? "bg-blue-600 text-white" : ""}`}
                                onClick={() => setRightSideState(5)}
                            >
                                <Brush className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2 text-sm font-medium">Themes</span>
                            </a>
                            <a
                                className={`flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 ${RightSideState === 6 ? "bg-blue-600 text-white" : ""}`}
                                onClick={() => setRightSideState(6)}
                            >
                                <Wrench className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2 text-sm font-medium">Setting</span>
                            </a>
                        </div>
                    </nav>
                </div>
            </aside>
        );
    }
}

function EditBtn({ editOpen, editHandleOpen, data }) {
    const {id}=data;
    const [value, setValue] = useState({foldername:data.data });
    const user = JSON.parse(localStorage.getItem("user"));
    const dispatch = useDispatch();

  

    console.log(value.foldername);

    return (
        <div className="card flex justify-content-center">
            <Dialog open={editOpen} handler={editHandleOpen}>
                <DialogHeader>Do you want to Edit Folder Name?</DialogHeader>
                <DialogBody>
                    <Input
                        label='Edit Folder Name'
                        value={value.foldername}
                        onChange={(e) => setValue({ ...value, foldername: e.target.value })}
                    />
                    <br />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={()=>{
                        setValue({foldername:data.data});
                        editHandleOpen()}} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={() => {
                        const userId = user.userId;
                        if(value.foldername.length>0){
                        dispatch(renameFolderSlice({
                            url: `/api/v1/folder/rename/${id}`,
                            method: "put",
                            data: {name:value.foldername}
                          
                        }));
                        setValue({foldername:data.data});


                    }

                        editHandleOpen();
                    }}>
                        <span>Save</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

function ResponsiveDemo({ open, handleOpen }) {
    const [value, setValue] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const dispatch = useDispatch();

    return (
        <div className="card flex justify-content-center">
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Do you want to create a New Folder?</DialogHeader>
                <DialogBody>
                    <Input
                        label='Folder Name'
                        value={value.foldername}
                        onChange={(e) => setValue({ ...value, foldername: e.target.value })}
                    />
                    <br />
                    <Input label='Purpose of Folder' />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={() => {
                        const userId = user.userId;
                        dispatch(NewFolderSlice({
                            url: "/api/v1/folder/create",
                            method: "post",
                            data: {
                                foldername: value.foldername,
                                user: userId
                            }
                        }));
                        handleOpen();
                    }}>
                        <span>Save</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
