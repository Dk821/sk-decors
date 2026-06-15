import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../assets/heropic.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url(${heroImg})`,
        }}
      >
        <div className="absolute inset-0 bg-dark/40"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary font-medium tracking-[0.2em] uppercase mb-4"
        >
          Elegant Event Decoration Services
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-heading text-white font-bold mb-6 leading-tight"
        >
          SK Decor & <br/> Event Planner
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-200 font-heading italic mb-10 max-w-2xl mx-auto"
        >
          "If You Can Dream It, We Can Create It..."
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a 
            href="#gallery" 
            className="px-8 py-4 bg-primary text-white font-medium uppercase tracking-wider rounded-full hover:bg-primary-light hover:text-dark transition-all shadow-lg shadow-primary/30 w-full sm:w-auto text-center"
          >
            Explore Gallery
          </a>
          <a 
            href="#contact" 
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium uppercase tracking-wider rounded-full hover:bg-white hover:text-dark transition-colors w-full sm:w-auto text-center"
          >
            Book Now
          </a>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 hidden md:block"
      >
        <div className="w-24 h-24 border border-primary/30 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 border border-primary/50 rounded-full" />
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-10 hidden md:block"
      >
        <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
          <div className="w-20 h-20 border border-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
