import { Route, Routes } from "react-router";
import Signin from "./pages/Signin";
import Loans from "./pages/Admin/AdminDash";
import CreateDr from "./pages/Admin/CreateDr";
import Alldoctors from "./pages/Admin/Alldoctors";
import Patients from "./pages/Admin/Patients";
import UserLayout from "./pages/users/userLayout";
import Useralldoctors from "./pages/users/Useralldoctors";
import AppointmentBook from "./pages/users/Appoitmentbook";
import ViewPerception from "./pages/users/Viewperciption";
import Doctorlayout from "./pages/Doctor/Doctorlayout";
import ViewAppointment from "./pages/Doctor/Viewappoitment";
import WritePrescription from "./pages/Doctor/Writeperciption";
import AdminLayout from "./pages/Admin/AdminLayout";
import DoctorDash from "./pages/Doctor/DoctorDash";
import UserDash from "./pages/users/UserDash";
import UserProfile from "./pages/users/UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<Signin />} />
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDash />} />
        <Route path="Useralldoctors" element={<Useralldoctors />} />
        <Route path="Appoitmentbook" element={<AppointmentBook />} />
        <Route path="ViewPerception" element={<ViewPerception />} />
        <Route path="UserProfile" element={<UserProfile/>}/>
      </Route>

      <Route path="/doctor" element={<Doctorlayout />}>
      <Route index element={<DoctorDash />} />
        <Route path="ViewAppointment" element={<ViewAppointment />} />
        <Route path="Alldoctors" element={<Alldoctors />} />
        <Route path="WritePrescription" element={<WritePrescription />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Loans />} />
        <Route path="CreateDr" element={<CreateDr />} />
        <Route path="Alldoctors" element={<Alldoctors />} />
        <Route path="Patients" element={<Patients />} />
      </Route>
    </Routes>
  );
}

export default App;
