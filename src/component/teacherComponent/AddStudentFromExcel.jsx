// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spiner from '../../Spiner';

const AddStudentFromExcel = () => {
  const [loading, setLoading] = useState(false);

  const classId = localStorage.getItem('classId');

  const navigator = useNavigate();
  const [fileNames, setFileNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const names = [];
    let isExceedSize = false;
    let isInvalidFile = false;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.size > 1024 * 1024 * 20) {
        isExceedSize = true;
        break;
      }
      if (
        file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type !== 'application/vnd.ms-excel'
      ) {
        isInvalidFile = true;
        break;
      }
      names.push(file);
    }
    if (isExceedSize) {
      setErrorMessage('File size exceeds 20MB limit');
    } else if (isInvalidFile) {
      setErrorMessage('Vui lòng chọn file Excel.');
    } else {
      setFileNames([...fileNames, ...names]);
      setErrorMessage('');
    }
  };

  const removeFile = (fileNameToRemove) => {
    const updatedFileNames = fileNames.filter((file) => file.name !== fileNameToRemove);
    setFileNames(updatedFileNames);
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      if (fileNames.length === 0) {
        setLoading(false);
        setErrorMessage('Bạn chưa chọn file.');
        return;
      }
      const formData = new FormData();
      for (const file of fileNames) {
        formData.append('file', file);
      }
      await axios.post(`http://localhost:8080/api/excel/upload/classroom/${classId}`, formData, { withCredentials: true }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTimeout(() => {
        setLoading(false); // Set loading state to false after 1 second
      }, 1000);
      // Chuyển hướng hoặc hiển thị thông báo thành công
      navigator(`/detail-class/${classId}/list-student`);
    } catch (error) {
      setLoading(false);
      // Xử lý lỗi nếu có
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div className='py-4 sm:ml-64'>
      {loading && <Spiner />}
      <section className="py-20 mt-16">
        <h2 className="mb-4 text-2xl text-center font-bold text-gray-900 dark:text-black">Thêm sinh viên từ file excel</h2>
      <div className="p-4 mx-auto max-w-3xl">
          <form action="#">
            <div className="w-full mb-5">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center py-9 w-full border bg-gray-400 rounded-2xl cursor-pointer">
                <div className="mb-3 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-700" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M7 18a4.6 4.4 0 0 1 0 -9h0a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                    <polyline points="9 15 12 12 15 15" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                  </svg>
                </div>
                <h2 className="text-center text-gray-900 text-xs font-normal leading-4 mb-1">XLSX, smaller than 20MB</h2>
                <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">Drag and Drop your file here or</h4>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
              </label>
            </div>
            {fileNames.length > 0 && (
              <div className="w-full grid gap-1 mb-4">
                {fileNames.map((file, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-8 w-8 text-gray-700" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        <line x1="9" y1="7" x2="10" y2="7" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                        <line x1="13" y1="17" x2="15" y2="17" />
                      </svg>
                      <div className="grid gap-1">
                        <h4 className="text-gray-900 text-sm font-normal font-['Inter'] leading-snug">{file.name}</h4>
                        <h5 className="text-gray-400 text-xs font-normal font-['Inter'] leading-[18px]">{(file.size / 1024).toFixed(2)} KB</h5>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-gray-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={() => removeFile(file.name)}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ))}
              </div>
            )}

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <div className='flex justify-end'>
              <a href="public/students.xlsx" download className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Download template excel</a>
              <button type="button" onClick={handleUpload} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Upload</button>
              <button type="button" onClick={() => navigator(`/detail-class/${classId}/list-student`)} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Cancel</button>
            </div>
          </form>
        </div>
      </section>
    </div >
  );
};

export default AddStudentFromExcel;
