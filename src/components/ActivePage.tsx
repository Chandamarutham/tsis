import { Routes, Route, Navigate } from 'react-router-dom';
/* import { ProtectedRoute } from '@utils/protectedRoute'; */

import HomePage from '@pages/HomePage';
import AddShishya from '@pages/AddShishya';


export default function ActivePage() {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/shishyas/add" element={<AddShishya />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
    );
}
