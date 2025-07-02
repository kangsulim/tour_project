import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { LocationProvider } from "./context/LocationContext";
import AuthProvider from "./context/AuthProvider";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainpage/mainpage";
import PlanPage from "./pages/Tours/plan";
import ThreadList from './pages/Threads/ThreadList';       // 게시글 목록 페이지
import ThreadCreate from './pages/Threads/ThreadCreate';   // 게시글 작성 페이지
import ThreadDetail from './pages/Threads/ThreadDetail';   // 게시글 상세 및 수정 페이지
import MyPage from "./pages/Mypage/Mypage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() { //브랜치 확인

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
              <Route
                path="/thread"
                element={
                  <ProtectedRoute>
                    <ThreadList />
                  </ProtectedRoute>
                }
              />
              {/* 게시글 작성 페이지 */}
              <Route
                path="/thread/create"
                element={
                  <ProtectedRoute>
                    <ThreadCreate />
                  </ProtectedRoute>
                }
              />
              {/* 게시글 상세 및 수정 페이지 */}
              <Route
                path="/thread/:threadId"
                element={
                  <ProtectedRoute>
                    <ThreadDetail />
                  </ProtectedRoute>
                }
              />
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