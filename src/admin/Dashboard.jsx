import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, updateBooking } from '../services/bookingService';
import { getEnquiries } from '../services/enquiryService';
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  ListChecks,
  Phone,
  PlusCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const today = new Date().toISOString().slice(0, 10);

const statusClass = {
  booked: 'bg-green-50 text-green-700 border-green-200',
  tentative: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  available: 'bg-gray-50 text-gray-700 border-gray-200',
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-dark">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, booked: 0, tentative: 0, pendingEnquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    Promise.all([getBookings(), getEnquiries()])
      .then(([bookingData, enquiries]) => {
        if (!isActive) return;

        setBookings(bookingData);
        setStats({
          totalBookings: bookingData.length,
          booked: bookingData.filter((b) => b.status === 'booked').length,
          tentative: bookingData.filter((b) => b.status === 'tentative').length,
          pendingEnquiries: enquiries.filter((e) => e.status === 'pending').length,
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Could not load dashboard');
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const pendingOrders = useMemo(
    () => bookings.filter((b) => b.status === 'tentative').slice(0, 6),
    [bookings]
  );

  const upcomingOrders = useMemo(
    () => bookings.filter((b) => b.eventDate >= today).slice(0, 8),
    [bookings]
  );

  const handleStatusChange = async (id, status) => {
    try {
      await updateBooking(id, { status });
      setBookings((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
      toast.success('Order status updated');
    } catch (error) {
      console.error(error);
      toast.error('Could not update order');
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Process event orders and review booked dates from one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/calendar" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light hover:text-dark transition-colors">
            <PlusCircle size={18} />
            Add Order
          </Link>
          <Link to="/admin/bookings" className="inline-flex items-center gap-2 bg-white text-dark border border-gray-200 px-4 py-2 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors">
            <ListChecks size={18} />
            Process Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Orders" value={stats.totalBookings} icon={ClipboardList} colorClass="bg-blue-500" />
        <StatCard title="Confirmed" value={stats.booked} icon={CheckCircle} colorClass="bg-green-500" />
        <StatCard title="Need Process" value={stats.tentative} icon={Clock} colorClass="bg-yellow-500" />
        <Link to="/admin/enquiries">
          <StatCard title="New Enquiries" value={stats.pendingEnquiries} icon={Calendar} colorClass="bg-red-500" />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] gap-6">
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-dark">Orders To Process</h2>
            <Link to="/admin/bookings" className="text-sm font-medium text-primary hover:text-dark">View all</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8">Loading orders...</td></tr>
                ) : pendingOrders.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8">No tentative orders waiting.</td></tr>
                ) : (
                  pendingOrders.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-dark">{booking.customerName}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${booking.phone}`} className="inline-flex items-center gap-2 hover:text-primary">
                          <Phone size={14} />
                          {booking.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-medium">{booking.eventDate}</td>
                      <td className="px-4 py-3">{booking.eventType}</td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-dark">Upcoming Calendar</h2>
            <Link to="/admin/calendar" className="text-sm font-medium text-primary hover:text-dark">Open calendar</Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 py-6 text-center">Loading dates...</p>
            ) : upcomingOrders.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No upcoming orders found.</p>
            ) : (
              upcomingOrders.map((booking) => (
                <div key={booking.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-dark">{booking.eventDate}</p>
                      <p className="text-sm text-gray-600">{booking.customerName} - {booking.eventType}</p>
                      {booking.location && <p className="text-xs text-gray-500 mt-1">{booking.location}</p>}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusClass[booking.status] || statusClass.available}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
