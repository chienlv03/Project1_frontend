import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const ToggleIcon = ({ isIconActive, toggleIcon }) => (
  <div className="items-center" onClick={toggleIcon}>
    {isIconActive ? (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  </div>
);

const DiemDanh = () => {
  const [studentList, setStudentList] = useState([]);
  const [attendanceTimes, setAttendanceTimes] = useState([]);
  const [absences, setAbsences] = useState({});
  const { id } = useParams();

  const handleAttendance = async () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      await axios.post(`http://localhost:8081/api/attendance/classroom/${id}`, { attendanceTime: currentTime });
      alert('Attendance records created successfully.');
      fetchStudents();
    } catch (error) {
      console.error('Error creating attendance records:', error);
      alert('Failed to create attendance records.');
    }
  };

  const fetchStudents = useCallback(async () => {
    try {
      const [attendanceTimeResponse, studentResponse, absencesResponse] = await Promise.all([
        axios.get(`http://localhost:8081/api/attendance/classroom/${id}/times`),
        axios.get(`http://localhost:8081/students/classroom/${id}`),
        axios.get(`http://localhost:8081/enrollments/classroom/${id}/absences`)
      ]);

      const attendanceTimes = attendanceTimeResponse.data;
      const studentList = studentResponse.data;
      const absencesData = absencesResponse.data.reduce((acc, absence) => {
        acc[absence.studentId] = absence;
        return acc;
      }, {});

      setStudentList(studentList);
      setAttendanceTimes(attendanceTimes);
      setAbsences(absencesData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updateAttendanceStatus = async (studentId, attendanceTime, isAbsent, isExcused) => {
    try {
      await axios.put(`http://localhost:8081/api/attendance/student/${studentId}/classroom/${id}`, {
        attendanceTime,
        isAbsent,
        isExcused
      });
      fetchStudents();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const toggleIcon = useCallback((studentId, attendanceTime, iconName) => {
    setStudentList(prevList =>
      prevList.map(student => {
        if (student.studentId === studentId) {
          const updatedAttendances = student.attendanceRecords.map(attendance => {
            if (attendance.attendanceTime === attendanceTime) {
              let newIsAbsent = attendance.isAbsent;
              let newIsExcused = attendance.isExcused;

              if (iconName === 'vangCoPhep') {
                if (attendance.isExcused) {
                  newIsExcused = false;
                  newIsAbsent = false;
                } else {
                  newIsExcused = true;
                  newIsAbsent = true;
                }
              } else if (iconName === 'vangKhongPhep') {
                if (attendance.isAbsent && !attendance.isExcused) {
                  newIsAbsent = false;
                } else {
                  newIsAbsent = true;
                  newIsExcused = false;
                }
              }

              updateAttendanceStatus(studentId, attendanceTime, newIsAbsent, newIsExcused);

              return { ...attendance, isExcused: newIsExcused, isAbsent: newIsAbsent };
            }
            return attendance;
          });

          return { ...student, attendanceRecords: updatedAttendances };
        }
        return student;
      })
    );
  }, [updateAttendanceStatus]);

  return (
    <div className='py-4 sm:ml-64'>
      <div className='fixed top-11 ml-2 p-4 text-xl'>
        <ul className='fixed pl-3 h-16 top-auto flex justify-between w-4/5 bg-gray-200 items-center rounded'>
          <li>Tên Lớp: {studentList.length > 0 ? studentList[0].className : ''}</li>
          <li
            onClick={handleAttendance}
            className='focus:outline-none cursor-pointer text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
          >
            Điểm Danh
          </li>
        </ul>
      </div>
      <div className='p-4 pt-20'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope="col" className="px-6 py-3">STT</th>
              <th scope="col" className="px-6 py-3">Mã sinh viên</th>
              <th scope="col" className="px-6 py-3">Họ Và Tên</th>
              <th scope="col" className="px-6 py-3">Ngày sinh</th>
              <th scope="col" className="px-6 py-3">Email</th>
              {attendanceTimes.map((attendanceTime, index) => (
                <th key={index} scope='col' className='w-6 text-center'>{attendanceTime}</th>
              ))}
              <th scope="col" className="px-6 py-3 text-center">Số lần vắng</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <tr key={student.studentId} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</th>
                <td className="px-6 py-4">{student.studentCode}</td>
                <td className="px-6 py-4">{student.studentName}</td>
                <td className="px-6 py-4">{student.dob}</td>
                <td className="px-6 py-4">{student.email}</td>
                {attendanceTimes.map((attendanceTime, idx) => {
                  const attendance = student.attendanceRecords.find(a => a.attendanceTime === attendanceTime) || {};
                  const isAbsent = attendance.isAbsent ?? (attendance.status !== 'PRESENT');
                  const isExcused = attendance.isExcused ?? (attendance.status === 'ABSENT_EXCUSED');
                  return (
                    <td key={idx} className='px-6 py-4'>
                      <div className='flex'>
                        <ToggleIcon
                          isIconActive={isExcused}
                          toggleIcon={() => toggleIcon(student.studentId, attendanceTime, 'vangCoPhep')}
                        />
                        <ToggleIcon
                          isIconActive={isAbsent && !isExcused}
                          toggleIcon={() => toggleIcon(student.studentId, attendanceTime, 'vangKhongPhep')}
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
