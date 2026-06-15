import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin Pages (to be implemented)
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import CalendarManager from './admin/CalendarManager';
import BookingManager from './admin/BookingManager';
import EnquiryManager from './admin/EnquiryManager';

const PublicSite = () => (
  <div className="w-full min-h-screen">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="enquiries" element={<EnquiryManager />} />
          <Route path="calendar" element={<CalendarManager />} />
          <Route path="bookings" element={<BookingManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
