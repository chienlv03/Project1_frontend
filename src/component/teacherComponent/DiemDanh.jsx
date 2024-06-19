
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import ToastMessage from '../../ToastMessage';

// eslint-disable-next-line react/prop-types
const ToggleIcon = ({ isIconActive, toggleIcon }) => (
  <div className="items-center">
    {isIconActive ? (
      <svg
        className="h-6 w-6 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={toggleIcon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ) : (
      <svg
        className="h-6 w-6 text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={toggleIcon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )}
  </div>
);

const DiemDanh = () => {
  const [studentList, setStudentList] = useState([]);
  const [attendanceTimes, setAttendanceTimes] = useState([]);
  const [absences, setAbsences] = useState({});
  const [showToast, setShowToast] = useState(false);

  const classId = localStorage.getItem('classId');

  const handleAttendance = async () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      await axios.post(`http://localhost:8080/api/attendance/classroom/${classId}`, {
        attendanceTime: currentTime,
      });
      alert('Đã tạo điểm danh.');
      fetchStudents();
    } catch (error) {
      console.error('Error creating attendance records:', error);
      alert(error.response.data.message);
    }
  };

  const fetchStudents = async () => {
    try {
      const [attendanceTimesResponse, studentsResponse, absencesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/attendance/classroom/${classId}/times`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/students/classroom/${classId}`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/enrollments/classroom/${classId}/absences`, { withCredentials: true }),
      ]);

      setAttendanceTimes(attendanceTimesResponse.data);
      setStudentList(studentsResponse.data);

      const absencesMap = absencesResponse.data.reduce((acc, absence) => {
        acc[absence.studentId] = absence;
        return acc;
      }, {});
      setAbsences(absencesMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const updateAttendanceStatus = async (studentId, attendanceTime, isAbsent, isExcused) => {
    try {
      await axios.put(`http://localhost:8080/api/attendance/student/${studentId}/classroom/${classId}`, {
        attendanceTime,
        isAbsent,
        isExcused,
      }, { withCredentials: true });

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
      fetchStudents(); // Refresh data after update
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const toggleIcon = (studentId, attendanceTime, iconName) => {
    setStudentList((prevList) =>
      prevList.map((student) => {
        if (student.studentId === studentId) {
          const updatedAttendances = student.attendanceRecords.map((attendance) => {
            if (attendance.attendanceTime === attendanceTime) {
              let newIsAbsent = attendance.status === 'ABSENT_UNEXCUSED' || attendance.status === 'ABSENT_EXCUSED';
              let newIsExcused = attendance.status === 'ABSENT_EXCUSED';

              if (iconName === 'vangCoPhep') {
                if (newIsExcused) {
                  newIsExcused = false;
                  newIsAbsent = false;
                } else {
                  newIsExcused = true;
                  newIsAbsent = true;
                }
              } else if (iconName === 'vangKhongPhep') {
                if (newIsAbsent && !newIsExcused) {
                  newIsAbsent = false;
                } else {
                  newIsAbsent = true;
                  newIsExcused = false;
                }
              }

              updateAttendanceStatus(studentId, attendanceTime, newIsAbsent, newIsExcused);

              return {
                ...attendance,
                status: newIsExcused ? 'ABSENT_EXCUSED' : newIsAbsent ? 'ABSENT_UNEXCUSED' : 'PRESENT',
              };
            }
            return attendance;
          });

          return {
            ...student,
            attendanceRecords: updatedAttendances,
          };
        }
        return student;
      })
    );
  };

  return (
    <div className="py-4 sm:ml-64">
      <div className='fixed z-10 right-52'>{showToast && <ToastMessage />}</div>
      <div className="fixed top-12 ml-2 p-4 text-xl">
        <ul className="fixed pl-3 h-16 top-auto flex justify-between w-4/5 bg-gray-200 items-center rounded">
          <li>Tên Lớp: {studentList.length > 0 ? studentList[0].className : ''}</li>
          <li
            onClick={handleAttendance}
            className="focus:outline-none cursor-pointer text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Điểm Danh
          </li>
        </ul>
      </div>
      <div className="p-4 pt-16">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">STT</th>
              <th scope="col" className="px-6 py-3">Mã sinh viên</th>
              <th scope="col" className="px-6 py-3">Họ Và Tên</th>
              <th scope="col" className="px-6 py-3">Ngày sinh</th>
              <th scope="col" className="px-6 py-3">Email</th>
              {attendanceTimes.map((time, index) => (
                <th key={index} scope="col" className="w-6 text-center">{time}</th>
              ))}
              <th scope="col" className="px-6 py-3 text-center">Số lần vắng</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <tr key={student.studentId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </th>
                <td className="px-6 py-4">{student.studentCode}</td>
                <td className="px-6 py-4">{student.studentName}</td>
                <td className="px-6 py-4">{student.dob}</td>
                <td className="px-6 py-4">{student.email}</td>
                {attendanceTimes.map((time, index) => {
                  const attendance = student.attendanceRecords.find((a) => a.attendanceTime === time) || { status: 'PRESENT' };
                  const isExcused = attendance.status === 'ABSENT_EXCUSED';
                  const isAbsent = attendance.status === 'ABSENT_UNEXCUSED' || isExcused;

                  return (
                    <td key={index} className="px-6 py-4">
                      <div className="flex">
                        <ToggleIcon
                          isIconActive={isExcused}
                          toggleIcon={() => toggleIcon(student.studentId, time, 'vangCoPhep')}
                        />
                        <ToggleIcon
                          isIconActive={isAbsent && !isExcused}
                          toggleIcon={() => toggleIcon(student.studentId, time, 'vangKhongPhep')}
                        />
                      </div>
                    </td>
                  );
                })}
                <td className="text-center">{absences[student.studentId]?.unexcusedAbsenceCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiemDanh;
