import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./ProtectedRoutes.jsx";  // asegúrate que la ruta esté correcta

function App() {  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>  
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />  
          <Route path="/" element={<HomePage />} />
          
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
