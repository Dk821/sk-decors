import { useEffect, useMemo, useState } from 'react';
import { addBooking } from '../services/bookingService';
import { deleteEnquiry, subscribeToEnquiries, updateEnquiryStatus } from '../services/enquiryService';
import toast from 'react-hot-toast';
import { CheckCircle, Search, Trash2 } from 'lucide-react';

const statusClass = {
  pending: 'bg-red-50 text-red-700 border-red-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-50 text-gray-700 border-gray-200',
};

const getEnquiryMessage = (enquiry) => {
  return enquiry.message || enquiry.note || enquiry.notes || enquiry.clientMessage || '';
};

const EnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToEnquiries(setEnquiries);
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      if (filter !== 'all' && enquiry.status !== filter) return false;
      if (!searchText) return true;

      return [
        enquiry.customerName,
        enquiry.phone,
        enquiry.eventDate,
        enquiry.eventType,
        enquiry.location,
        getEnquiryMessage(enquiry),
      ].some((value) => String(value || '').toLowerCase().includes(searchText));
    });
  }, [enquiries, filter, search]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);
      toast.success('Enquiry status updated');
    } catch (error) {
      console.error(error);
      toast.error('Could not update enquiry');
    }
  };

  const handleConvertToOrder = async (enquiry) => {
    if (!enquiry.eventDate) {
      toast.error('Event date is required before converting');
      return;
    }

    setProcessingId(enquiry.id);
    try {
      await addBooking({
        customerName: enquiry.customerName || '',
        phone: enquiry.phone || '',
        eventDate: enquiry.eventDate,
        eventType: enquiry.eventType || 'Event',
        location: enquiry.location || '',
        status: 'tentative',
        message: getEnquiryMessage(enquiry),
        enquiryId: enquiry.id,
      });
      await updateEnquiryStatus(enquiry.id, 'converted');
      toast.success('Enquiry converted to order');
    } catch (error) {
      console.error(error);
      toast.error('Could not convert enquiry');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this enquiry forever?')) {
      await deleteEnquiry(id);
      toast.success('Enquiry deleted');
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">New Enquiries</h1>
          <p className="text-gray-500 mt-1">View customer enquiries and convert confirmed requests into orders.</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <label className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, date, event, location, or message..."
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
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
            <option value="all">All Enquiries</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Event Details</th>
                <th className="px-4 py-3 min-w-[280px]">Message / Note</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enquiry) => (
                <tr key={enquiry.id} className="border-t border-gray-100 hover:bg-gray-50 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark">{enquiry.customerName || '-'}</p>
                    <p className="mt-1">
                      {enquiry.phone ? <a href={`tel:${enquiry.phone}`} className="hover:text-primary">{enquiry.phone}</a> : '-'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark">{enquiry.eventDate || '-'}</p>
                    <p className="mt-1">{enquiry.eventType || '-'}</p>
                    <p className="mt-1 text-xs text-gray-500">{enquiry.location || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-gray-700 whitespace-pre-line">
                      {getEnquiryMessage(enquiry) || 'No message added'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={enquiry.status || 'pending'}
                      onChange={(event) => handleStatusChange(enquiry.id, event.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full outline-none border ${statusClass[enquiry.status] || statusClass.pending}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleConvertToOrder(enquiry)}
                        disabled={processingId === enquiry.id || enquiry.status === 'converted'}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-light hover:text-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={15} />
                        {processingId === enquiry.id ? 'Converting' : 'Convert'}
                      </button>
                      <button onClick={() => handleDelete(enquiry.id)} className="text-red-500 hover:text-red-700 p-2" aria-label="Delete enquiry">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8">No enquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiryManager;
