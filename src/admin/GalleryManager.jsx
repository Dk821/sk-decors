import React, { useState, useEffect } from 'react';
import { subscribeToGallery, uploadGalleryImage, deleteGalleryImage } from '../services/galleryService';
import { categories } from '../data/galleryData';
import toast from 'react-hot-toast';
import { FiTrash2, FiUploadCloud } from 'react-icons/fi';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wedding');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToGallery(setImages);
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    
    setUploading(true);
    const loadingToast = toast.loading('Uploading image...');
    try {
      await uploadGalleryImage(file, title, category);
      toast.success('Upload complete', { id: loadingToast });
      setFile(null);
      setTitle('');
      // Reset file input
      document.getElementById('file-upload').value = '';
    } catch (err) {
      console.error(err);
      toast.error('Upload failed', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, path) => {
    if (window.confirm('Delete this image forever?')) {
      const loading = toast.loading('Deleting...');
      try {
        await deleteGalleryImage(id, path);
        toast.success('Deleted', { id: loading });
      } catch (err) {
        toast.error('Delete failed', { id: loading });
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-dark mb-8">Gallery Management</h1>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Image</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-4 lg:col-span-1">
            <input 
              id="file-upload"
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Image Title" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
          <div>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <button 
              type="submit" 
              disabled={uploading}
              className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary-light hover:text-dark flex items-center justify-center gap-2"
            >
              <FiUploadCloud /> {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <div className="aspect-square">
              <img src={img.img} alt={img.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleDelete(img.id, img.storagePath)}
                  className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div>
                <p className="text-white text-sm font-bold truncate">{img.title}</p>
                <p className="text-primary-light text-xs">{img.category}</p>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="col-span-full text-gray-500 text-center py-8">No images uploaded yet.</p>}
      </div>
    </div>
  );
};

export default GalleryManager;
