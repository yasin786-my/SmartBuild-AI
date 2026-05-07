import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import HistoryPage from "@/pages/HistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import Sidebar from "@/components/layout/Sidebar";
import AnimatedBg from "@/components/layout/AnimatedBg";

/** Protected route wrapper — redirects to /login if unauthenticated. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const token = useStore((s) => s.token);

  return (
    <>
      <AnimatedBg />
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar only visible when authenticated */}
        {token && <Sidebar />}

        <main className={`flex-1 ${token ? "lg:ml-64" : ""}`}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
