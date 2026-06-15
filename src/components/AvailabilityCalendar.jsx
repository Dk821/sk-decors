import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { subscribeToBookings } from '../services/bookingService';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { submitEnquiry } from '../services/enquiryService';
import toast from 'react-hot-toast';

const AvailabilityCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    eventType: 'Wedding',
    location: '',
    message: ''
  });

  useEffect(() => {
    const unsubscribe = subscribeToBookings((bookings) => {
      const calendarEvents = bookings.map(b => {
        let color = '#10B981'; // green (default)
        if (b.status === 'booked') color = '#EF4444'; // red
        if (b.status === 'tentative') color = '#F59E0B'; // yellow

        return {
          id: b.id,
          title: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          date: b.eventDate,
          color,
          extendedProps: { status: b.status }
        };
      });
      setEvents(calendarEvents);
    });
    return () => unsubscribe();
  }, []);

  const handleDateClick = (arg) => {
    // Check if the date is already fully booked
    const existingEvents = events.filter(e => e.date === arg.dateStr);
    const isBooked = existingEvents.some(e => e.extendedProps.status === 'booked');
    
    if (isBooked) {
      toast.error('This date is already fully booked.');
      return;
    }
    
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitEnquiry({
        ...formData,
        eventDate: selectedDate
      });
      toast.success('Enquiry sent successfully!');
      setIsModalOpen(false);
      setFormData({ customerName: '', phone: '', eventType: 'Wedding', location: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send enquiry.');
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi, I am enquiring for availability on ${selectedDate}.\nName: ${formData.customerName}\nEvent: ${formData.eventType}\nLocation: ${formData.location}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/919360377726?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="availability" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-12 h-[2px] bg-primary"></span>
            <span className="text-primary font-medium tracking-widest uppercase">Availability</span>
            <span className="w-12 h-[2px] bg-primary"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6">
            Check Event Availability
          </h2>
          <p className="text-gray-600 text-lg">
            Reserve Your Special Day Before It's Gone. Click on an available date to submit a booking enquiry.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-cream p-4 md:p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex justify-center gap-6 mb-6 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10B981]"></span> Available</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span> Tentative</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span> Booked</div>
          </div>
          
          <div className="calendar-container overflow-x-auto">
            <div className="min-w-[800px]">
              <FullCalendar
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                height="auto"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-dark/60 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-dark transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
              
              <h3 className="text-3xl font-heading font-bold text-dark mb-2">Book Enquiry</h3>
              <p className="text-gray-500 mb-6 font-medium">Date: <span className="text-primary">{selectedDate}</span></p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="customerName" required value={formData.customerName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors">
                    <option>Wedding</option>
                    <option>Engagement</option>
                    <option>Birthday</option>
                    <option>Baby Shower</option>
                    <option>Puberty Ceremony</option>
                    <option>Reception</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" rows="3" value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"></textarea>
                </div>
                
                <div className="pt-4 flex flex-col gap-3">
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-light hover:text-dark transition-all">
                    Send Enquiry
                  </button>
                  <button type="button" onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-3 rounded-full font-medium hover:bg-[#128C7E] transition-all">
                    WhatsApp Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AvailabilityCalendar;
