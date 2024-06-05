// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassList = () => {
    const [classList, setClassList] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassList = async () => {
            const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
            const userId = loginResponse?.data.id;
            console.log("userId: "+ userId);
            try {
                const response = await axios.get(`http://localhost:8080/api/classrooms/get/${userId}`, { withCredentials: true });
                setClassList(response.data);
            } catch (error) {
                setError(error);
            } 
        };

        fetchClassList();
    }, []);

    const handleClassClick = (classItem) => {
        localStorage.setItem('classId', classItem.id);
        navigate(`/detail-class/${classItem.id}/list-student`);
    };

    const handleEditClass = (classItem) => {
        localStorage.setItem('classId', classItem.id);
        navigate(`/edit-class-form/${classItem.id}`, { state: { class: classItem } });
    };

    const handleDeleteClass = async (classId) => {
        try {
            await axios.delete(`http://localhost:8080/api/classrooms/remove/${classId}`, { withCredentials: true });
            setClassList(classList.filter((classItem) => classItem.id !== classId));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    if (error) {
        return <div>Error loading class list: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <div className="mt-16">
                <button
                    onClick={() => navigate('/add-class-form')}
                    type="button"
                    className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                    hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg 
                    shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    mb-4 ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                    </svg>
                    Tạo lớp
                </button>
            </div>
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {classList.map((classItem) => (
                        <div key={classItem.id} className="relative h-44 p-2 rounded bg-gray-50 dark:bg-blue-200">
                            <ul onClick={() => handleClassClick(classItem)} className="h-full w-full cursor-pointer">
                                <li className="text-2xl w-64 line-clamp-1">Tên Lớp: {classItem.name}</li>
                                <li className="text-lg">Mã lớp: {classItem.classCode}</li>
                                <li className="text-lg">Thời gian bắt đầu: {classItem.startTime}</li>
                                {/* <li className="text-lg">Số lượng: {classItem.capacity}</li> */}
                            </ul>
                            <ul className="absolute z-20 my-2 h-10 flex right-0 top-0 bg-blue-300">
                                <li onClick={() => handleEditClass(classItem)} className="cursor-pointer py-1 px-2 h-10 border-r-2">
                                    <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M9 7h-3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" />
                                        <path d="M9 15h3l8.5-8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                        <line x1="16" y1="5" x2="19" y2="8" />
                                    </svg>
                                </li>
                                <li onClick={() => handleDeleteClass(classItem.id)} className="cursor-pointer p-1 h-10">
                                    <svg className="h-6 w-6 mx-1 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 01 16.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassList;
