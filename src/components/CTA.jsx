import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-primary text-white">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          rotate: [360, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-dark opacity-10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
            Ready to Make Your Event <br className="hidden md:block" /> Memorable?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 font-heading italic mb-12 max-w-2xl mx-auto">
            Contact us today to discuss your vision and let us bring it to life with our expert decoration services.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="tel:+919360377726" 
              className="px-8 py-4 bg-dark text-white font-medium uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors w-full sm:w-auto shadow-xl"
            >
              Call Now
            </a>
            <a 
              href="https://wa.me/919360377726" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-primary font-medium uppercase tracking-wider rounded-full hover:bg-gray-100 transition-colors w-full sm:w-auto shadow-xl"
            >
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
