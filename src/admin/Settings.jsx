import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingsService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    phone1: '',
    phone2: '',
    email: '',
    address: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then(data => {
      setFormData(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving settings...');
    try {
      await updateSettings(formData);
      toast.success('Settings saved', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings', { id: loadingToast });
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-dark mb-8">Site Settings</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label>
              <input type="text" name="phone1" value={formData.phone1} onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
              <input type="text" name="phone2" value={formData.phone2} onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (with country code)</label>
            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-light hover:text-dark transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
