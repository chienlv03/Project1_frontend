// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';

const DonVang = () => {
  const [students, setStudents] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Gọi API để lấy danh sách sinh viên từ cơ sở dữ liệu
    const dataFromDatabase = [
      {
        id: 1,
        mssv: "1000",
        name: "Le Hoang Bao Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "sdvsvsvsssssssssssssssssssssscccccccccccccccccccc"
      },
      {
        id: 2,
        mssv: "1000",
        name: "Le Van Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "bị ốm",
      },
      {
        id: 3,
        mssv: "1000",
        name: "Le Van Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "bị ốm",
      },
      {
        id: 4,
        mssv: "1000",
        name: "Le Van Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "bị ốm",
      },
      {
        id: 5,
        mssv: "1000",
        name: "Le Van Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "bị ốm",
      },
      {
        id: 6,
        mssv: "1000",
        name: "Le Van Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "bị ốm",
      },
      {
        id: 7,
        mssv: "1000",
        name: "Le Van Nam",
        timeSend: "12:20:30 10/10/2000",
        reason: "bị ốm",
      },
    ]

    setStudents(dataFromDatabase)
  }, [id]); // Gọi lại API khi id thay đổi

  const handleRemove = async (studentId) => {
    try {
      await axios.delete(`/api/students/${id}/don-vang/${studentId}`);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Error removing student:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className='py-4 sm:ml-64'>
      <div className="p-4 mt-12">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                Thời gian gửi
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="pl-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </th>
                <td className="px-6 py-4">{student.mssv}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.timeSend}</td>
                <td className="flex items-center px-6 py-4">
                  <button onClick={() => handleRemove(student.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonVang;
