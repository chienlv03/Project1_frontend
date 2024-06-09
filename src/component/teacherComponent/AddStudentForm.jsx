// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function parseDate(dateString) {
  const regex = /^(?:(\d{1,2})[\\/\\-](\d{1,2})[\\/\\-](\d{4})|(\d{4})[\\/\\-](\d{1,2})[\\/\\-](\d{1,2}))$/;
  const match = dateString.match(regex);
  if (!match) {
    throw new Error('Invalid date format');
  }
  const [, day1, month1, year1, year2, month2, day2] = match;
  const day = day1 || day2;
  const month = month1 || month2;
  const year = year1 || year2;
  return { day, month, year };
}

// Date format conversion function for saving date
const formatDateForSaving = (dateString) => {
  try {
    const { day, month, year } = parseDate(dateString);
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error(error); // Handle the error
    return null; // Or return a default value
  }
};

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    studentCode: '',
    studentName: '',
    dob: '',
    gender: '',
    email: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  const classId = localStorage.getItem('classId');
  const studentId = localStorage.getItem('studentId');

  // console.log("studentId at AddStudentForm: " + studentId);

  useEffect(() => {
    if (location.state?.student) {
      const { student } = location.state;
      setFormData({
        studentCode: student.studentCode,
        studentName: student.studentName,
        dob: student.dob,
        gender: student.gender,
        email: student.email
      });
    }
  }, [location.state]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = location.state?.student
        ? `http://localhost:8080/api/students/update/${studentId}`
        : `http://localhost:8080/api/students/create/${classId}`;
      
      const dataToSave = {
        ...formData,
        dob: formatDateForSaving(formData.dob)
      };
      
      await axios({
        method: location.state?.student ? 'put' : 'post',
        url,
        data: dataToSave,
        withCredentials: true
      });

      localStorage.removeItem('studentId');
      navigate(`/detail-class/${classId}/list-student`);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  return (
    <div className='h-screen'>
      <section className="py-16 bg-[url('assets/img/bg-3.jpg')] w-full h-screen bg-cover bg-center">
        <h2 className="mb-4 text-2xl text-center font-bold text-white">Thêm mới sinh viên</h2>
        <div className="p-4 mx-auto max-w-3xl border-4 border-gray-200 border-double rounded-lg dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2 mb-4">
                <label htmlFor="studentCode" className="block mb-2 text-base font-medium text-gray-200">Mã số sinh viên</label>
                <input
                  type="text"
                  name="studentCode"
                  id="studentCode"
                  value={formData.studentCode}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:text-black"
                  placeholder="Nhập mã số sinh viên"
                  required
                />
              </div>
              <div className="sm:col-span-2 mb-4">
                <label htmlFor="studentName" className="block mb-2 text-base font-medium text-gray-200">Họ và tên</label>
                <input
                  type="text"
                  name="studentName"
                  id="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:text-black"
                  placeholder="Nhập tên sinh viên"
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-4 w-full mb-4'>
                <div className="w-full">
                  <label htmlFor="dob" className="block mb-2 text-base font-medium text-white">Ngày sinh</label>
                  <input
                    type="text"
                    name="dob"
                    id="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:text-black"
                    placeholder="dd/MM/yyyy"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block mb-2 text-base font-medium text-white">Giới tính</label>
                  <select
                    id="gender"
                    name='gender'
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:text-black"
                  >
                    <option value="">Chọn....</option>
                    <option value="nam">Nam</option>
                    <option value="nữ">Nữ</option>
                    <option value="khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2 mb-4">
                <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-100">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:text-black"
                  placeholder="Nhập email sinh viên"
                  required
                />
              </div>
            </div>
            <div className='flex justify-end'>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => navigate(`/detail-class/${classId}/list-student`)}
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddStudentForm;
