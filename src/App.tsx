

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Home />} />
                {/* Default route redirects to Login for now */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
