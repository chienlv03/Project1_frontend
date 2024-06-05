import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/classrooms/";

export const createClass = (classroom, teacherId) => axios.post(REST_API_BASE_URL + 'create' + teacherId, classroom);

export const updateClass = (classroom, classId) => axios.put(REST_API_BASE_URL + 'update' + classId, classroom);

export const getClassByUserId = (userId) => axios.get(REST_API_BASE_URL + 'get/' + userId);

export const deleteClass = (classId) => axios.delete(REST_API_BASE_URL + 'delete/' + classId)