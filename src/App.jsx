import Header from "./component/Header";
import ClassList from "./component/teacherComponent/ClassList";
import ListStudent from "./component/teacherComponent/ListStudent";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarClass from "./component/teacherComponent/SidebarClass";
import AddStudentForm from "./component/teacherComponent/AddStudentForm";
import AddStudentFromExcel from "./component/teacherComponent/AddStudentFromExcel";
import AddClassForm from "./component/teacherComponent/AddClassForm";
import DiemDanh from "./component/teacherComponent/DiemDanh";
import DonVang from "./component/teacherComponent/DonVang";
import Home from "./component/Home";
import SignUpForm from "./component/authComponent/SignUpForm";
import LoginForm from "./component/authComponent/LoginForm";
import ToastMessage from "./ToastMessage";

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <main>
      <SidebarClass />
      {children}
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<LoginForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/class-list" element={<ClassList />} />
        <Route path="/detail-class/:id/list-student" element={<Layout> <ListStudent /> </Layout>} />
        <Route path="/detail-class/:id/add-form" element={<AddStudentForm /> }/>
        <Route path="/detail-class/:id/edit-student/:id" element={ <AddStudentForm /> }/>
        <Route path="/detail-class/:id/add-from-excel" element={<Layout> <AddStudentFromExcel /> </Layout>} />
        <Route path="/detail-class/:id/don-vang" element={<Layout> <DonVang /> </Layout>} />
        <Route path="/detail-class/:id/attendances" element={<Layout> <DiemDanh /> </Layout>} />
        <Route path="/add-class-form" element={<AddClassForm />} />
        <Route path="/edit-class-form/:id" element={<AddClassForm />} />
        <Route path="/toast-message" element={<ToastMessage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
