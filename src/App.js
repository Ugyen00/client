import "antd/dist/antd";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ItemPage from './pages/ItemPage';
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import Mail from "./pages/Mail";
import BillsPage from "./pages/BillsPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <ItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/reset/" element={<Reset />} />
          <Route path="/sendmail" element={<Mail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem('auth')) {
    return children
  } else {
    return <Navigate to='/login' />
  }
}
