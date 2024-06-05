// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./component/Header";
import ClassList from "./component/teacherComponent/ClassList";
import ListStudent from "./component/teacherComponent/ListStudent";
import SidebarClass from "./component/teacherComponent/SidebarClass";
import AddStudentForm from "./component/teacherComponent/AddStudentForm";
import AddStudentFromExcel from "./component/teacherComponent/AddStudentFromExcel";
import AddClassForm from "./component/teacherComponent/AddClassForm";
import DiemDanh from "./component/teacherComponent/DiemDanh";
import DonVang from "./component/teacherComponent/DonVang";
import Home from "./component/Home";
import SignUpForm from "./component/authComponent/SignUpForm";
import LoginForm from "./component/authComponent/LoginForm";
import ToastMessage from './ToastMessage';

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <main>
      <SidebarClass />
      {children}
    </main>
  );
}

const isAuthenticated = () => {
  // Đây chỉ là ví dụ, bạn cần thay thế bằng cơ chế thực tế của ứng dụng
  return !!JSON.parse(localStorage.getItem('loginResponse'));
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
    return <Navigate to="/sign-in" />;
    
  } else return children;
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<LoginForm />} />
        <Route path="/" element={<Home />} />
        <Route path='/toast-message' element={<ToastMessage />} />
        <Route
          path="/class-list"
          element={
            <ProtectedRoute>
              <ClassList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-class/:id/list-student"
          element={
            <ProtectedRoute>
              <Layout>
                <ListStudent />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/detail-class/:id/add-form" element={<ProtectedRoute><AddStudentForm /></ProtectedRoute>} />
        <Route path="/detail-class/:id/edit-student/:id" element={<ProtectedRoute><AddStudentForm /></ProtectedRoute>} />
        <Route
          path="/detail-class/:id/add-from-excel"
          element={
            <ProtectedRoute>
              <Layout>
                <AddStudentFromExcel />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-class/:id/don-vang"
          element={
            <ProtectedRoute>
              <Layout>
                <DonVang />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-class/:id/attendances"
          element={
            <ProtectedRoute>
              <Layout>
                <DiemDanh />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/add-class-form" element={<ProtectedRoute><AddClassForm /></ProtectedRoute>} />
        <Route path="/edit-class-form/:id" element={<ProtectedRoute><AddClassForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;