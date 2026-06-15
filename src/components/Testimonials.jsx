import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Priya',
    review: 'Beautiful wedding decoration and professional service. The team was so easy to work with and brought our vision to life perfectly!',
    rating: 5
  },
  {
    id: 2,
    name: 'Karthik',
    review: 'Excellent work and affordable pricing. They decorated my sister\'s reception and everyone loved it. Highly recommended!',
    rating: 5
  },
  {
    id: 3,
    name: 'Divya',
    review: 'Our event looked amazing. They took care of every small detail. Thank you SK Decor for making our day so special.',
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="w-12 h-[2px] bg-primary"></span>
          <span className="text-primary font-medium tracking-widest uppercase">Testimonials</span>
          <span className="w-12 h-[2px] bg-primary"></span>
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-16">
          What Our Clients Say
        </h2>

        <div className="max-w-4xl mx-auto relative px-8 md:px-16">
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center text-dark hover:text-primary transition-colors border border-gray-100"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
          </div>

          <div className="overflow-hidden py-4">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-cream p-10 md:p-14 rounded-3xl relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-primary opacity-20 font-heading leading-none">
                  "
                </div>

                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <span key={i} className="text-primary text-xl mx-1">★</span>
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-gray-700 font-heading italic mb-8 leading-relaxed">
                  "{testimonials[currentIndex].review}"
                </p>
                
                <h4 className="text-lg font-bold text-dark uppercase tracking-widest">
                  — {testimonials[currentIndex].name}
                </h4>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center text-dark hover:text-primary transition-colors border border-gray-100"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
