import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// eslint-disable-next-line react/display-name
const AddClassForm = React.memo(() => {
    const [formData, setFormData] = useState({
        name: '',
        classCode: '',
        startTime: '',
        capacity: ''
    });

    const navigate = useNavigate();
    const location = useLocation();
    const numberRegex = /\d+/;
    const match = location.pathname.match(numberRegex);
    const idClass = match ? parseInt(match[0]) : null;
    console.log("idClass: " + idClass)

    useEffect(() => {
        if (location.state && location.state.class) {
            const { class: selectedClass } = location.state;
            setFormData({
                name: selectedClass.name,
                classCode: selectedClass.classCode,
                startTime: selectedClass.startTime,
                capacity: selectedClass.capacity
            });
        }
    }, [location.state]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting form data:", formData);
            if (idClass) {
                await axios.put(`http://localhost:8081/classrooms/update/${idClass}`, formData);
            } else {
                await axios.post('http://localhost:8081/classrooms/create', formData);
            }
            navigate('/class-list');
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
        }
    }, [formData, idClass, navigate]);

    return (
        <div className="p-4 content-center h-screen sm:ml-0 bg-[url('assets/img/bg-3.webp')] w-full bg-cover bg-center">
            <form className="mt-20 p-6 content-center max-w-3xl m-auto border-4 border-gray-200 border-double rounded-lg dark:border-gray-700" onSubmit={handleSubmit}>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="classCode"
                        id="classCode"
                        value={formData.classCode}
                        onChange={handleInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="classCode" className="peer-focus:font-medium absolute text-sm text-gray-900 dark:text-gray-800 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mã lớp học</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-800 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tên Lớp</label>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="startTime" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Thời gian bắt đầu học</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="capacity"
                            id="capacity"
                            min="0"
                            max="100"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="capacity" className="peer-focus:font-medium absolute text-sm text-gray-900 dark:text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Số lượng sinh viên</label>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" onClick={handleSubmit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                    <button type="button" onClick={() => navigate('/class-list')} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Cancel</button>
                </div>
            </form>
        </div>
    );
});

export default AddClassForm;
