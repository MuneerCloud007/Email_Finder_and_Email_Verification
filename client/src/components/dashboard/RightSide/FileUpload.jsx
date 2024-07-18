import React, { useState } from 'react';
import axios from '../../../utils/Proxy';
import * as XLSX from 'xlsx';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'text/csv')) {
            setSelectedFile(file);
            setErrorMessage(null);
        } else {
            setSelectedFile(null);
            setErrorMessage('Please upload a CSV or Excel (xlsx) file.');
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setErrorMessage(null);
    };

    const validateFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const headers = jsonData[0];

                const requiredColumns = ['firstName', 'lastName', 'website', 'domain'];
                const hasRequiredColumns = requiredColumns.some(col => headers.includes(col)) &&
                    headers.includes('firstName') &&
                    headers.includes('lastName') &&
                    (headers.includes('website') || headers.includes('domain'));

                if (!hasRequiredColumns) {
                    reject('The uploaded file must contain firstName, lastName, and either website or domain columns.');
                } else {
                    resolve();
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        try {
            await validateFile(selectedFile);
        } catch (error) {
            setErrorMessage(error);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);

        try {
            const user=JSON.parse(localStorage.getItem("user"));
        
        
        
            const user_Id=user["userId"];
            const response = await axios.post(`/api/v1/file/upload/${user_Id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob',
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'updatedFile.xlsx'); // or whatever you want the file name to be
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setErrorMessage(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrorMessage('Error uploading file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans w-full h-full flex items-center flex-col justify-center bg-gray-100 p-4">
            <label
                htmlFor="uploadFile1"
                className="bg-white text-gray-500 font-semibold text-base rounded-xl shadow-lg w-3/4 max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto hover:bg-gray-50 transition-colors duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
                    <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000"
                    />
                    <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000"
                    />
                </svg>
                Upload file
                <input
                    type="file"
                    id="uploadFile1"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".csv, .xlsx"
                />
                {selectedFile && (
                    <div className="flex items-center mt-2">
                        <p className="text-sm text-gray-700">{selectedFile.name}</p>
                        <button onClick={handleRemoveFile} className="ml-2 text-red-500 font-semibold">
                            X
                        </button>
                    </div>
                )}
                <p className="text-xs font-medium text-gray-400 mt-2">An Excel (xlsx) or CSV file.</p>
            </label>

            <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
            >
                {loading ? 'Uploading...' : 'Submit'}
            </button>
            {loading && <div className="loader mt-4"></div>}
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
    );
};

export default FileUpload;
