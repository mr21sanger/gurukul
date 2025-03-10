import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NavigationBar from "./Components/NavigationBar";
import Footer from "./Components/Footer";
import Container from "./Components/Container";
import TutorPage from "./Pages/TutorPage";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import LoginPage from "./Pages/LoginPage";
import ParentDash from "./Pages/Parents/ParentsDash";
import SignupPage from "./Pages/SignupPage";
import TutorDash from "./Pages/Parents/TutorDash";
import VerificationPage from "./Pages/VeriFicationPage";
import AdminDash from "./Pages/Admin/AdminDash";
import ResetPassword from "./Components/ResetPassword";
import Error from "./Pages/Error";

function App() {
  const location = useLocation();

  // Hide Navbar & Footer for specific routes
  const hideLayout = [
    "/get-started/signup",
    "/get-started/login",
    "/reset-password",
    "/admin-dash",
    "*"
  ].includes(location.pathname) || location.pathname.startsWith("/verification/");

  return (
    <>
      {!hideLayout && <NavigationBar />}
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tutors" element={<TutorPage />} />
          <Route path="/About" element={<AboutUs />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/get-started/login" element={<LoginPage />} />
          <Route path="/get-started/signup" element={<SignupPage />} />
          <Route path="/parent-dash" element={<ParentDash />} />
          <Route path="/tutor-dash" element={<TutorDash />} />
          <Route path="/admin-dash" element={<AdminDash />} />
          <Route path="/verification/:id" element={<VerificationPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Container>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
