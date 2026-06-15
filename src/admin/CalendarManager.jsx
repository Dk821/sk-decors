import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { subscribeToBookings, addBooking, updateBooking, deleteBooking } from '../services/bookingService';
import toast from 'react-hot-toast';
import { CalendarDays, ListChecks, Trash2, X } from 'lucide-react';

const defaultFormData = {
  id: null,
  customerName: '',
  phone: '',
  eventType: 'Wedding',
  location: '',
  message: '',
  status: 'tentative',
};

const statusColor = {
  booked: '#16A34A',
  tentative: '#F59E0B',
};

const statusClass = {
  booked: 'bg-green-50 text-green-700 border-green-200',
  tentative: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const today = new Date().toISOString().slice(0, 10);

const getOrderMessage = (booking) => {
  return booking.message || booking.note || booking.notes || booking.clientMessage || '';
};

const CalendarManager = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, []);

  const events = useMemo(
    () => bookings
      .filter((booking) => filter === 'all' || booking.status === filter)
      .map((booking) => ({
        id: booking.id,
        title: `${booking.customerName} - ${booking.status}`,
        date: booking.eventDate,
        color: statusColor[booking.status] || '#6B7280',
        extendedProps: { ...booking },
      })),
    [bookings, filter]
  );

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => booking.eventDate >= today).slice(0, 10),
    [bookings]
  );

  const openBookingForm = (date, booking = null) => {
    setSelectedDate(date);
    setFormData(booking ? { ...defaultFormData, ...booking } : defaultFormData);
    setIsModalOpen(true);
  };

  const handleDateClick = (arg) => {
    const existingBooking = bookings.find((booking) => booking.eventDate === arg.dateStr);
    openBookingForm(arg.dateStr, existingBooking);
  };

  const handleEventClick = (arg) => {
    openBookingForm(arg.event.startStr, arg.event.extendedProps);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const dataToSave = { ...formData, eventDate: selectedDate };
      delete dataToSave.id;

      if (formData.id) {
        await updateBooking(formData.id, dataToSave);
        toast.success('Order updated');
      } else {
        await addBooking(dataToSave);
        toast.success('Order added');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save order');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this order forever?')) {
      try {
        await deleteBooking(formData.id);
        toast.success('Order deleted');
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete order');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Order Calendar</h1>
          <p className="text-gray-500 mt-1">View booked dates, add new orders, and update customer details.</p>
        </div>
        <Link to="/admin/bookings" className="inline-flex items-center gap-2 bg-white text-dark border border-gray-200 px-4 py-2 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors">
          <ListChecks size={18} />
          Process Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
        <section className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600"></span> Booked</span>
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Tentative</span>
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="border px-3 py-2 rounded-lg outline-none">
              <option value="all">All Orders</option>
              <option value="booked">Booked Only</option>
              <option value="tentative">Tentative Only</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px] md:min-w-full">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height="auto"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth',
                }}
              />
            </div>
          </div>
        </section>

        <aside className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-dark">Upcoming Orders</h2>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No upcoming orders found.</p>
            ) : (
              upcomingBookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => openBookingForm(booking.eventDate, booking)}
                  className="w-full text-left border border-gray-100 rounded-lg p-3 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-dark">{booking.eventDate}</p>
                      <p className="text-sm text-gray-600">{booking.customerName}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.eventType}</p>
                      {getOrderMessage(booking) && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{getOrderMessage(booking)}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusClass[booking.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {booking.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-dark" aria-label="Close order form">
              <X size={22} />
            </button>

            <h3 className="text-2xl font-bold mb-2">{formData.id ? 'Edit Order' : 'Add Order'}</h3>
            <p className="text-gray-500 mb-5">Date: <span className="text-primary font-medium">{selectedDate}</span></p>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm mb-1">Customer Name</span>
                <input required type="text" value={formData.customerName} onChange={(event) => setFormData({ ...formData, customerName: event.target.value })} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Phone</span>
                <input required type="text" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Event Type</span>
                <input required type="text" value={formData.eventType} onChange={(event) => setFormData({ ...formData, eventType: event.target.value })} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Status</span>
                <select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="tentative">Tentative</option>
                  <option value="booked">Booked</option>
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm mb-1">Location</span>
                <input required type="text" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm mb-1">Message / Note</span>
                <textarea rows="3" value={formData.message || ''} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"></textarea>
              </label>

              <div className="md:col-span-2 pt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light hover:text-dark">Save Order</button>
                {formData.id && (
                  <button type="button" onClick={handleDelete} className="inline-flex items-center justify-center gap-2 flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600">
                    <Trash2 size={17} />
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;
