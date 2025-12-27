

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';
import { NewGame } from './pages/Game/NewGame';
import { NewResult } from './pages/Result/NewResult';
import { PrivateRoute } from './components/auth/PrivateRoute';

import { Groups } from './pages/Groups';
import { Profile } from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/new-game" element={<NewGame />} />
                    <Route path="/new-result" element={<NewResult />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Default route redirects to Login for now */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
