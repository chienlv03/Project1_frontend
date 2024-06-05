// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListStudent = () => {
  const [students, setStudents] = useState([]);

  const classId = localStorage.getItem('classId');
  console.log("classId list student: "+ classId);

  const navigate = useNavigate()

  useEffect(() => {
    getAllStudent()
  }, []); // Chỉ gọi API một lần khi component được tạo


  const getAllStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/students/information/classroom/${classId}`, { withCredentials: true });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEditStudent = (student) => {
    localStorage.setItem('studentId', student.studentId);
    navigate(`/detail-class/${classId}/edit-student/${student.studentId}`, { state: { student } });
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteStudent = async (studentId) => {
    try {
        await axios.delete(`http://localhost:8080/api/students/delete/${studentId}/${classId}`, { withCredentials: true }); // Replace with your actual API endpoint
        setStudents(students.filter((student) => student.studentId !== studentId));
    } catch (error) {
        console.error('Error deleting class:', error);
    }
};

  return (
    <div className=' sm:ml-64'>
      <div className="mt-16 px-4 py-1">
      <div className="fixed top-12 mt-2 p-2 text-xl">
        <ul className="fixed pl-3 h-16 top-auto w-4/5 bg-gray-200 items-center rounded">
          <li>Tên Lớp: {students.length > 0 ? students[0].className : ''}</li>
          <li>
            Thời gian bắt đầu: {students.length > 0 ? students[0].startTime : ''}
          </li>
        </ul>
      </div>
        <table className="w-full mt-16 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                Mã sinh viên
              </th>
              <th scope="col" className="px-6 py-3">
                Họ Và Tên
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày sinh
              </th>
              <th scope="col" className="px-6 py-3">
                Giới tính
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </th>
                <td className="px-6 py-4">{student.studentCode}</td>
                <td className="px-6 py-4">{student.studentName}</td>
                <td className="px-6 py-4">{student.dob}</td>
                <td className="px-6 py-4">{student.gender}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="flex items-center px-6 py-4">
                  <button onClick={() => handleEditStudent(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Sửa</button>
                  <button onClick={() => handleDeleteStudent(student.studentId)} className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListStudent;


