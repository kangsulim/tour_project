import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { LocationProvider } from "./context/LocationContext";
import AuthProvider from "./context/AuthProvider";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainpage/mainpage";
import PlanPage from "./pages/Tours/Plan";
import ThreadPage from "./pages/Threads/ThreadList";
import MyPage from "./pages/Mypage/Mypage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {

  return (
    <div
      style={{
          margin: "0",
          padding: "0",
          width: "100%",
          minHeight: "100vh",
          height: "auto",
          position: "relative",
          overflow: "auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
      }}
    >
      <Router>
        <LocationProvider>
          <AuthProvider>
            <Header />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/plan" element={
                  <ProtectedRoute>
                    <PlanPage />
                  </ProtectedRoute>
                } />
                <Route path="/thread" element={<ThreadPage />} />
                <Route path="/mypage" element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                } />
              </Routes>
            <Footer />
          </AuthProvider>
        </LocationProvider>
      </Router>
    </div>
  );
}