import { Routes, Route, Navigate } from 'react-router-dom';

import { ShishyaDataProvider } from '@utils/shishyaDataProvider';

// Home Page
import HomePage from '@pages/HomePage';

// Shishyas pages
import AddShishya from '@pages/AddShishya';

// Other Pages
import NotFound from '@pages/NotFound';
import Upcoming from '@pages/Upcoming';

export default function ActivePage() {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
             
        {/* Shishyas routes */}
        <Route path="/shishyas/add" element={
          <ShishyaDataProvider>
            <AddShishya />
          </ShishyaDataProvider>
        } />
        <Route path="/shishyas/update" element={<Upcoming />} />
        
        {/* Events routes */}
        <Route path="/events/view" element={<Upcoming />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
}
