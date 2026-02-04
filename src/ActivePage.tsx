/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@utils/protected-route';


// Home Page
import Home from '../Pages/Home/home';

// Authentication Pages
import SignIn from '../Auth/sign-in';
import ResetPassword from '../Auth/reset-password';
import ChangePassword from '../Auth/change-pwd-form';
import SignOut from '../Auth/sign-out';

// Shishyas pages
import AddShishya from '../Pages/Shishyas/Add/add-shishya';
import UpdateShishya from '../Pages/Shishyas/Update/update-shishya';
import ViewShishya from '../Pages/Shishyas/View/view-shishya';
import NotifyShishya from '../Pages/Shishyas/Notify/notify-shishya';

// Events pages
import AddEvent from '../Pages/Events/Add/add-event';
// @ts-expect-error - TS6133 
import ViewEvent from '../Pages/Events/View/view-event';
import EventReminder from '../Pages/Events/Reminder/event-reminder';

// Other Pages
import NotFound from '../Pages/NotFound/not-found';
import Upcoming from '../Pages/Upcoming/upcoming';

export default function ActivePage() {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
             
        {/* Shishyas routes */}
        <Route path="/shishyas/add" element={<AddShishya />} />
        <Route path="/shishyas/update" element={<UpdateShishya />} />
        <Route path="/shishyas/view" element={<ProtectedRoute><ViewShishya /></ProtectedRoute>} />
        <Route path="/shishyas/notify" element={<ProtectedRoute><NotifyShishya /></ProtectedRoute>} />
        
        {/* Events routes */}
        <Route path="/events/add" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
        <Route path="/events/view" element={<Upcoming />} />
        <Route path="/events/reminder" element={<ProtectedRoute><EventReminder /></ProtectedRoute>} />
        
        {/* Profile routes */}
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/signout" element={<ProtectedRoute><SignOut /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
}
