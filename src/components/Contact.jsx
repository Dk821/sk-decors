import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiX, FiCalendar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { subscribeToSettings, defaultSettings } from '../services/settingsService';
import { subscribeToBookings } from '../services/bookingService';
import { submitEnquiry } from '../services/enquiryService';
import toast from 'react-hot-toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Contact = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [events, setEvents] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    eventType: 'Wedding',
    location: '',
    eventDate: '',
    message: ''
  });

  useEffect(() => {
    const unsubSettings = subscribeToSettings(setSettings);
    const unsubBookings = subscribeToBookings((bookings) => {
      const calendarEvents = bookings.map(b => {
        let color = '#10B981'; // green
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
    return () => {
      unsubSettings();
      unsubBookings();
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateClick = (arg) => {
    const existingEvents = events.filter(e => e.date === arg.dateStr);
    const isBooked = existingEvents.some(e => e.extendedProps.status === 'booked');
    
    if (isBooked) {
      toast.error('This date is already fully booked.');
      return;
    }
    
    setFormData({ ...formData, eventDate: arg.dateStr });
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventDate) {
      toast.error('Please select an event date');
      return;
    }
    try {
      await submitEnquiry(formData);
      toast.success('Enquiry sent successfully!');
      setFormData({ customerName: '', phone: '', eventType: 'Wedding', location: '', eventDate: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send enquiry.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-12 h-[2px] bg-primary"></span>
            <span className="text-primary font-medium tracking-widest uppercase">Contact Us</span>
            <span className="w-12 h-[2px] bg-primary"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6">
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg">
            Reserve Your Special Day Before It's Gone. Submit an enquiry to check availability.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Contact Details */}
          <div className="lg:w-1/3 bg-dark text-white p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-3xl font-heading font-bold mb-8 text-primary relative z-10">Contact Info</h3>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <FiMapPin className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Address</h4>
                  <p className="text-gray-300 whitespace-pre-line">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiPhone className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone</h4>
                  <p className="text-gray-300 hover:text-white transition-colors">
                    <a href={`tel:${settings.phone1.replace(/\s/g, '')}`}>{settings.phone1}</a>
                  </p>
                  {settings.phone2 && (
                  <p className="text-gray-300 hover:text-white transition-colors">
                    <a href={`tel:${settings.phone2.replace(/\s/g, '')}`}>{settings.phone2}</a>
                  </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMail className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-gray-300 hover:text-white transition-colors break-all">
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700 relative z-10">
              <h4 className="font-bold text-lg mb-4">Chat With Us</h4>
              <a 
                href={`https://wa.me/${settings.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/20"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp Message
              </a>
            </div>

            {/* Background design elements */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          </div>

          {/* Booking Form Section */}
          <div className="lg:w-2/3 p-10 md:p-14 bg-white">
            <h3 className="text-3xl font-heading font-bold text-dark mb-8">Send an Enquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="customerName" required value={formData.customerName} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <div 
                    className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl cursor-pointer flex items-center justify-between hover:border-primary transition-colors"
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <span className={formData.eventDate ? "text-dark" : "text-gray-400"}>
                      {formData.eventDate ? formData.eventDate : "Select a date"}
                    </span>
                    <FiCalendar className="text-primary text-lg" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location / Venue</label>
                <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="City or Venue Name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea name="message" rows="4" value={formData.message} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="Tell us more about your event..."></textarea>
              </div>
              
              <button type="submit" className="w-full sm:w-auto px-10 bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary-light hover:text-dark transition-all shadow-lg shadow-primary/30">
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <div className="fixed inset-0 bg-dark/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-dark transition-colors bg-cream w-10 h-10 flex items-center justify-center rounded-full"
              >
                <FiX className="text-xl" />
              </button>
              
              <h3 className="text-3xl font-heading font-bold text-dark mb-6 text-center">Select Event Date</h3>
              
              <div className="flex justify-center gap-6 mb-8 text-sm font-medium bg-cream py-3 rounded-xl max-w-md mx-auto">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10B981]"></span> Available</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span> Tentative</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span> Booked</div>
              </div>
              
              <div className="calendar-container border border-gray-100 rounded-2xl p-4">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
