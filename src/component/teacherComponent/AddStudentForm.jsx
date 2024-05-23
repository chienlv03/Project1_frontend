import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

// eslint-disable-next-line react/display-name
const AddStudentForm = React.memo(() => {
  const { id } = useParams();
  console.log("student id: " + id);

  const [formData, setFormData] = useState({
    studentCode: '',
    name: '',
    dob: '',
    gender: '',
    email: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  
  const numberRegex = /\d+/;
    const match = location.pathname.match(numberRegex);
    const classId = match ? parseInt(match[0]) : null;
    console.log("classId: " + classId)

  useEffect(() => {
    if (location.state && location.state.student) {
      const { student } = location.state;
      setFormData({
        studentCode: student.studentCode,
        name: student.name,
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

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (location.state && location.state.student) {
        await axios.put(`http://localhost:8081/students/update/${id}`, formData);
      } else {
        console.log("Submitting form data:", formData);
        await axios.post(`http://localhost:8081/students/create/${classId}`, formData);
      }
      navigate(`/detail-class/${classId}/list-student`);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.data) {
        console.error('Server response:', error.response.data);
      }
    }
  }, [location.state, navigate, classId, id, formData]);

  return (
    <div className='h-screen'>
      <section className="py-16 bg-[url('assets/img/bg-3.jpg')] w-[full] h-screen bg-cover bg-center">
        <h2 className="mb-4 text-2xl text-center font-bold text-white dark:text-white">Thêm mới sinh viên</h2>
        <div className="p-4 mx-auto max-w-3xl border-4 border-gray-200 border-double rounded-lg dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2 mb-4">
                <label htmlFor="studentCode" className="block mb-2 text-base font-medium text-gray-200">Mã số sinh viên</label>
                <input type="text" name="studentCode" id="studentCode" value={formData.studentCode} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-white dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập mã số sinh viên" required />
              </div>
              <div className="sm:col-span-2 mb-4">
                <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-200">Họ và tên</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập tên sinh viên" required />
              </div>
              <div className='grid grid-cols-2 gap-4 w-full mb-4'>
                <div className="w-full">
                  <label htmlFor="dob" className="block mb-2 text-base font-medium text-white">Ngày sinh</label>
                  <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
                </div>
                <div>
                  <label htmlFor="gender" className="block mb-2 text-base font-medium text-white">Giới tính</label>
                  <select id="gender" name='gender' value={formData.gender} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option value="">Chọn....</option>
                    <option value="nam">Nam</option>
                    <option value="nữ">Nữ</option>
                    <option value="khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2 mb-4">
                <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-100">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Nhập email sinh viên" required />
              </div>
            </div>
            <div className='flex justify-end'>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
              <button type="button" onClick={() => navigate(`/detail-class/${classId}/list-student`)} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Cancel</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
});

export default AddStudentForm;
