import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/AppLayout'
import BookingPage from './pages/BookingPage'
import DestinationsPage from './pages/DestinationsPage'
import GalleryPage from './pages/GalleryPage'
import HomePage from './pages/HomePage'
import ProfessionalsPage from './pages/ProfessionalsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="professionals" element={<ProfessionalsPage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
