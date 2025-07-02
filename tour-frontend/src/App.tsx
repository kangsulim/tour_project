import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { LocationProvider } from "./context/LocationContext";
import AuthProvider from "./context/AuthProvider";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainpage/mainpage";
import Tour from "./pages/Tours/Tours";
import ThreadList from './pages/Threads/ThreadList';
import ThreadCreate from './pages/Threads/ThreadCreate';
import ThreadDetail from './pages/Threads/ThreadDetail';
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
            
            {/* 메인 컨텐츠 영역 - 남은 공간을 모두 차지 */}
            <main style={{ 
              flex: "1 0 auto", // flex-grow: 1, flex-shrink: 0, flex-basis: auto
              display: "flex",
              flexDirection: "column"
            }}>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/plan" element={
                  <ProtectedRoute>
                    <Tour />
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
                <Route
                  path="/thread/create"
                  element={
                    <ProtectedRoute>
                      <ThreadCreate />
                    </ProtectedRoute>
                  }
                />
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
            </main>
            
            {/* Footer - 항상 하단에 위치 */}
            <Footer />
          </AuthProvider>
        </LocationProvider>
      </Router>
    </div>
  );
}