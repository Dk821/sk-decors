import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, galleryData as localGalleryData } from '../data/galleryData';
import { subscribeToGallery } from '../services/galleryService';

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const [galleryData, setGalleryData] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToGallery(setGalleryData);
    return () => unsubscribe();
  }, []);

  const visibleGalleryData = galleryData.length > 0 ? galleryData : localGalleryData;

  const filteredData = filter === 'All' 
    ? visibleGalleryData 
    : visibleGalleryData.filter(item => item.category === filter);

  return (
    <section id="gallery" className="py-24 bg-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-12 h-[2px] bg-primary"></span>
            <span className="text-primary font-medium tracking-widest uppercase">Our Gallery</span>
            <span className="w-12 h-[2px] bg-primary"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6">
            A Glimpse of Our Work
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-dark border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group overflow-hidden rounded-xl cursor-pointer shadow-md aspect-square"
                onClick={() => setSelectedImg(item.img)}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <p className="text-primary font-medium tracking-wider uppercase mb-2">{item.category}</p>
                  <h4 className="text-white text-2xl font-heading font-bold text-center">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12">
          <a 
            href="#contact" 
            className="inline-block px-8 py-4 bg-transparent border-2 border-primary text-primary font-medium uppercase tracking-wider rounded-full hover:bg-primary-light hover:text-dark hover:border-primary-light transition-colors"
          >
            Show All Images →
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/95 z-[60] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImg(null)}
          >
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImg} 
              alt="Enlarged" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            />
            <button 
              className="absolute top-6 right-6 text-white text-4xl hover:text-primary transition-colors"
              onClick={() => setSelectedImg(null)}
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
