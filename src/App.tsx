

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Auth/Login';

import { Home } from './pages/Home';

function App() {
    return (
        <BrowserRouter>
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
