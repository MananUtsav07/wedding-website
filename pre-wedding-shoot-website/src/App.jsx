import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/AppLayout'
import BookingPage from './pages/BookingPage'
import DestinationsPage from './pages/DestinationsPage'
import GalleryPage from './pages/GalleryPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyBookingsPage from './pages/MyBookingsPage'
import PhotographerProfilePage from './pages/PhotographerProfilePage'
import ProfessionalsPage from './pages/ProfessionalsPage'
import UserAccountPage from './pages/UserAccountPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="professionals" element={<ProfessionalsPage />} />
          <Route path="professionals/:professionalId" element={<PhotographerProfilePage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="account" element={<UserAccountPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
