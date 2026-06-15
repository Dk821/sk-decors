import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToBookings, deleteBooking, updateBooking } from '../services/bookingService';
import toast from 'react-hot-toast';
import { Calendar, Edit2, Search, Trash2, X } from 'lucide-react';

const initialEditData = {
  id: null,
  customerName: '',
  phone: '',
  eventDate: '',
  eventType: '',
  location: '',
  message: '',
  status: 'tentative',
};

const statusClass = {
  booked: 'bg-green-50 text-green-700 border-green-200',
  tentative: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  available: 'bg-gray-50 text-gray-700 border-gray-200',
};

const getOrderMessage = (booking) => {
  return booking.message || booking.note || booking.notes || booking.clientMessage || '';
};

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(initialEditData);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => setBookings(data));
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this order forever?')) {
      await deleteBooking(id);
      toast.success('Order deleted');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateBooking(id, { status: newStatus });
    toast.success('Status updated');
  };

  const openEdit = (booking) => {
    setEditData({ ...initialEditData, ...booking });
    setIsEditOpen(true);
  };

  const handleEditChange = (event) => {
    setEditData({ ...editData, [event.target.name]: event.target.value });
  };

  const handleEditSave = async (event) => {
    event.preventDefault();
    const { id, ...dataToSave } = editData;

    try {
      await updateBooking(id, dataToSave);
      toast.success('Order updated');
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Could not update order');
    }
  };

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      if (filter !== 'all' && booking.status !== filter) return false;
      if (!searchText) return true;

      return [
        booking.customerName,
        booking.phone,
        booking.eventDate,
        booking.eventType,
        booking.location,
        getOrderMessage(booking),
      ].some((value) => String(value || '').toLowerCase().includes(searchText));
    });
  }, [bookings, filter, search]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Process Orders</h1>
          <p className="text-gray-500 mt-1">Search, edit, confirm, or remove event orders.</p>
        </div>
        <Link to="/admin/calendar" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light hover:text-dark transition-colors">
          <Calendar size={18} />
          View Calendar
        </Link>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, date, event, location, or note..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="border pl-10 pr-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="border px-3 py-2 rounded-lg outline-none"
          >
            <option value="all">All Status</option>
            <option value="tentative">Tentative</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 min-w-[240px]">Message / Note</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-dark">{booking.customerName}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${booking.phone}`} className="hover:text-primary">{booking.phone}</a>
                  </td>
                  <td className="px-4 py-3 font-medium">{booking.eventDate}</td>
                  <td className="px-4 py-3">{booking.eventType}</td>
                  <td className="px-4 py-3">{booking.location || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-gray-700 whitespace-pre-line">
                      {getOrderMessage(booking) || 'No message added'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full outline-none border ${statusClass[booking.status] || statusClass.available}`}
                    >
                      <option value="tentative">Tentative</option>
                      <option value="booked">Booked</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(booking)} className="text-gray-500 hover:text-primary p-2" aria-label="Edit order">
                        <Edit2 size={17} />
                      </button>
                      <button onClick={() => handleDelete(booking.id)} className="text-red-500 hover:text-red-700 p-2" aria-label="Delete order">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="8" className="text-center py-8">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-dark/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-dark" aria-label="Close edit order">
              <X size={22} />
            </button>

            <h3 className="text-2xl font-bold text-dark mb-5">Edit Order</h3>
            <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm mb-1">Customer Name</span>
                <input required name="customerName" value={editData.customerName} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Phone</span>
                <input required name="phone" value={editData.phone} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Event Date</span>
                <input required type="date" name="eventDate" value={editData.eventDate} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Event Type</span>
                <input required name="eventType" value={editData.eventType} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm mb-1">Location</span>
                <input required name="location" value={editData.location} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm mb-1">Message / Note</span>
                <textarea name="message" rows="3" value={editData.message || ''} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"></textarea>
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm mb-1">Status</span>
                <select name="status" value={editData.status} onChange={handleEditChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="tentative">Tentative</option>
                  <option value="booked">Booked</option>
                </select>
              </label>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-dark">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light hover:text-dark">Save Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
